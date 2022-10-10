import os
import datetime
import locale
import requests
from linebot import LineBotApi
from linebot.models import TextSendMessage
import ratelimit


@ratelimit.sleep_and_retry
@ratelimit.limits(calls=1, period=1)
def get_reservation(start_date: datetime.datetime, end_date: datetime.datetime) -> list[dict]:
    start_date_str = start_date.isoformat(timespec='seconds')
    end_date_str = end_date.isoformat(timespec='seconds')
    url = 'https://coubic.com/api/v2/merchants/tokyoskydivingclub/booking_events'
    params = {'renderer':'widgetCalendar', 'start':start_date_str, 'end':end_date_str}
    reservation = requests.get(url, params=params).json()
    return reservation

def get_reservations(start_date: datetime.datetime, days: int) -> list[dict]:
    max_days = 50
    reservations = []
    for i in range(days//max_days):
        end_date = get_datetime_after_days(start_date, max_days)
        reservations += get_reservation(start_date, end_date)
        start_date += datetime.timedelta(days=max_days)
    if odd_days := days%max_days:
        end_date = get_datetime_after_days(start_date, odd_days)
        reservations += get_reservation(start_date, end_date)
    return reservations

def get_datetime_after_days(dt: datetime.datetime, days: int) -> datetime.datetime:
    return dt + datetime.timedelta(days=days) - datetime.timedelta(seconds=1)

def format_reservations(reservations: list[dict]) -> str:
    formatted_reservations = []
    for reservation in reservations:
        date = datetime.datetime.strptime(reservation['start'], '%Y-%m-%d %H:%M').strftime('%Y/%m/%d(%a) %H:%M')
        vacancy = reservation['vacancy']
        formatted_reservations.append(f"{date}\t{vacancy}")
    return '\n'.join(formatted_reservations)

def send_post_request(text: str) -> None:
    line_bot_api = LineBotApi(os.environ['CHANNEL_ACCESS_TOKEN'])
    line_bot_api.push_message(os.environ['TO'], TextSendMessage(text=text))
    return

def is_skydiving(reservation: dict) -> bool:
    return reservation['title'] == 'ｽｶｲﾀﾞｲﾋﾞﾝｸﾞ'

def is_vacant(reservation: dict, vacancy: int = 1) -> bool:
    return reservation['vacancy'] >= vacancy

def in_dow(reservation: dict, dow: list[dict] = ['土', '日']) -> bool:
    dt = datetime.datetime.strptime(reservation['start'], '%Y-%m-%d %H:%M')
    return dt.strftime('%a') in dow


if __name__ == '__main__':
    locale.setlocale(locale.LC_TIME, 'ja_JP.UTF-8')
    reservations = get_reservations(datetime.datetime.now(), 120)
    filtered_reservations = filter(lambda x: is_skydiving(x) and is_vacant(x, 2) and in_dow(x), reservations)
    formatted_reservations = format_reservations(filtered_reservations)
    send_post_request(formatted_reservations)
