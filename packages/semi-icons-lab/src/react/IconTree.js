function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconTree(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 9,
        y: 16,
        width: 13,
        height: 5,
        rx: 0.5,
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 9,
        y: 9,
        width: 13,
        height: 5,
        rx: 0.5,
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 6C5.55228 6 6 6.44772 6 7V18H7C7.55228 18 8 18.4477 8 19C8 19.5523 7.55228 20 7 20H5C4.44772 20 4 19.5523 4 19V7C4 6.44772 4.44772 6 5 6Z",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 12C5 11.4477 5.44772 11 6 11H7C7.55228 11 8 11.4477 8 12C8 12.5523 7.55228 13 7 13H6C5.44772 13 5 12.5523 5 12Z",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 2,
        width: 15,
        height: 5,
        rx: 0.5,
        fill: "#4CC3FA"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconTree);
export default ForwardRef;