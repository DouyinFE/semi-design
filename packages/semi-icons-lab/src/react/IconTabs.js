function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconTabs(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("path", {
        d: "M12 5.99997C12 4.8954 12.8954 3.99997 14 3.99997H19C20.1046 3.99997 21 4.8954 21 5.99997V11C21 12.1045 20.1046 13 19 13H14C12.8954 13 12 12.1045 12 11V5.99997Z",
        fill: "#818A9B"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M3.99999 1.99997C2.89542 1.99997 1.99999 2.8954 1.99999 3.99997L1.99999 20C1.99999 21.1045 2.89542 22 3.99999 22H20C21.1046 22 22 21.1045 22 20V9.99997C22 8.8954 21.1046 7.99997 20 7.99997H14C12.8954 7.99997 12 7.10454 12 5.99997V3.99997C12 2.8954 11.1046 1.99997 9.99999 1.99997L3.99999 1.99997Z",
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 6,
        y: 12,
        width: 12,
        height: 2,
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("rect", {
        x: 6,
        y: 16,
        width: 9,
        height: 2,
        fill: "#AAB2BF"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconTabs);
export default ForwardRef;