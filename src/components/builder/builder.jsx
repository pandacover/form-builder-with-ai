import React from "react";

const Builder = ({ builder, setBuilder }) => {
  const [value, setValue] = React.useState(JSON.stringify(builder, null, 2));

  const onChange = (value) => {
    setValue(value);
  };

  React.useEffect(() => {
    try {
      const parsed = JSON.parse(value);
      setBuilder(parsed);
    } catch (e) {
      console.log(e);
    }
  }, [value]);

  return (
    <div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export default Builder;
