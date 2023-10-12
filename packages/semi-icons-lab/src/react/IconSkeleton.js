function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconSkeleton(props, svgRef) {
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
        y: 11,
        width: 21,
        height: 3,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 15,
        width: 21,
        height: 3,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 11,
        y: 2,
        width: 12,
        height: 3,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 11,
        y: 6,
        width: 9,
        height: 3,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 19,
        width: 11,
        height: 3,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 2,
        width: 7,
        height: 7,
        fill: "#6A6F7F"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconSkeleton);
export default ForwardRef;