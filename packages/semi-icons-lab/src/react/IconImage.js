function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconImage(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M4 4H11V11H4V4Z",
        fill: "#FBCD2C"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M3 11H20V20H3V11Z",
        fill: "#3BCE4A"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V5C22 3.34315 20.6569 2 19 2H5ZM10 7.5C10 8.88071 8.88071 10 7.5 10C6.11929 10 5 8.88071 5 7.5C5 6.11929 6.11929 5 7.5 5C8.88071 5 10 6.11929 10 7.5ZM16.7071 11.7071C16.3166 11.3166 15.6834 11.3166 15.2929 11.7071L11 16L9.70711 14.7071C9.31658 14.3166 8.68342 14.3166 8.29289 14.7071L5 18V19H19V14L16.7071 11.7071Z",
        fill: "#324350"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconImage);
export default ForwardRef;