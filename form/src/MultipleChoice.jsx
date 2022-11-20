import { forwardRef } from "react";

const MultipleChoice = forwardRef((props, ref) => {
  const { title, options, defaults, classes, flag = false } = props;

  return (
    <div className="pb-1.5">
      <p className="text-lg">{title}</p>
      <div className={"flex justify-around mx-auto " + classes}>
        {options.map((option, i) => (
          <label className={flag ? "w-1/4" : ""} key={i}>
            <input
              type="checkbox"
              ref={ref.current[i]}
              defaultChecked={defaults?.includes(option)}
              className="mr-1 align-[-2px]"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
});

export default MultipleChoice;
