function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconPopover(props, svgRef) {
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
        y: 9,
        width: 13,
        height: 13,
        rx: 2,
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 7,
        width: 12,
        height: 12,
        rx: 2,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 8,
        y: 2,
        width: 11,
        height: 11,
        rx: 2,
        fill: "#DDE3E8"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconPopover);
export default ForwardRef;