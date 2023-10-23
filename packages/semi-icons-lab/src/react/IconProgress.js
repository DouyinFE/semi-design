function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconProgress(props, svgRef) {
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
        r: 8,
        stroke: "#3BCE4A",
        strokeWidth: 6
    }), /*#__PURE__*/React.createElement("path", {
        d: "M12.1378 4C16.48 4 20 7.58172 20 12C20 16.4183 16.48 20 12.1378 20C9.65493 20 7.44087 18.8289 6 17",
        stroke: "#3BCE4A",
        strokeWidth: 6,
        strokeLinecap: "round"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconProgress);
export default ForwardRef;