function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconBackTop(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M2.9685 14.1284L12 6L21.0315 14.1284C21.3721 14.4349 21.1553 15 20.697 15H16V22H8V15H3.30298C2.84474 15 2.62789 14.4349 2.9685 14.1284Z",
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 3,
        y: 2,
        width: 18,
        height: 4,
        rx: 1,
        fill: "#AAB2BF"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconBackTop);
export default ForwardRef;