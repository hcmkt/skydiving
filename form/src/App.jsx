import { useEffect, useState, useRef, createRef } from "react";
import liff from "@line/liff";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast"
import MultipleChoice from "./MultipleChoice";
import Vacancy from "./Vacancy";
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

  const getNotificationForm = () => {
    return (
      <div className="pb-1.5">
        <p className="text-lg">通知</p>
        <div className="flex justify-around mx-auto w-28">
          <label key="on">
            <input
              type="radio"
              ref={notificationRef}
              name="notification"
              defaultChecked={settings.notification}
              className="mr-1 align-[-2px]"
            />
            ON
          </label>
          <label key="off">
            <input
              type="radio"
              name="notification"
              defaultChecked={!settings.notification}
              className="mr-1 align-[-2px]"
            />
            OFF
          </label>
        </div>
      </div>
    );
  };

  const getSubmitForm = () => {
    return (
      <input
        type="submit"
        value="更新"
        className="text-lg text-white bg-slate-500 py-1 px-8 rounded active:bg-slate-600"
      />
    );
  };

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
              refs={reservationDayRefs}
              defaluts={settings.reservationDays}
              classes="w-80"
            />
            <MultipleChoice
              title="時刻"
              options={reservationTimes}
              refs={reservationDayRefs}
              defaluts={settings.reservationTimes}
              classes="w-72"
            />
            <MultipleChoice
              title="カメラマン"
              options={photographers}
              refs={photographerRefs}
              defaluts={settings.photographers}
              classes="w-28"
            />
            <Vacancy
              vacancy={settings.vacancy}
              ref={vacancyRef}
            />
          </div>
          <div className="pb-2.5">
            <h2 className="text-2xl pb-2">通知</h2>
            {getNotificationForm()}
            <MultipleChoice
              title="時刻"
              options={notificationTimes}
              refs={notificationTimeRefs}
              defaluts={settings.notificationTimes}
              classes="w-80 flex-wrap gap-y-0.5"
              flag={true}
            />
          </div>
        </div>
        {getSubmitForm()}
      </form>
      <Toaster />
    </div>
  );
}

export default App;
