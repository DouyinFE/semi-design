import { BASE_CLASS_PREFIX } from "../base/constants";
import { KeyboardEvent } from "react";

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-keyBoardShortCut`,
} as const;

const strings = {
};

export { cssClasses, strings };

export function keyToCode(key: KeyboardEvent["key"]) {
    const keyCodeMap = {
        'a': 'KeyA', 'b': 'KeyB', 'c': 'KeyC', 'd': 'KeyD', 'e': 'KeyE',
        'f': 'KeyF', 'g': 'KeyG', 'h': 'KeyH', 'i': 'KeyI', 'j': 'KeyJ',
        'k': 'KeyK', 'l': 'KeyL', 'm': 'KeyM', 'n': 'KeyN', 'o': 'KeyO',
        'p': 'KeyP', 'q': 'KeyQ', 'r': 'KeyR', 's': 'KeyS', 't': 'KeyT',
        'u': 'KeyU', 'v': 'KeyV', 'w': 'KeyW', 'x': 'KeyX', 'y': 'KeyY',
        'z': 'KeyZ', '0': 'Digit0', '1': 'Digit1', '2': 'Digit2', '3': 'Digit3',
        '4': 'Digit4', '5': 'Digit5', '6': 'Digit6', '7': 'Digit7', '8': 'Digit8',
        '9': 'Digit9', 'enter': 'Enter', 'escape': 'Escape', 'backspace': 'Backspace',
        'tab': 'Tab', ' ': 'Space', 'arrowup': 'ArrowUp', 'arrowdown': 'ArrowDown',
        'arrowleft': 'ArrowLeft', 'arrowright': 'ArrowRight', 'shift': 'ShiftLeft',
        'control': 'ControlLeft', 'alt': 'AltLeft', 'meta': 'MetaLeft',
        'capslock': 'CapsLock', 'f1': 'F1', 'f2': 'F2', 'f3': 'F3', 'f4': 'F4',
        'f5': 'F5', 'f6': 'F6', 'f7': 'F7', 'f8': 'F8', 'f9': 'F9', 'f10': 'F10',
        'f11': 'F11', 'f12': 'F12'
    };

    return keyCodeMap[key.toLowerCase()] || undefined;
}