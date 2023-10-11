function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconBreadcrumb(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M6 4H14L18.0063 10.41C18.6143 11.3828 18.6143 12.6172 18.0063 13.59L14 20H6V4Z",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M2 7C2 5.34315 3.34315 4 5 4H7L11.0063 10.41C11.6143 11.3828 11.6143 12.6172 11.0063 13.59L7 20H5C3.34315 20 2 18.6569 2 17V7Z",
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M13 20H16.3373C17.3716 20 18.333 19.4671 18.8813 18.59L22.0063 13.59C22.6143 12.6172 22.6143 11.3828 22.0063 10.41L18.8813 5.41C18.333 4.53286 17.3716 4 16.3373 4H13L17.0063 10.41C17.6143 11.3828 17.6143 12.6172 17.0063 13.59L13 20Z",
        fill: "#DDE3E8"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconBreadcrumb);
export default ForwardRef;