function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconAccessibility(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("circle", {
        cx: 12,
        cy: 4,
        r: 3,
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M2 9.5C2 8.67157 2.67157 8 3.5 8H8H16H20.5C21.3284 8 22 8.67157 22 9.5C22 10.3284 21.3284 11 20.5 11H16V15.5V17V21.5C16 22.3284 15.3284 23 14.5 23C13.6716 23 13 22.3284 13 21.5V17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17V21.5C11 22.3284 10.3284 23 9.5 23C8.67157 23 8 22.3284 8 21.5V17V15.5V11H3.5C2.67157 11 2 10.3284 2 9.5Z",
        fill: "#6A6F7F"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconAccessibility);
export default ForwardRef;