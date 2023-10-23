function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconSideSheet(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M2 5C2 3.34315 3.34315 2 5 2H14V22H5C3.34315 22 2 20.6569 2 19V5Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M14 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H14V2Z",
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 11,
        y: 8,
        width: 2,
        height: 8,
        rx: 1,
        fill: "#AAB2BF"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconSideSheet);
export default ForwardRef;