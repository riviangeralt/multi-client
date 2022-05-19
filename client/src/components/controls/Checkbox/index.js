import React from 'react';
import { Checkbox } from 'antd';
import { Controller, useFormContext } from "react-hook-form";
import ShowErrorMessage from '../Error'

const FormCheckbox = (props) => {
    const {
        control,
        name,
        error,
        rules,
        label,
        defaultChecked
    } = props
    const methods = useFormContext()
    const handleChange = (e) => {
        methods.setValue(name, e.target.checked)
    }
    return (
        <>
            <Controller
                render={() =>
                    <Checkbox onChange={(e) => handleChange(e)} defaultChecked={defaultChecked || false}>{label}</Checkbox>
                }
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultChecked || false}
            />
            <ShowErrorMessage
                errors={error} name={name}
            />
        </>
    );
};

export default FormCheckbox;
