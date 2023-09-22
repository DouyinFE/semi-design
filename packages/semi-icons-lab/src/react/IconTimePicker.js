function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconTimePicker(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("circle", {
        cx: 12,
        cy: 12,
        r: 10.25,
        fill: "white",
        stroke: "#AAB2BF",
        strokeWidth: 1.5
    }), /*#__PURE__*/React.createElement("path", {
        d: "M14.5 6.5L12 12L17 17.5",
        stroke: "#6A6F7F",
        strokeWidth: 2.5,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
        cx: 12,
        cy: 12,
        r: 2,
        fill: "#324350"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M13 11.625L12 12L5 15",
        stroke: "#FBCD2C",
        strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
        cx: 12,
        cy: 12,
        r: 1,
        fill: "#FBCD2C"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconTimePicker);
export default ForwardRef;