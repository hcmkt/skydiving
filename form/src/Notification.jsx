import { forwardRef } from "react";

const Notification = forwardRef((props, ref) => {
  const { notification } = props;

  return (
    <div className="pb-1.5">
      <p className="text-lg">通知</p>
      <div className="flex justify-around mx-auto w-28">
        <label key="on">
          <input
            type="radio"
            ref={ref}
            name="notification"
            defaultChecked={notification}
            className="mr-1 align-[-2px]"
          />
          ON
        </label>
        <label key="off">
          <input
            type="radio"
            name="notification"
            defaultChecked={!notification}
            className="mr-1 align-[-2px]"
          />
          OFF
        </label>
      </div>
    </div>
  );
});

export default Notification;
