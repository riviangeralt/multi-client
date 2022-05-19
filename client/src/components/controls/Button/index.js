import React from "react";
import { Button as AntdButton } from "antd";

const Button = (props) => {
  const {
    type,
    disabled,
    size,
    variant,
    loading,
    onClick,
    text,
    width,
    background,
    color,
    borderColor,
    margin,
    display,
    shadow,
    height,
    radius,
  } = props;
  return (
    <AntdButton
      type={variant || "primary"}
      disabled={disabled || false}
      size={size ? size : "middle"}
      htmlType={type || "button"}
      loading={loading || false}
      onClick={onClick}
      {...props}
      style={{
        display: display || undefined,
        background: background,
        color: color,
        ...(width ? { width: width } : undefined),
        ...(height ? { height: height } : undefined),
        ...(borderColor ? { borderColor: borderColor } : undefined),
        ...(margin ? { margin: margin } : undefined),
        ...(shadow ? { boxShadow: shadow } : undefined),
        ...(radius ? { borderRadius: radius } : undefined),
      }}
    >
      {props.children || text}
    </AntdButton>
  );
};

export default Button;
