function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconNavigation(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("g", {
        clipPath: "url(#clip0_1_3057)"
    }, /*#__PURE__*/React.createElement("circle", {
        cx: 12,
        cy: 12,
        r: 11,
        transform: "rotate(-45 12 12)",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M4.95413 12.237L16.8183 6.92269L12.2377 19.089L10.5096 13.6288L4.95413 12.237Z",
        fill: "#324350"
    })), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
        id: "clip0_1_3057"
    }, /*#__PURE__*/React.createElement("rect", {
        width: 24,
        height: 24,
        fill: "white"
    }))));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconNavigation);
export default ForwardRef;