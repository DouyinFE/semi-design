function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconDivider(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 2.75,
        y: 2.75,
        width: 18.5,
        height: 18.5,
        rx: 3,
        fill: "white",
        stroke: "#AAB2BF",
        strokeWidth: 1.5
    }), /*#__PURE__*/React.createElement("rect", {
        x: 5,
        y: 11,
        width: 4,
        height: 2,
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 15,
        y: 11,
        width: 4,
        height: 2,
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 10,
        y: 11,
        width: 4,
        height: 2,
        fill: "#324350"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 10,
        y: 11,
        width: 4,
        height: 2,
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 5,
        y: 16,
        width: 14,
        height: 2,
        fill: "#324350"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 5,
        y: 6,
        width: 14,
        height: 2,
        fill: "#324350"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconDivider);
export default ForwardRef;