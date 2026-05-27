import React from "react";
import { Button } from "@mui/material";

const PrimaryButton = ({
  children,
  onClick,
  disabled,
  size = "medium",
  ...rest
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size={size}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
