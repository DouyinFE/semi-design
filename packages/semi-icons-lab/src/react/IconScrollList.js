function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconScrollList(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 2.75,
        y: 2.75,
        width: 18.5,
        height: 18.5,
        rx: 3,
        fill: "white",
        stroke: "#AAB2BF",
        strokeWidth: 1.5
    }), /*#__PURE__*/React.createElement("path", {
        d: "M16 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H16V2Z",
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 3.5,
        y: 7,
        width: 12.5,
        height: 5,
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M3.5 17H16V20.5H5.5C4.39543 20.5 3.5 19.6046 3.5 18.5V17Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M18.9991 4L20.2981 6.25H17.7L18.9991 4Z",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M18.999 20.25L17.7 18H20.2981L18.999 20.25Z",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 18,
        y: 8,
        width: 2,
        height: 6,
        rx: 1,
        fill: "#DDE3E8"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconScrollList);
export default ForwardRef;