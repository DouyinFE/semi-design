function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconHeart(props, svgRef) {
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
        d: "M20.5 13.9853L12.0147 5.5L12.7574 4.75736C15.1005 2.41421 18.8995 2.41421 21.2426 4.75736C23.5858 7.1005 23.5858 10.8995 21.2426 13.2426L20.5 13.9853Z",
        fill: "#F82C2C"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M11.2426 4.75736C8.89949 2.41421 5.1005 2.41421 2.75736 4.75736C0.414214 7.1005 0.414214 10.8995 2.75736 13.2426L12 22.4853C12 22.4853 17.1834 17.3166 20.5 14C21.8 12.7471 22.34 12 22.66 11C20 14 18.5 12 12.0147 5.5C11.5079 4.99201 11.2426 4.75736 11.2426 4.75736Z",
        fill: "#FF7D95"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconHeart);
export default ForwardRef;