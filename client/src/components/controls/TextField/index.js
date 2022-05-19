import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "antd";
import ShowErrorMessage from "../Error";

const TextField = (props) => {
  const {
    control,
    name,
    rules,
    defaultValue,
    placeholder,
    disabled,
    addonBefore,
    addonAfter,
    prefix,
    suffix,
    onChange,
    register,
    error,
  } = props;
  const methods = useFormContext();
  return (
    <>
      <Controller
        render={(new_props) => (
          <Input
            {...new_props}
            {...props}
            placeholder={placeholder}
            disabled={disabled || false}
            addonBefore={addonBefore || null}
            addonAfter={addonAfter || null}
            prefix={prefix || null}
            suffix={suffix || null}
            onChange={
              !onChange
                ? (e) => methods.setValue(name, e.target.value)
                : onChange
            }
            autoComplete="off"
          />
        )}
        control={control}
        name={name}
        rules={rules}
        register={register}
        defaultValue={defaultValue || ""}
      />
      <ShowErrorMessage errors={error} name={name} />
    </>
  );
};

export default TextField;
