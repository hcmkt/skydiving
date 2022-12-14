import datetime
import json
import math
import os

import flask_sqlalchemy
import ratelimit
import requests
from linebot.models import TextSendMessage

from database import db
from init import line_bot_api
from models import NotificationTime, Photographer, ReservationDay, ReservationTime, User


def add_user(id: int) -> None:
    if db.session.query(User).filter_by(id=id).first() is not None:
        return
    reservation_days = ["土", "日"]
    reservation_times = ["08:15", "10:00", "12:00", "14:00"]
    photographers = ["無", "有"]
    notification_times = [datetime.time(hour=i).strftime("%H:%M") for i in range(7, 23)]
    user = User(id=id)
    db.session.add(user)
    for day in reservation_days:
        reservation_day = ReservationDay(user_id=id, day=day)
        db.session.add(reservation_day)
    for time in reservation_times:
        reservation_time = ReservationTime(user_id=id, time=time)
        db.session.add(reservation_time)
    for photographer in photographers:
        photographer = Photographer(user_id=id, photographer=photographer)
        db.session.add(photographer)
    for time in notification_times:
        notification_time = NotificationTime(user_id=id, time=time)
        db.session.add(notification_time)
    db.session.commit()


@ratelimit.sleep_and_retry
@ratelimit.limits(calls=1, period=1)
def get_reservation(start_date: datetime.datetime, end_date: datetime.datetime) -> list[dict]:
    start_date_str = start_date.isoformat(timespec="seconds")
    end_date_str = end_date.isoformat(timespec="seconds")
    url = "https://coubic.com/api/v2/merchants/tokyoskydivingclub/booking_events"
    params = {"renderer": "widgetCalendar", "start": start_date_str, "end": end_date_str}
    reservation = requests.get(url, params=params).json()
    return reservation


