function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconSelect(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("g", {
        clipPath: "url(#clip0_1_3050)"
    }, /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 2,
        width: 16,
        height: 5,
        rx: 0.5,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 2,
        y: 17,
        width: 16,
        height: 5,
        rx: 0.5,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 6,
        y: 9,
        width: 16,
        height: 6,
        rx: 0.5,
        fill: "#FBCD2C"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12.5 10.7929C12.5 9.902 13.5771 9.45583 14.2071 10.0858L22.9142 18.7929C23.5442 19.4229 23.098 20.5 22.2071 20.5H18.2488C17.6797 20.5 17.1376 20.7424 16.7581 21.1666L14.2453 23.9756C13.6333 24.6598 12.5 24.2269 12.5 23.3089V10.7929ZM16.6837 19H21L14 12V22L16.6837 19Z",
        fill: "white"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M14 22V12L21 19H16.6837L14 22Z",
        fill: "#324350"
    })), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
        id: "clip0_1_3050"
    }, /*#__PURE__*/React.createElement("rect", {
        width: 24,
        height: 24,
        fill: "white"
    }))));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconSelect);
export default ForwardRef;