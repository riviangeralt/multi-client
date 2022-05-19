import React from 'react';
import { Switch } from 'antd';
import { Controller, useFormContext } from "react-hook-form";
import ShowErrorMessage from '../Error'

const FormSwitch = (props) => {
    const {
        control,
        name,
        error,
        rules,
        defaultChecked
    } = props
    const methods = useFormContext()
    const handleChange = (value) => {
        methods.setValue(name, value)
    }
    return (
        <>
            <Controller
                render={() =>
                    <Switch defaultChecked={defaultChecked || false} onChange={(e) => handleChange(e)} />
                }
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultChecked || null}
            />
            <ShowErrorMessage
                errors={error} name={name}
            />
        </>
    );
};

export default FormSwitch;
