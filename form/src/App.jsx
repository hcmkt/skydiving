import { useEffect, useState, useRef, createRef } from "react";
import liff from "@line/liff";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast"
import MultipleChoice from "./MultipleChoice";
import Vacancy from "./Vacancy";
import Notification from "./Notification";
import Submission from "./Submission";
import "./App.css";

function App() {
  const declareMultipleRefs = (options, refs) => {
    options.forEach((_, i) => {
      refs.current[i] = createRef();
    });
  };

  const [settings, setSettings] = useState([]);

  const reservationDays = ["月", "火", "水", "木", "金", "土", "日"];
  const reservationDayRefs = useRef([]);
  declareMultipleRefs(reservationDays, reservationDayRefs);

  const reservationTimes = ["08:15", "10:00", "12:00", "14:00"];
  const reservationTimeRefs = useRef([]);
  declareMultipleRefs(reservationTimes, reservationTimeRefs);

  const photographers = ["有", "無"];
  const photographerRefs = useRef([]);
  declareMultipleRefs(photographers, photographerRefs);

  const notificationTimes = [...Array(24).keys()].map(x => String(x).padStart(2, "0") + ":00");
  const notificationTimeRefs = useRef([]);
  declareMultipleRefs(notificationTimes, notificationTimeRefs);

  const vacancyRef = useRef();
  const notificationRef = useRef();

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        withLoginOnExternalBrowser: true,
      })
      .catch((e) => {
        toast.error('通信に失敗しました。');
      });
  });

  useEffect(() => {
    liff.ready.then(() => {
      const accessToken = liff.getAccessToken();
      const getSettings = async () => {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/settings", {params: {'token': accessToken}});
        setSettings(response.data);
      }
      getSettings();
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      "accessToken": liff.getAccessToken(),
      "reservationDays": reservationDays.filter((_, i) => reservationDayRefs.current[i].current.checked),
      "reservationTimes": reservationTimes.filter((_, i) => reservationTimeRefs.current[i].current.checked),
      "photographer": photographers.filter((_, i) => photographerRefs.current[i].current.checked),
      "notificationTimes": notificationTimes.filter((_, i) => notificationTimeRefs.current[i].current.checked),
      "vacancy": vacancyRef.current.value,
      "notification": notificationRef.current.checked,
    };
    toast.promise(
      axios.put(import.meta.env.VITE_API_URL + "/update", data),
      {
        loading: 'Loading',
        success: 'Success',
        error: 'Error',
      }
    )
  };

  return (
    <div className="text-center my-10">
      <h1 className="text-3xl pb-3">設定</h1>
      <form onSubmit={handleSubmit}>
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
