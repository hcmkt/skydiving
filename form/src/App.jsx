import { useEffect, useState, useRef } from "react";
import { Toaster } from "react-hot-toast"
import { Box, Heading, Button } from "@chakra-ui/react";
import MultipleChoice from "./MultipleChoice";
import Vacancy from "./Vacancy";
import Notification from "./Notification";
import { reservationDays, reservationTimes, photographers, notificationTimes } from "./constants";
import { declareMultipleRefs, initialize, fetchSettings, handleSubmit } from "./functions";

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
    <Box textAlign="center" my="40px">
      <Heading as="h1" fontSize="3xl" pb="12px">設定</Heading>
        <Box pb="12px">
          <Box pb="10px">
            <Heading as="h2" fontSize="2xl" pb="8px">予約</Heading>
            <MultipleChoice
              title="曜日"
              options={reservationDays}
              defaults={settings.reservationDays}
              stackProps={{w: "320px"}}
              boxProps={{pb: "8px"}}
              ref={reservationDayRefs}
            />
            <MultipleChoice
              title="時刻"
              options={reservationTimes}
              defaults={settings.reservationTimes}
              stackProps={{w: "288px"}}
              boxProps={{pb: "8px"}}
              ref={reservationTimeRefs}
            />
            <MultipleChoice
              title="カメラマン"
              options={photographers}
              defaults={settings.photographers}
              stackProps={{w: "112px"}}
              boxProps={{pb: "8px"}}
              ref={photographerRefs}
            />
            <Vacancy
              vacancy={settings.vacancy}
              boxProps={{pb: "6px"}}
              ref={vacancyRef}
            />
          </Box>
          <Box pb="10px">
            <Heading as="h2" fontSize="2xl" pb="8px">通知</Heading>
            <Notification
              notification={settings.notification}
              boxProps={{pb: "8px"}}
              ref={notificationRef}
            />
            <MultipleChoice
              title="時刻"
              options={notificationTimes}
              defaults={settings.notificationTimes}
              flag={true}
              stackProps={{w: "320px", wrap: "wrap", rowGap: "4px"}}
              boxProps={{pb: "8px"}}
              ref={notificationTimeRefs}
            />
          </Box>
        </Box>
        <Button colorScheme="blue" onClick={handleSubmit(refs)}>更新</Button>
      <Toaster />
    </Box>
  );
}

export default App;
