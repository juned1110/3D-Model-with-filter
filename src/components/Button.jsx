import React from "react";
import PropTypes from "prop-types";

const Button = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      margin: "0 10px",
      padding: "10px 20px",
      backgroundColor: disabled ? "gray" : "blue",
      color: "white",
      borderRadius: "5px",
      cursor: disabled ? "not-allowed" : "pointer",
    }}
  >
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Button;
