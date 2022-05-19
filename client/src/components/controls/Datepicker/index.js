import React from "react";
import { DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import ShowErrorMessage from "../Error";
import moment from "moment";

const FormDatePicker = (props) => {
  const { control, name, error, rules, defaultValue } = props;
  const methods = useFormContext();
  const handleChange = (value, string) => {
    methods.setValue(name, string);
  };
  return (
    <>
      <Controller
        render={(new_props) => (
          <DatePicker
            onChange={(e, i) => handleChange(e, i)}
            {...new_props}
            defaultValue={
              defaultValue ? moment(defaultValue, "YYYY-MM-DD") : null
            }
            format={"DD-MM-YYYY"}
            width={"100%"}
          />
        )}
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue ? defaultValue : null}
      />
      <ShowErrorMessage errors={error} name={name} />
    </>
  );
};

export default FormDatePicker;
