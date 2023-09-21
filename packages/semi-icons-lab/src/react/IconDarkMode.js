function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconDarkMode(props, svgRef) {
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
        cy: 12,
        r: 11,
        fill: "#324350"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M18 15.9519C17.5859 16.025 17.1597 16.0631 16.7246 16.0631C12.6984 16.0631 9.43457 12.7992 9.43457 8.77305C9.43457 7.32204 9.85849 5.97005 10.5892 4.83416C7.17112 5.43727 4.57452 8.42192 4.57452 12.013C4.57452 16.0392 7.8384 19.3031 11.8646 19.3031C14.4398 19.3031 16.7031 17.9679 18 15.9519Z",
        fill: "#FBCD2C"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconDarkMode);
export default ForwardRef;