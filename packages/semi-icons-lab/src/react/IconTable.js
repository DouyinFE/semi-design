function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconTable(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M2.00001 5.00003C2.00001 3.89546 2.89544 3.00003 4.00001 3.00003H11V8.00003H2.00001V5.00003Z",
        fill: "#3BCE4A"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M13 3.00003H20C21.1046 3.00003 22 3.89546 22 5.00003V8.00003H13V3.00003Z",
        fill: "#3BCE4A"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 10,
        width: 9,
        height: 5,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 13,
        y: 10,
        width: 9,
        height: 5,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M2.00001 17H11V22H4.00001C2.89544 22 2.00001 21.1046 2.00001 20V17Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M13 17H22V20C22 21.1046 21.1046 22 20 22H13V17Z",
        fill: "#AAB2BF"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconTable);
export default ForwardRef;