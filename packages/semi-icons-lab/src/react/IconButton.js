function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconButton(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M2 16.5C2 15.1193 3.11929 14 4.5 14H19.5C20.8807 14 22 15.1193 22 16.5C22 17.8807 20.8807 19 19.5 19H4.5C3.11929 19 2 17.8807 2 16.5Z",
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 8,
        y: 12,
        width: 8,
        height: 2,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M6 5.67391C6 4.73519 6.65356 3.9279 7.58364 3.80089C8.66208 3.65362 10.2149 3.5 12 3.5C13.7851 3.5 15.3379 3.65362 16.4164 3.80089C17.3464 3.9279 18 4.73519 18 5.67391V11C18 11.5523 17.5523 12 17 12H7C6.44772 12 6 11.5523 6 11V5.67391Z",
        fill: "#F82C2C"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconButton);
export default ForwardRef;