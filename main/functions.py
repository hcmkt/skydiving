import datetime

from database import db
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
