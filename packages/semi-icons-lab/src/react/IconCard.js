function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconCard(props, svgRef) {
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
        y: 4,
        width: 22,
        height: 16,
        rx: 2,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 5,
        y: 8,
        width: 14,
        height: 4,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 5,
        y: 14,
        width: 8,
        height: 2,
        fill: "#AAB2BF"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconCard);
export default ForwardRef;