import { _t } from 'src/utils/locale';
import React from 'react';
import { Button, Tag } from '@douyinfe/semi-ui';
import styles from './pro.module.scss';
import { navigate } from 'gatsby-link';
import { getLocale } from '../../../../utils/locale';
import classnames from 'classnames';
import Component from './d2cApplication.jsx';

function Pro(props) {

    const goD2CStart = () => {
        navigate(`/code/${getLocale()}/start/quick-start`);
    };
    const isInternal = process.env.D2C_URL;

    return (
        <div {...props} className={styles.macBookPro2}>
            <div className={styles.frame14294}>
                <div className={styles.frame4151}>
                    <p className={styles.semiPro} data-locale={"en-US"}>{_t('home.pro.title')}</p>
                    {isInternal && (
                        <Tag style={{ color: '#F0B114', background: '#41464C', marginLeft: 12 }}>
                            {_t('beta', {}, '公测')}
                        </Tag>
                    )}
                </div>
                <p className={styles.text}>
                    <span className={styles.text_4c571d3f}>{_t('home.pro.desc', {}, '基于')}</span>
                </p>
                {isInternal ? (
                    <Button onClick={goD2CStart} size="large" theme="solid" className={styles.extraLarge}>
                        {_t('home.pro.start', {}, '了解更多')}
                    </Button>
                ) : (
                    <div className={styles.buttonSecondarySolid}>
                        <p className={styles.text_001dc6a1}>{_t('under_construction', {}, '建设中')}</p>
                    </div>
                )}
            </div>
            <div className={styles.autoWrapper}>
                {/* eslint-disable-next-line */}
                <img
                    src="https://lf9-static.semi.design/obj/semi-tos/images/homepage-pro-code.jpg"
                    className={styles.syntaxHighlighter}
                />
                <div className={styles.rectangle1080}></div>
                <div className={styles.frame14295}>
                    <div className={styles.autoWrapper}>
                        {/* eslint-disable-next-line */}
                        <img
                            src="https://lf9-static.semi.design/obj/semi-tos/images/5de23960-3242-11ec-8b14-8fb159794ae4.png"
                            className={styles.chromeStandart}
                        />
                        {/* eslint-disable-next-line */}
                        <img
                            src="https://lf9-static.semi.design/obj/semi-tos/images/5ddb0d70-3242-11ec-adec-e911cea4cf98.png"
                            className={styles.chromeStandart_2167fd7e}
                        />
                        <div className={styles.chromeStandart_07210c83}>
                            <Component></Component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pro;
