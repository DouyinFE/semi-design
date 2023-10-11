function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconTransfer(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M7.07021 20.351L1.58652 15.9687C1.28595 15.7285 1.28595 15.2715 1.58652 15.0313L7.07021 10.649C7.39763 10.3874 7.88235 10.6205 7.88235 11.0396L7.88235 13.3L13.55 13.3C13.7985 13.3 14 13.5015 14 13.75L14 17.25C14 17.4985 13.7985 17.7 13.55 17.7L7.88235 17.7L7.88235 19.9604C7.88235 20.3795 7.39763 20.6126 7.07021 20.351Z",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M13.807 5.62764L21.3911 11.5264C21.6999 11.7666 21.6999 12.2334 21.3911 12.4736L13.807 18.3724C13.4785 18.6278 13 18.3938 13 17.9777L13 14.8L7.5 14.8C7.22386 14.8 7 14.5761 7 14.3L7 9.7C7 9.42386 7.22386 9.2 7.5 9.2L13 9.2L13 6.02232C13 5.60625 13.4785 5.3722 13.807 5.62764Z",
        fill: "white"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M14.807 4.62764L22.3911 10.5264C22.6999 10.7666 22.6999 11.2334 22.3911 11.4736L14.807 17.3724C14.4785 17.6278 14 17.3938 14 16.9777L14 13.8L8.5 13.8C8.22386 13.8 8 13.5761 8 13.3L8 8.7C8 8.42386 8.22386 8.2 8.5 8.2L14 8.2L14 5.02232C14 4.60625 14.4785 4.3722 14.807 4.62764Z",
        fill: "#4CC3FA"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconTransfer);
export default ForwardRef;