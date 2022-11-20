const reservationDays = ["月", "火", "水", "木", "金", "土", "日"];
const reservationTimes = ["08:15", "10:00", "12:00", "14:00"];
const photographers = ["有", "無"];
const notificationTimes = [...Array(24).keys()].map(x => String(x).padStart(2, "0") + ":00");

export { reservationDays, reservationTimes, photographers, notificationTimes };
