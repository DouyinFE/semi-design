function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from "react";

function IconTagInput(props, svgRef) {
    return /*#__PURE__*/React.createElement("svg", _extends({
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        focusable: false,
        ref: svgRef
    }, props), /*#__PURE__*/React.createElement("rect", {
        x: 1,
        y: 4,
        width: 22,
        height: 16,
        rx: 2,
        fill: "#DDE3E8"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M4.0918 16.4052C4.54883 16.4052 4.80273 16.1704 4.98047 15.5737L5.46289 14.101H8.50342L8.99219 15.5737C9.16357 16.164 9.43018 16.4052 9.89355 16.4052C10.3823 16.4052 10.7061 16.1133 10.7061 15.6562C10.7061 15.4785 10.6616 15.269 10.5728 14.9961L8.38916 8.73727C8.11621 7.92477 7.73535 7.5947 7.01807 7.5947C6.29443 7.5947 5.90723 7.93112 5.63428 8.73727L3.45068 14.9961C3.34277 15.3198 3.29834 15.5166 3.29834 15.688C3.29834 16.1196 3.62207 16.4052 4.0918 16.4052ZM5.84375 12.8252L6.94824 9.32126H7.03076L8.12891 12.8252H5.84375Z",
        fill: "#AAB2BF"
    }), /*#__PURE__*/React.createElement("path", {
        d: "M20.1213 9.87865C19.7308 9.48812 19.0976 9.48812 18.7071 9.87865L18 10.5858L17.2929 9.87865C16.9024 9.48812 16.2692 9.48812 15.8787 9.87865C15.4882 10.2692 15.4882 10.9023 15.8787 11.2929L16.5858 12L15.8787 12.7071C15.4882 13.0976 15.4882 13.7308 15.8787 14.1213C16.2692 14.5118 16.9024 14.5118 17.2929 14.1213L18 13.4142L18.7071 14.1213C19.0976 14.5118 19.7308 14.5118 20.1213 14.1213C20.5118 13.7308 20.5118 13.0976 20.1213 12.7071L19.4142 12L20.1213 11.2929C20.5118 10.9023 20.5118 10.2692 20.1213 9.87865Z",
        fill: "#324350"
    }));
}

const ForwardRef = /*#__PURE__*/React.forwardRef(IconTagInput);
export default ForwardRef;