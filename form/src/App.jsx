import { useEffect, useState, useRef } from "react";
import { Toaster } from "react-hot-toast"
import MultipleChoice from "./MultipleChoice";
import Vacancy from "./Vacancy";
import Notification from "./Notification";
import Submission from "./Submission";
import { reservationDays, reservationTimes, photographers, notificationTimes } from "./constants";
import { declareMultipleRefs, initialize, fetchSettings, handleSubmit } from "./functions";
import "./App.css";

function App() {
  const [settings, setSettings] = useState([]);
  const reservationDayRefs = useRef([]);
  const reservationTimeRefs = useRef([]);
  const photographerRefs = useRef([]);
  const notificationTimeRefs = useRef([]);
  const vacancyRef = useRef();
  const notificationRef = useRef();

  declareMultipleRefs(reservationDays, reservationDayRefs);
  declareMultipleRefs(reservationTimes, reservationTimeRefs);
  declareMultipleRefs(photographers, photographerRefs);
  declareMultipleRefs(notificationTimes, notificationTimeRefs);

  useEffect(initialize);
  useEffect(fetchSettings(setSettings), []);

  const refs = {
    reservationDayRefs,
    reservationTimeRefs,
    photographerRefs,
    notificationTimeRefs,
    vacancyRef,
    notificationRef,
  };

  return (
    <div className="text-center my-10">
      <h1 className="text-3xl pb-3">設定</h1>
      <form onSubmit={handleSubmit(refs)}>
        <div className="pb-3">
          <div className="pb-2.5">
            <h2 className="text-2xl pb-2">予約</h2>
            <MultipleChoice
              title="曜日"
              options={reservationDays}
              defaluts={settings.reservationDays}
              classes="w-80"
              ref={reservationDayRefs}
            />
            <MultipleChoice
              title="時刻"
              options={reservationTimes}
              defaluts={settings.reservationTimes}
              classes="w-72"
              ref={reservationTimeRefs}
            />
            <MultipleChoice
              title="カメラマン"
              options={photographers}
              defaluts={settings.photographers}
              classes="w-28"
              ref={photographerRefs}
            />
            <Vacancy
              vacancy={settings.vacancy}
              ref={vacancyRef}
            />
          </div>
          <div className="pb-2.5">
            <h2 className="text-2xl pb-2">通知</h2>
            <Notification
              notification={settings.notification}
              ref={notificationRef}
            />
            <MultipleChoice
              title="時刻"
              options={notificationTimes}
              defaluts={settings.notificationTimes}
              classes="w-80 flex-wrap gap-y-0.5"
              flag={true}
              ref={notificationTimeRefs}
            />
          </div>
        </div>
        <Submission />
      </form>
      <Toaster />
    </div>
  );
}

export default App;
