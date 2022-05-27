import React from "react";

export default function getSelections(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e && e.target) {
        const { selectionStart, selectionEnd } = e.target;
        return { selectionStart, selectionEnd };
    }
    return null;
}