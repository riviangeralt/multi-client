import React from 'react';
import { Checkbox } from 'antd';
import { Controller, useFormContext } from "react-hook-form";
import ShowErrorMessage from '../Error'

const CheckboxGroup = (props) => {
    const {
        control,
        name,
        error,
        rules,
        label,
        options,
        defaultValue
    } = props
    const methods = useFormContext()
    const handleChange = (value) => {
        methods.setValue(name, value)
    }
    return (
        <>
            <Controller
                render={() =>
                    <Checkbox.Group onChange={(e) => handleChange(e)} defaultValue={defaultValue || false} options={options}>{label}</Checkbox.Group>
                }
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue}
            />
            <ShowErrorMessage
                errors={error} name={name}
            />
        </>
    );
};

export default CheckboxGroup;
