function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconPopconfirm(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 5,
        y: 8,
        width: 17,
        height: 14,
        rx: 2,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M8.46515 2.29217C8.23247 1.90171 7.66701 1.90171 7.43432 2.29217L5.82062 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H17C18.1046 19 19 18.1046 19 17V7C19 5.89543 18.1046 5 17 5H10.0789L8.46515 2.29217Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 7,
        y: 13,
        width: 4,
        height: 3,
        rx: 1,
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 13,
        y: 13,
        width: 4,
        height: 3,
        rx: 1,
        fill: "#324350"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconPopconfirm);
export default ForwardRef;