def get_reservations(start_date: datetime.datetime, days: int) -> list[dict]:
    max_days = 50
    reservations = []
    for i in range(days // max_days):
        end_date = get_datetime_after_days(start_date, max_days)
        reservations += get_reservation(start_date, end_date)
        start_date += datetime.timedelta(days=max_days)
    if odd_days := days % max_days:
        end_date = get_datetime_after_days(start_date, odd_days)
        reservations += get_reservation(start_date, end_date)
    return reservations


def get_datetime_after_days(dt: datetime.datetime, days: int) -> datetime.datetime:
    return dt + datetime.timedelta(days=days) - datetime.timedelta(seconds=1)


def format_reservations(reservations: list[dict]) -> str:
    formatted_reservations = []
    for reservation in reservations:
        date = datetime.datetime.strptime(reservation["start"], "%Y-%m-%d %H:%M").strftime("%Y/%m/%d(%a) %H:%M")
        photographer = "有" if reservation["title"] == "カメラマン付" else "無"
        vacancy = reservation["vacancy"]
        formatted_reservations.append(f"{date} {vacancy} {photographer}")
    return "\n".join(formatted_reservations)


def is_vacant(reservation: dict, vacancy: int = 1) -> bool:
    return reservation["vacancy"] >= vacancy


def in_photographers(reservation: dict, photographers: list[str] = ["無", "有"]) -> bool:
    table = {"ｽｶｲﾀﾞｲﾋﾞﾝｸﾞ": "無", "カメラマン付": "有"}
    return table[reservation["title"]] in photographers


def in_days(reservation: dict, days: list[str] = ["土", "日"]) -> bool:
    dt = datetime.datetime.strptime(reservation["start"], "%Y-%m-%d %H:%M")
    return dt.strftime("%a") in days


def in_times(reservation: dict, times: list[str] = ["08:15", "10:00", "12:00", "14:00"]) -> bool:
    dt = datetime.datetime.strptime(reservation["start"], "%Y-%m-%d %H:%M")
    return dt.strftime("%H:%M") in times


def get_all_reservations(from_site: bool = True) -> list[dict]:
    if from_site:
        reservations = get_reservations(datetime.datetime.now(), 120)
    else:
        try:
            with open("result.json", "r") as f:
                reservations = json.load(f)
        except FileNotFoundError:
            store_all_reservations()
            reservations = get_all_reservations(False)
    return reservations


def store_all_reservations() -> None:
    reservations = get_reservations(datetime.datetime.now(), 120)
    with open("result.json", "w") as f:
        json.dump(reservations, f, ensure_ascii=False)


def get_formatted_all_reservations() -> str:
    reservations = get_all_reservations()
    filtered_reservations = filter(lambda x: is_vacant(x), reservations)
    formatted_reservations = format_reservations(filtered_reservations)
    return formatted_reservations


def get_formatted_custom_reservations(id: int, flag: bool) -> str:
    reservations = get_all_reservations(flag)
    settings = get_settings(id)
    filtered_reservations = filter(
        lambda x: is_vacant(x, settings["vacancy"])
        and in_days(x, settings["reservationDays"])
        and in_times(x, settings["reservationTimes"])
        and in_photographers(x, settings["photographers"]),
        reservations,
    )
    formatted_reservations = format_reservations(filtered_reservations)
    return formatted_reservations if formatted_reservations != "" else "該当なし"


def get_settings(id: int) -> dict:
    notification = db.session.query(User).filter_by(id=id).first().notification
    vacancy = db.session.query(User).filter_by(id=id).first().vacancy
    photographers = [photographer.photographer for photographer in db.session.query(Photographer).filter_by(user_id=id).all()]
    notification_times = [time.time.strftime("%H:%M") for time in db.session.query(NotificationTime).filter_by(user_id=id).all()]
    reservation_times = [time.time.strftime("%H:%M") for time in db.session.query(ReservationTime).filter_by(user_id=id).all()]
    reservation_days = [day.day for day in db.session.query(ReservationDay).filter_by(user_id=id).all()]
    return {
        "notification": notification,
        "vacancy": vacancy,
        "photographers": photographers,
        "notificationTimes": notification_times,
        "reservationTimes": reservation_times,
        "reservationDays": reservation_days,
    }


def get_official_site_link() -> str:
    return "https://tokyoskydivingclub.jp"


def get_settings_form_link() -> str:
    return os.getenv("LIFF_URL")


def validate_token(access_token: str) -> bool:
    url = "https://api.line.me/oauth2/v2.1/verify"
    params = {"access_token": access_token}
    response = requests.get(url, params=params)
    return response.status_code == 200


def get_user_id(access_token: str) -> int:
    url = "https://api.line.me/v2/profile"
    headers = {"Authorization": "Bearer " + access_token}
    response = requests.get(url, headers=headers)
    return response.json()["userId"]


def update_single(id: int, key: str, value: any) -> None:
    user = db.session.query(User).filter_by(id=id).first()
    setattr(user, key, value)
    db.session.commit()


def validate_multiple(inputs: list[any], candidates: list[any]) -> list[any]:
    return list(set(inputs) & set(candidates))


def update_multiple(id: int, model: flask_sqlalchemy.model.DefaultMeta, key: str, inputs: list[any], candidates: list[any]) -> None:
    new = set(validate_multiple(inputs, candidates))
    old = set(
        [
            getattr(record, key).strftime("%H:%M") if type(getattr(record, key)) is datetime.time else getattr(record, key)
            for record in db.session.query(model).filter_by(user_id=id).all()
        ]
    )
    add = new - old
    delete = old - new
    for element in add:
        db.session.add(model(**{"user_id": id, key: element}))
    for element in delete:
        db.session.delete(db.session.query(model).filter_by(**{"user_id": id, key: element}).first())
    db.session.commit()


def update_all(json: dict) -> None:
    id = get_user_id(json["accessToken"])
    update_single(id, "notification", json["notification"])
    update_single(id, "vacancy", json["vacancy"])
    update_multiple(id, Photographer, "photographer", json["photographer"], ["有", "無"])
    update_multiple(id, NotificationTime, "time", json["notificationTimes"], [datetime.time(hour=i).strftime("%H:%M") for i in range(24)])
    update_multiple(id, ReservationTime, "time", json["reservationTimes"], ["08:15", "10:00", "12:00", "14:00"])
    update_multiple(id, ReservationDay, "day", json["reservationDays"], ["月", "火", "水", "木", "金", "土", "日"])


def notify() -> None:
    users = db.session.query(User).filter_by(notification=True).all()
    now = datetime.datetime.now()
    time = datetime.time(math.floor(now.hour + (now.minute + 30) / 60)).strftime("%H:%M")
    for user in users:
        notification_times = [time.time.strftime("%H:%M") for time in db.session.query(NotificationTime).filter_by(user_id=user.id).all()]
        if time in notification_times:
            formatted_reservations = get_formatted_custom_reservations(user.id, False)
            line_bot_api.push_message(user.id, TextSendMessage(text=formatted_reservations))
