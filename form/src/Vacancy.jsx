const Vacancy = (props) => {
  const { vacancy, ref } = props;

  return (
    <div className="pb-1.5">
      <p className="text-lg">最低枠数</p>
      <div>
        <input
          type="text"
          inputMode="numeric"
          ref={ref}
          defaultValue={vacancy}
          className="border text-center w-8 mt-1"
        />
      </div>
    </div>
  );
};

export default Vacancy;
