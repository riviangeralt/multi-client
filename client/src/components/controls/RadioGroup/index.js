import React from "react";
import { Radio } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import ShowErrorMessage from "../Error";

const RadioGroup = (props) => {
  const { control, name, error, rules, options, value, onChange } = props;
  const methods = useFormContext();
  const handleChange = (e) => {
    methods.setValue(name, e.target.value);
  };
  return (
    <>
      <Controller
        render={() => (
          <Radio.Group
            onChange={onChange ? onChange : (e) => handleChange(e)}
            options={options}
            value={value}
          />
        )}
        name={name}
        control={control}
        rules={rules}
        // defaultValue={defaultValue || null}
      />
      <ShowErrorMessage errors={error} name={name} />
    </>
  );
};

export default RadioGroup;
