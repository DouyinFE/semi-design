function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconModal(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 2,
        width: 20,
        height: 20,
        rx: 3,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 4,
        y: 6,
        width: 16,
        height: 12,
        rx: 1,
        fill: "white"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 6,
        y: 13,
        width: 5,
        height: 3,
        rx: 1,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 13,
        y: 13,
        width: 5,
        height: 3,
        rx: 1,
        fill: "#4CC3FA"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconModal);
export default ForwardRef;