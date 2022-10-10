from datetime import datetime

from database import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(255), primary_key=True)
    notification = db.Column(db.Boolean, default=True, nullable=False)
    vacancy = db.Column(db.Integer, default=1, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
    photographers = db.relationship("Photographer", backref="user")
    notification_times = db.relationship("NotificationTime", backref="user")
    reservation_times = db.relationship("ReservationTime", backref="user")
    reservation_days = db.relationship("ReservationDay", backref="user")


class Photographer(db.Model):
    __tablename__ = "photographers"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), db.ForeignKey("users.id"), nullable=False)
    photographer = db.Column(db.String(1), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)


class NotificationTime(db.Model):
    __tablename__ = "notification_times"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), db.ForeignKey("users.id"), nullable=False)
    time = db.Column(db.Time, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)


class ReservationTime(db.Model):
    __tablename__ = "reservation_times"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), db.ForeignKey("users.id"), nullable=False)
    time = db.Column(db.Time, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)


class ReservationDay(db.Model):
    __tablename__ = "reservation_days"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), db.ForeignKey("users.id"), nullable=False)
    day = db.Column(db.String(1), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)
