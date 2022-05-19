import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ShowErrorMessage from "../Error";
import { AutoComplete } from "antd";

const { Option } = AutoComplete;

const Autocomplete = (props) => {
  const {
    control,
    name,
    error,
    rules,
    defaultValue,
    options,
    width,
    placeholder,
  } = props;
  const methods = useFormContext();
  const handleChange = (e) => {
    methods.setValue(name, e);
  };
  const filterOption = (inputValue, option) => {
    return (
      option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 ||
      option.description.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    );
  };

  return (
    <>
      <Controller
        render={(new_props) => (
          <AutoComplete
            defaultValue={defaultValue}
            placeholder={placeholder}
            style={{ width: width ? width : "100%" }}
            onChange={(e) => handleChange(e)}
            filterOption={filterOption}
            {...new_props}
            {...props}
          >
            {options.map((option, index) => {
              return (
                <Option key={index} value={option.value}>
                  {option.title || option.label}
                </Option>
              );
            })}
          </AutoComplete>
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

export default Autocomplete;
