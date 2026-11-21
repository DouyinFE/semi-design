import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const compile = component => execFileSync(process.execPath, [
    path.join(path.dirname(require.resolve('sass')), 'sass.js'),
    '--no-source-map',
    '--load-path=' + path.join(process.cwd(), 'packages'),
    '--stdin',
], { input: `@import "semi-theme-default/scss/index.scss";@import "semi-foundation/${component}/${component}.scss";`, encoding: 'utf8' });
const styles = { sideSheet: compile('sideSheet'), feedback: compile('feedback') };

it.each([['sideSheet', 'feedback'], ['feedback', 'sideSheet']])('closes both bottom sheets beyond the viewport with stylesheet order %s then %s', (first, second) => {
    const style = document.createElement('style');
    style.textContent = styles[first] + styles[second];
    const root = document.createElement('div');
    root.innerHTML = '<div class="semi-sidesheet semi-sidesheet-bottom"><div class="semi-sidesheet-inner-wrap semi-sidesheet-animation-content_hide_bottom"></div></div><div class="semi-feedback semi-sidesheet semi-sidesheet-bottom"><div class="semi-sidesheet-inner-wrap semi-sidesheet-animation-content_hide_bottom"></div></div>';
    document.head.appendChild(style);
    document.body.appendChild(root);
    try {
        const frameRules = Array.from(style.sheet.cssRules).filter((rule): rule is CSSKeyframesRule => rule.type === CSSRule.KEYFRAMES_RULE);
        const styleRules = Array.from(style.sheet.cssRules).filter((rule): rule is CSSStyleRule => rule.type === CSSRule.STYLE_RULE);
        const transformAt = (element, edge: 'from' | 'to') => {
            const computed = getComputedStyle(element);
            const name = computed.animationName || computed.animation.split(' ')[0];
            const frames = frameRules.filter(rule => rule.name === name).pop();
            return (Array.from(frames.cssRules) as CSSKeyframeRule[]).find(rule => [edge, edge === 'to' ? '100%' : '0%'].includes(rule.keyText)).style.transform;
        };
        const [sheet, feedback] = Array.from(root.querySelectorAll('.semi-sidesheet-inner-wrap'));
        const feedbackGap = styleRules.find(rule => rule.selectorText === '.semi-feedback.semi-sidesheet-bottom .semi-sidesheet-inner-wrap').style.bottom;
        expect(transformAt(sheet, 'to')).toBe('translateY(100%)');
        expect(transformAt(feedback, 'to')).toBe(`translateY(calc(100% + ${feedbackGap}))`);
        for (const element of [sheet, feedback]) {
            element.classList.replace('semi-sidesheet-animation-content_hide_bottom', 'semi-sidesheet-animation-content_show_bottom');
        }
        expect(transformAt(sheet, 'from')).toBe('translateY(100%)');
        expect(transformAt(feedback, 'from')).toBe(`translateY(calc(100% + ${feedbackGap}))`);
    } finally {
        root.remove();
        style.remove();
    }
});
