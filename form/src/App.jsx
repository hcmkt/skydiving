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
              defaults={settings.reservationDays}
              stackProps={{w: "320px"}}
              boxProps={{pb: "6px"}}
              ref={reservationDayRefs}
            />
            <MultipleChoice
              title="時刻"
              options={reservationTimes}
              defaults={settings.reservationTimes}
              stackProps={{w: "288px"}}
              boxProps={{pb: "6px"}}
              ref={reservationTimeRefs}
            />
            <MultipleChoice
              title="カメラマン"
              options={photographers}
              defaults={settings.photographers}
              stackProps={{w: "112px"}}
              boxProps={{pb: "6px"}}
              ref={photographerRefs}
            />
            <Vacancy
              vacancy={settings.vacancy}
              boxProps={{pb: "6px"}}
              ref={vacancyRef}
            />
          </div>
          <div className="pb-2.5">
            <h2 className="text-2xl pb-2">通知</h2>
            <Notification
              notification={settings.notification}
              boxProps={{pb: "6px"}}
              ref={notificationRef}
            />
            <MultipleChoice
              title="時刻"
              options={notificationTimes}
              defaults={settings.notificationTimes}
              flag={true}
              stackProps={{w: "320px", wrap: "wrap", rowGap: "4px"}}
              boxProps={{pb: "6px"}}
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
