function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconCollapsible(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M2.72361 5.44721C2.39116 4.78231 2.87465 4 3.61803 4H20.382C21.1253 4 21.6088 4.78231 21.2764 5.44721L18 12H6L2.72361 5.44721Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M2.72361 18.5528C2.39116 19.2177 2.87465 20 3.61803 20H20.382C21.1253 20 21.6088 19.2177 21.2764 18.5528L18 12H6L2.72361 18.5528Z",
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2V10",
        stroke: "#4CC3FA",
        strokeWidth: 2,
        strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M9 7L12 10L15 7",
        stroke: "#4CC3FA",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M12 22V14",
        stroke: "#4CC3FA",
        strokeWidth: 2,
        strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M9 17L12 14L15 17",
        stroke: "#4CC3FA",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconCollapsible);
export default ForwardRef;