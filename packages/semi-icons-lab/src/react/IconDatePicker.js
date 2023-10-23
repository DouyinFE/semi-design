function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconDatePicker(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("g", {
        clipPath: "url(#clip0_1_3038)"
    }, /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: 4,
        width: 22,
        height: 16,
        rx: 3,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M6.5 11H9V13.5H6.5V11ZM12.5 15.5H5.5V10H12.5V15.5ZM12.5 7.5H12V6.5H11V7.5H7V6.5H6V7.5H5.5C4.945 7.5 4.5 7.95 4.5 8.5V15.5C4.5 16.05 4.95 16.5 5.5 16.5H12.5C13.05 16.5 13.5 16.05 13.5 15.5V8.5C13.5 7.95 13.05 7.5 12.5 7.5Z",
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M13.5 12.7929C13.5 11.902 14.5771 11.4558 15.2071 12.0858L23.9142 20.7929C24.5442 21.4228 24.098 22.5 23.2071 22.5H19.2488C18.6797 22.5 18.1376 22.7424 17.7581 23.1665L15.2453 25.9756C14.6333 26.6597 13.5 26.2268 13.5 25.3089V12.7929ZM17.6837 21H22L15 14V24L17.6837 21Z",
        fill: "white"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M15 24V14L22 21H17.6837L15 24Z",
        fill: "#324350"
    })), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
        id: "clip0_1_3038"
    }, /*#__PURE__*/React.createElement("rect", {
        width: 24,
        height: 24,
        fill: "white"
    }))));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconDatePicker);
export default ForwardRef;