import React from 'react';
import { Icon, Toast, Tabs, TabPane } from '@douyinfe/semi-ui';
import { palette } from '../palette';
import { scoreFromRatio } from 'wcag-color';
import chroma from 'chroma-js';
import Clipboard from 'react-clipboard.js';
import styles from './index.module.scss';
import cls from 'classnames';
import { IconSun, IconMoon } from '@douyinfe/semi-icons';

function toUpper(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
}

const colors = [
    'red',
    'pink',
    'purple',
    'violet',
    'indigo',
    'blue',
    'light blue',
    'cyan',
    'teal',
    'green',
    'light green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'grey',
];
export const ColorBlock = ({ colorKey, colorVar }) => {
    const niceName = colorKey.replace('--semi-', '').replace(/-/g, ' ');
    const isStartsWithColor = niceName.indexOf('color') === 0 || niceName.indexOf('overlay') >= 0;
    const color = isStartsWithColor ? colorVar : `rgb(${colorVar})`;
    const colorName = toUpper(niceName);
    const wrate = chroma.contrast(color, '#ffffff');
    const wscore = scoreFromRatio(wrate);
    const brate = chroma.contrast(color, '#000000');
    const bscore = scoreFromRatio(brate);
    const colorCapClassName = wscore !== 'Fail' ? 'white' : 'black';
    const clipText = isStartsWithColor ? `var(${colorKey})` : `rgba(var(${colorKey}), 1)`;

    const copied = e => {
        Toast.success({
            content: (
                <span>
                    颜色 <code>{e.text}</code> 已复制
                </span>
            ),
            duration: 3,
        });
    };

    return (
        <Clipboard
            component="div"
            data-clipboard-text={clipText}
            onSuccess={copied}
            className={styles['color-block']}
            key={colorKey}
        >
            <div
                className={styles['color-rect']}
                style={{
                    backgroundColor: color,
                }}
            />
            <div className={cls(styles['color-cap'], styles[colorCapClassName])}>
                <span className={styles['color-name']}>{colorName}</span>
                <span className={styles['color-value']}>{colorVar}</span>
            </div>
            <div className={styles.ratios}>
                {wscore === 'Fail' ? '' : <span className={cls(styles['color-ratio'], styles.white)}>{wscore}</span>}
                {bscore === 'Fail' ? '' : <span className={cls(styles['color-ratio'], styles.black)}>{bscore}</span>}
            </div>
        </Clipboard>
    );
};

const FullPalette = props => {
    const pl = obj => {
        let a = null;
        const res = [];

        for (let name of colors) {
            a = [];

            for (let key in obj) {
                const niceName = key.replace('--semi-', '').replace(/-/g, ' ');
                if (niceName.replace(/\s\d/g, '') === name) {
                    const block = <ColorBlock key={key} colorKey={key} colorVar={obj[key]} />;
                    a.push(block);
                }
            }

            res.push(
                <div key={name} className={styles['color-column']}>
                    {a}
                </div>
            );
        }

        return <>{res.map(item => item)}</>;
    };

    const lP = pl(palette.light);
    const dP = pl(palette.dark);
    return (
        <div className={styles['full-palette']}>
            <Tabs type="line">
                <TabPane
                    tab={(
                        <span>
                            <IconSun />
                            Light
                        </span>
                    )}
                    itemKey="light"
                >
                    <div className={cls(styles['color-grid'], styles['light-grid'])}>{lP}</div>
                </TabPane>
                <TabPane
                    tab={(
                        <span>
                            <IconMoon />
                            Dark
                        </span>
                    )}
                    itemKey="dark"
                >
                    <div className={cls(styles['color-grid'], styles['dark-grid'])}>{dP}</div>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default FullPalette;
