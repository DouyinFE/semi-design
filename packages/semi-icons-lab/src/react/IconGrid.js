function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconGrid(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M22 2H2V22H22V2ZM20 4H4V20H20V4Z",
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M22 9H20V15H22V9ZM2 15H4V9H2V15Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M15 22V20H9V22H15ZM9 2V4H15V2H9Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 7,
        y: 7,
        width: 3,
        height: 3,
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 7,
        y: 10,
        width: 3,
        height: 4,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 14,
        y: 10,
        width: 3,
        height: 4,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 10,
        y: 7,
        width: 4,
        height: 3,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 10,
        y: 14,
        width: 4,
        height: 3,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 14,
        y: 7,
        width: 3,
        height: 3,
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 7,
        y: 14,
        width: 3,
        height: 3,
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 14,
        y: 14,
        width: 3,
        height: 3,
        fill: "#6A6F7F"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconGrid);
export default ForwardRef;