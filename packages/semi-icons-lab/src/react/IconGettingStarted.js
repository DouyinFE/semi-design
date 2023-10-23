function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconGettingStarted(props, svgRef) {
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
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M16.8983 11.3349C17.2744 11.7121 17.2744 12.2881 16.8983 12.6653C16.3205 13.2449 15.298 14.1515 13.7106 15.1755C12.2711 16.1041 11.033 16.6996 10.1839 17.0552C9.54099 17.3245 8.86333 16.9178 8.77288 16.2267C8.64377 15.2402 8.50004 13.7492 8.50004 12.0001C8.50004 10.251 8.64376 8.76006 8.77287 7.77356C8.86333 7.08239 9.54101 6.67574 10.1839 6.94502C11.033 7.30064 12.2712 7.89619 13.7106 8.82469C15.298 9.84867 16.3204 10.7553 16.8983 11.3349Z",
        fill: "white"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconGettingStarted);
export default ForwardRef;