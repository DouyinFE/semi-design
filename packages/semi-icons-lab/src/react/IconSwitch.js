function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconSwitch(props, svgRef) {
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
        y: 1,
        width: 20,
        height: 10,
        rx: 5,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("circle", {
        cx: 7.5,
        cy: 5.99997,
        r: 3.5,
        fill: "white"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 13,
        width: 20,
        height: 10,
        rx: 5,
        fill: "#3BCE4A"
    }), /*#__PURE__*/React.createElement("circle", {
        cx: 16.5,
        cy: 18,
        r: 3.5,
        fill: "white"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconSwitch);
export default ForwardRef;