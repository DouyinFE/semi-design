function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconPagination(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M1 8C1 6.34315 2.34315 5 4 5H12V19H4C2.34315 19 1 17.6569 1 16V8Z",
        fill: "#6A6F7F"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M8 9L5 12L8 15",
        stroke: "white",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M12 5H20C21.6569 5 23 6.34315 23 8V16C23 17.6569 21.6569 19 20 19H12V5Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M16 9L19 12L16 15",
        stroke: "#AAB2BF",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconPagination);
export default ForwardRef;