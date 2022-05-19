import React from "react";
import { Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import ShowErrorMessage from "../Error";
const { Option } = Select;

const CustomSelect = (props) => {
  const { control, name, error, rules, defaultValue, options, width } = props;
  const methods = useFormContext();
  const handleChange = (e) => {
    methods.setValue(name, e);
  };
  return (
    <>
      <Controller
        render={(new_props) => (
          <Select
            defaultValue={defaultValue}
            style={{ width: width ? width : "100%" }}
            onChange={(e) => handleChange(e)}
            {...new_props}
            {...props}
          >
            {options.map((option, index) => {
              return (
                <Option
                  key={index}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.title || option.label}
                </Option>
              );
            })}
          </Select>
        )}
        name={name}
        defaultValue={defaultValue}
        control={control}
        rules={rules}
      />
      <ShowErrorMessage errors={error} name={name} />
    </>
  );
};

export default CustomSelect;
