// A word that mixes Latin, Cyrillic and Greek letters is almost always a typo:
// a lookalike letter (Latin "T" for Cyrillic "Т", Cyrillic "а" for Latin "a")
// was typed with the wrong keyboard layout. Such words look right on screen
// but break search, sorting and screen readers.

const sources = (require as any).context('../source', false, /\.ts$/);

const SCRIPTS = [
    { name: 'Latin', re: /\p{Script=Latin}/u },
    { name: 'Cyrillic', re: /\p{Script=Cyrillic}/u },
    { name: 'Greek', re: /\p{Script=Greek}/u },
];

function collectStrings(value: unknown, path: string, out: Array<[string, string]>) {
    if (typeof value === 'string') {
        out.push([path, value]);
    } else if (value && typeof value === 'object') {
        Object.keys(value).forEach(key => {
            // date-fns locales are third-party data
            if (key !== 'dateFnsLocale') {
                collectStrings((value as Record<string, unknown>)[key], `${path}.${key}`, out);
            }
        });
    }
}

function mixedWords(text: string) {
    return (text.match(/[\p{L}\p{M}]+/gu) || []).filter(
        word => SCRIPTS.filter(script => script.re.test(word)).length > 1
    );
}

describe('locale source', () => {
    sources.keys().forEach((file: string) => {
        it(`${file} has no words that mix letters from different alphabets`, () => {
            const strings: Array<[string, string]> = [];
            collectStrings(sources(file).default, file, strings);
            const bad = strings
                .map(([path, text]) => [path, mixedWords(text)] as [string, string[]])
                .filter(([, words]) => words.length > 0)
                .map(([path, words]) => `${path}: ${words.join(', ')}`);
            expect(bad).toEqual([]);
        });
    });
});
