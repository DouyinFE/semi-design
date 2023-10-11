function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconAnchor(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M6.16667 12H3.66667C3.66667 16.6024 7.39763 20.3333 12 20.3333C16.6024 20.3333 20.3333 16.6024 20.3333 12H17.8333",
        stroke: "#AAB2BF",
        strokeWidth: 2,
        strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M12 20.3333V7.83333",
        stroke: "#818A9B",
        strokeWidth: 2,
        strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12.0016 9.83667C13.7054 9.83667 15.0866 8.45545 15.0866 6.75167C15.0866 5.04787 13.7054 3.66667 12.0016 3.66667C10.2978 3.66667 8.91663 5.04787 8.91663 6.75167C8.91663 8.45545 10.2978 9.83667 12.0016 9.83667Z",
        fill: "#324350",
        stroke: "#324350",
        strokeWidth: 1.25,
        strokeLinejoin: "round"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconAnchor);
export default ForwardRef;