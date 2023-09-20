function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconSpace(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: 2,
        width: 2,
        height: 20,
        rx: 1,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 21,
        y: 2,
        width: 2,
        height: 20,
        rx: 1,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M6 12L18 12",
        stroke: "#4CC3FA",
        strokeWidth: 2,
        strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M15 9L18 12L15 15",
        stroke: "#4CC3FA",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M9 9L6 12L9 15",
        stroke: "#4CC3FA",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconSpace);
export default ForwardRef;