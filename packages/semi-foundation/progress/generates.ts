import { strings } from './constants';

// type ColorType = 'Hex' | 'Hsl' | 'Hsla' | 'Rgb' | 'Rgba' | 'ColorName';

type Generate = {
    startColor: string;
    endColor: string;
    size: number;
};

type StrokeSet = { percent: number; color: string };

type StrokeArr = Array<StrokeSet>;

function generateColor(s: StrokeArr, percent: number, gradient: boolean): string | undefined {
    try {
        const gradientColorArr = generate(s, percent, gradient);
        if (gradientColorArr.length !== 0) return gradientColorArr;
    } catch (e) {
        return undefined;
    }
    return undefined;
}

function generate(s: StrokeArr, percent: number, gradient: boolean): string | undefined {
    s.sort((a, b) => a.percent - b.percent);
    if (s[0].percent > percent) {
        return strings.STROKE_DEFAULT;
    }
    const endS = s[s.length - 1];
    if (endS.percent < percent) {
        return formatToHex(endS.color);
    }
    for (const [index, item] of s.entries()) {
        if (item.percent === percent) {
            return formatToHex(item.color);
        }
        if (percent > item.percent) continue;
        const oldItem = s[index - 1];
        if (!gradient) {
            return formatToHex(oldItem.color);
        }
        return generateGradients(
            {
                startColor: formatToHex(oldItem.color),
                endColor: formatToHex(item.color),
                size: item.percent - oldItem.percent - 1,
            },
            percent - oldItem.percent - 1
        ) as string;
    }
    return undefined;
}

function generateGradients(g: Generate, index: number | undefined): Array<string> | string {
    const { startColor, endColor, size } = g;
    const sA = startColor.split('');
    const eA = endColor.split('');
    const rC = [parseInt(`${sA[1]}${sA[2]}`, 16), parseInt(`${eA[1]}${eA[2]}`, 16)];
    const gC = [parseInt(`${sA[3]}${sA[4]}`, 16), parseInt(`${eA[3]}${eA[4]}`, 16)];
    const bC = [parseInt(`${sA[5]}${sA[6]}`, 16), parseInt(`${eA[5]}${eA[6]}`, 16)];
    const aC = [parseInt(`${sA[7]}${sA[8]}`, 16), parseInt(`${eA[7]}${eA[8]}`, 16)];
    const rStep = (rC[0] - rC[1]) / (size + 1);
    const gStep = (gC[0] - gC[1]) / (size + 1);
    const bStep = (bC[0] - bC[1]) / (size + 1);
    const aStep = (aC[0] - aC[1]) / (size + 1);
    function tHex(i: number) {
        const rS = Math.round(rC[0] - rStep * (i + 1)).toString(16);
        const gS = Math.round(gC[0] - gStep * (i + 1)).toString(16);
        const bS = Math.round(bC[0] - bStep * (i + 1)).toString(16);
        const h = `${padTwo(rS)}${padTwo(gS)}${padTwo(bS)}`;
        const t = Math.floor(aStep * (i + 1) + aC[1]).toString(16);
        return toHex.Hex(`#${h}`, t);
    }
    function padTwo(s: string) {
        if (s.length === 1) {
            return `0${s}`;
        }
        if (s.length === 0) {
            return '00';
        }
        return s;
    }
    if (typeof index === 'undefined') {
        const gradientColorArr = [startColor];
        for (let i = 0; i < size; i += 1) {
            gradientColorArr.push(tHex(i));
        }
        return gradientColorArr;
    }
    return tHex(index);
}

// Resolve the colour type contained within `ColorType` to Hex
function formatToHex(color: string): string | undefined {
    color = color.trim().toLowerCase();
    // Hex
    if (REG_S.hex.test(color)) {
        return toHex.Hex(color, undefined);
    }
    // Hsl or Hsla
    if (REG_S.hslA.test(color)) {
        return toHex.Hex(toHex.HslA(color), undefined);
    }
    // Rgb or Rgba
    if (REG_S.rgbA.test(color)) {
        return toHex.Hex(toHex.RgbA(color), undefined);
    }
    // ColorName
    if (SET_NAME_HEX.hasOwnProperty(color)) {
        return toHex.Hex(toHex.ColorName(color), undefined);
    }
    return undefined;
}

const toHex = {
    ColorName(color: string): string {
        return SET_NAME_HEX[color];
    },
    Hex(color: string, transparency: string | undefined): string {
        color = color.replace('#', '');
        if (color.length === 8) return `#${color}`;
        if (color.length === 6) return `#${color}${transparency || 'ff'}`;
        if (color.length === 3) {
            color = color
                .split('')
                .map(c => c + c)
                .join('');
        }
        return `#${color}${transparency || 'ff'}`;
    },
    HslA(color: string): string {
        const hsla = REG_S.hslA.exec(color);
        const h = parseInt(hsla[2]);
        const s = parseInt(hsla[3]) / 100;
        const l = parseInt(hsla[4]) / 100;
        const a = hsla[5];
        const c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - c / 2;
        let r: string | number = 0,
            g: string | number = 0,
            b: string | number = 0;
        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);
        return toHex.utils.pAL(r, g, b, a);
    },
    RgbA(color: string): string {
        const rgba = REG_S.rgbA.exec(color);
        const r = parseInt(rgba[2], 10).toString(16),
            g = parseInt(rgba[3], 10).toString(16),
            b = parseInt(rgba[4], 10).toString(16),
            a = rgba[5];
        return toHex.utils.pAL(r, g, b, a);
    },
    utils: {
        pAL(r: string, g: string, b: string, a: string) {
            if (r.length == 1) r = '0' + r;
            if (g.length == 1) g = '0' + g;
            if (b.length == 1) b = '0' + b;
            if (typeof a !== 'undefined') {
                a = Math.round(parseInt(a) * 255).toString(16);
                if (a.length == 1) a = '0' + a;
                return '#' + r + g + b + a;
            }
            return '#' + r + g + b;
        },
    },
};

const REG_S = {
    hex: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
    hslA: /(hsl)a?\((\d+),?\s*?(\d+)%,?\s*?(\d+)%,?\s*?\/?(\s*?[\d.]+)?\)/,
    rgbA: /(rgb)a?\((\d+),?\s*?(\d+),?\s*?(\d+),?\s*?\/?(\s*?[\d.]+)?\)/,
};

const SET_NAME_HEX = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgrey: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    grey: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgrey: '#d3d3d3',
    lightgreen: '#90ee90',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};

export { generateColor, StrokeArr };
