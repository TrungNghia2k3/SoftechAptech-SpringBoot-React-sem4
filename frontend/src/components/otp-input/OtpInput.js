import React from "react";
import PropTypes from "prop-types";
import "./OtpInput.css"; // Ensure to create the corresponding CSS file for styling

const OtpInput = ({ numInputs, value, onChange, separator, inputStyle }) => {
  const handleChange = (e, index) => {
    const newValue = e.target.value;
    if (newValue.length <= 1 && /\d/.test(newValue)) {
      const otpArray = value.split("");
      otpArray[index] = newValue;
      onChange(otpArray.join(""));
      if (newValue && index < numInputs - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const otpArray = value.split("");
      otpArray[index - 1] = "";
      onChange(otpArray.join(""));
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="otp-input-container">
      {Array(numInputs)
        .fill("")
        .map((_, index) => (
          <React.Fragment key={index}>
            <input
              id={`otp-input-${index}`}
              className={inputStyle}
              type="text"
              value={value[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              maxLength={1}
            />
            {index < numInputs - 1 && separator}
          </React.Fragment>
        ))}
    </div>
  );
};

OtpInput.propTypes = {
  numInputs: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  separator: PropTypes.node,
  inputStyle: PropTypes.string,
};

OtpInput.defaultProps = {
  separator: null,
  inputStyle: "",
};

export default OtpInput;
