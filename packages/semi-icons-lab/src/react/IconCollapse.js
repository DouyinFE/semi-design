function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconCollapse(props, svgRef) {
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
        y: 2,
        width: 20,
        height: 9,
        rx: 2,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 13,
        width: 20,
        height: 9,
        rx: 2,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M17 14.5C16.4477 14.5 16 14.9477 16 15.5V16.5H15C14.4477 16.5 14 16.9477 14 17.5C14 18.0523 14.4477 18.5 15 18.5H16V19.5C16 20.0523 16.4477 20.5 17 20.5C17.5523 20.5 18 20.0523 18 19.5V18.5H19C19.5523 18.5 20 18.0523 20 17.5C20 16.9477 19.5523 16.5 19 16.5H18V15.5C18 14.9477 17.5523 14.5 17 14.5Z",
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M17 3.50003C16.4477 3.50003 16 3.94775 16 4.50003V5.50003H15C14.4477 5.50003 14 5.94775 14 6.50003C14 7.05232 14.4477 7.50003 15 7.50003H16V8.50003C16 9.05232 16.4477 9.50003 17 9.50003C17.5523 9.50003 18 9.05232 18 8.50003V7.50003H19C19.5523 7.50003 20 7.05232 20 6.50003C20 5.94775 19.5523 5.50003 19 5.50003H18V4.50003C18 3.94775 17.5523 3.50003 17 3.50003Z",
        fill: "#4CC3FA"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconCollapse);
export default ForwardRef;