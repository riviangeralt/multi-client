import React from 'react';
import { TimePicker } from 'antd';
import { Controller, useFormContext } from "react-hook-form";
import ShowErrorMessage from '../Error'
import moment from 'moment';

const FormTimePicker = (props) => {
    const {
        control,
        name,
        error,
        rules,
        defaultValue
    } = props
    const methods = useFormContext()
    const handleChange = (value, string) => {
        methods.setValue(name, string)
    }
    return (
        <>
            <Controller
                render={(new_props) =>
                    <TimePicker onChange={(e, i) => handleChange(e, i)} {...new_props}
                        defaultValue={defaultValue ? moment(defaultValue, 'HH:mm:ss') : null}
                    />
                }
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue ? defaultValue : null}
            />
            <ShowErrorMessage
                errors={error} name={name}
            />
        </>
    );
};

export default FormTimePicker;
