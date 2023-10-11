function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconCheckbox(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 1.009,
        y: 3.1,
        width: 20,
        height: 20,
        rx: 3,
        transform: "rotate(-6 1.00949 3.10003)",
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M8.07416 12.9153L11.4236 16.0826L15.6645 8.59828",
        stroke: "white",
        strokeWidth: 3,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconCheckbox);
export default ForwardRef;