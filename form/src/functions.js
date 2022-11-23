import { createRef } from "react";
import axios from "axios";
import liff from "@line/liff";
import toast from "react-hot-toast"
import { reservationDays, reservationTimes, photographers, notificationTimes } from "./constants";

const declareMultipleRefs = (options, refs) => {
  options.map((_, i) => {refs.current[i] = createRef();});
};

const initialize = () => {
  liff
    .init({
      liffId: import.meta.env.VITE_LIFF_ID,
      withLoginOnExternalBrowser: true,
    })
    .catch((e) => {
      toast.error('通信に失敗しました。');
    });
};

const fetchSettings = (setSettings) => () => {
    liff.ready.then(() => {
      const accessToken = liff.getAccessToken();
      (async () => {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/settings", {params: {'token': accessToken}});
        setSettings(response.data);
      })();
    });
};

const getMultipleChoice = (options, refs) => options.filter((_, i) => refs.current[i].current.checked);

const handleSubmit = (refs) => () => {
  const data = {
    "accessToken": liff.getAccessToken(),
    "reservationDays": getMultipleChoice(reservationDays, refs.reservationDayRefs),
    "reservationTimes": getMultipleChoice(reservationTimes, refs.reservationTimeRefs),
    "photographer": getMultipleChoice(photographers, refs.photographerRefs),
    "notificationTimes": getMultipleChoice(notificationTimes, refs.notificationTimeRefs),
    "vacancy": refs.vacancyRef.current.value,
    "notification": refs.notificationRef.current.checked,
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

export { declareMultipleRefs, initialize, fetchSettings, handleSubmit };
