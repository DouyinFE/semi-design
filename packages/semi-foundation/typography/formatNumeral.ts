import { strings } from './constants';

// rule types: 'text' | 'numbers' | 'bytes-decimal' | 'bytes-binary' | 'percentages' | 'currency' | 'exponential'
type Rule = typeof strings.RULE[number];
type Truncate = typeof strings.MANTISSA_ROUND[number];
type Parser = (value: string) => string;

type RuleMethods = {
    [key in Rule]?: (value: number) => string;
};
type TruncateMethods = {
    [key in Truncate]: (value: number) => number;
};

export default class FormatNumeral {
    private readonly content: string;
    private readonly rule: Rule;
    private readonly mantissa: number;
    private readonly truncate: Truncate;
    private readonly parser: Parser | undefined;
    private readonly isDiyParser: boolean;

    private readonly truncateMethods: TruncateMethods = {
        ceil: Math.ceil,
        floor: Math.floor,
        round: Math.round,
    };
    // Collection of formatting methods;  Methods: Rule (strings.RULE);  Not included: 'text' & 'numbers'
    private readonly ruleMethods: RuleMethods = {
        'bytes-decimal': (value: number) => {
            const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            let i = 0;
            while (value >= 1000) {
                value /= 1000;
                i++;
            }
            return `${this.truncateMantissa(value)} ${units[i]}`;
        },
        'bytes-binary': (value: number) => {
            const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
            let i = 0;
            while (value >= 1024) {
                value /= 1024;
                i++;
            }
            return `${this.truncateMantissa(value)} ${units[i]}`;
        },
        percentages: (value: number) => {
            const cArr = value.toString().split('.');
            if (Number(cArr[0]) === 0) {
                return `${this.truncateMantissa(value * 100)}%`;
            }
            return `${this.truncateMantissa(value)}%`;
        },
        currency: (value: number) => {
            const cArr = this.truncateMantissa(value).split('.');
            const cInt = cArr[0].replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,');
            const cFloat = cArr[1] ? `.${cArr[1]}` : '';
            return `${cInt}${cFloat}`;
        },
        exponential: (value: number) => {
            const vExponential = value.toExponential(this.mantissa + 2);
            return this.truncateMantissa(vExponential);
        },
    };

    constructor(content: string, rule: Rule, mantissa: number, truncate: Truncate, parser: Parser | undefined) {
        this.isDiyParser = typeof parser !== 'undefined';
        this.content = content;
        this.rule = rule;
        this.mantissa = mantissa;
        this.truncate = truncate;
        this.parser = parser;
    }

    private truncateMantissa(content: string | number): string {
        // Truncation and selection of rounding methods for processing. function from: truncateMethods
        const cTruncated =
            this.truncateMethods[this.truncate](Number(content) * Math.pow(10, this.mantissa)) /
            Math.pow(10, this.mantissa);
        const cArr = cTruncated.toString().split('.');
        // is an integer then the end number is normalised
        if (cArr.length === 1) {
            return cTruncated.toFixed(this.mantissa);
        }
        const cTLength = cArr[1].length;
        // Fill in any missing `0` at the end.
        if (cTLength < this.mantissa) {
            return `${cArr[0]}.${cArr[1]}${'0'.repeat(this.mantissa - cTLength)}`;
        }
        return cTruncated.toString();
    }

    // Formatting numbers within a string.
    public format(): string {
        // Executed when a custom method exists
        if (this.isDiyParser) {
            return this.parser(this.content);
        } else if (this.rule === 'text') {
            return this.content;
        }
        // Separate extraction of numbers when `rule` type is `numbers`.
        if (this.rule === 'numbers') {
            return extractNumbers(this.content)
                .filter(item => checkIsNumeral(item))
                .map(item => this.truncateMantissa(item))
                .join(',');
        }
        // Run formatting methods that exist.
        return extractNumbers(this.content)
            .map(item => {
                if (checkIsNumeral(item)) {
                    return this.ruleMethods[this.rule](Number(item));
                }
                return item;
            })
            .join('');
    }
}

// Separate numbers from strings, the `-` symbol is a numeric prefix not allowed on its own.
function extractNumbers(content: string): Array<string> {
    const reg = /(-?[0-9]*\.?[0-9]+([eE]-?[0-9]+)?)|([^-\d\.]+)/g;
    return content.match(reg) || [];
}

function checkIsNumeral(str: string): boolean {
    return !(isNaN(Number(str)) && str.replace(/\s+/g, '') === '');
}
