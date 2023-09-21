function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconBanner(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 6,
        y: 19,
        width: 12,
        height: 1,
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 7.942,
        y: 0.897,
        width: 2,
        height: 22.2633,
        rx: 1,
        transform: "rotate(10 7.94241 0.896553)",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 14.085,
        y: 1.229,
        width: 2,
        height: 22.3119,
        rx: 1,
        transform: "rotate(-10 14.0853 1.22887)",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: 3,
        width: 22,
        height: 14,
        rx: 2,
        fill: "#FBCD2C"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 4,
        y: 6,
        width: 16,
        height: 2,
        fill: "#324350"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 4,
        y: 11,
        width: 9,
        height: 2,
        fill: "#324350"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconBanner);
export default ForwardRef;