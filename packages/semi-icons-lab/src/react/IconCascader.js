function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconCascader(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M2 3.54818C2 2.82211 2.74939 2.33807 3.41122 2.63664L9 5.15789V22L3.17756 19.3733C2.46078 19.05 2 18.3366 2 17.5503V3.54818Z",
        fill: "#4CC3FA"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M15 2L20.8224 4.62666C21.5392 4.95002 22 5.6634 22 6.44974V20.4518C22 21.1779 21.2506 21.6619 20.5888 21.3634L15 18.8421V2Z",
        fill: "#FBCD2C"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M9 5.15789L15 2V18.8421L9 22V5.15789Z",
        fill: "#324350"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconCascader);
export default ForwardRef;