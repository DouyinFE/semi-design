/* eslint-disable jsx-a11y/click-events-have-key-events */
import { _t, getLocale } from "../../../../utils/locale";
import { navigate } from 'gatsby-link';
import React from 'react';
import styles from "./deepContent.module.scss";
import classnames from 'classnames';

function DeepContent(props) {

    const goA11y = () => {
        const local = getLocale();
        if(local === 'zh-CN') {
            window.open("https://mp.weixin.qq.com/s/O3js-SZDNPEOjGxh-aAkbw");
        } else {
            window.open("https://medium.com/@semi-design/accessibility-1808f1ed34d2");
        }
    }

    const goTheme = () => {
        window.open('https://mp.weixin.qq.com/s/noHoWRuA25PgqFNcurhIUA');
    }

    return (
        <div {...props} className={styles.frame}>
            <p className={styles.title} data-locale={"en-US"}>{_t("content_title")}</p>
            <p className={styles.subtitle}>{_t("content_subtitle")}</p>
            <div className={styles.autoWrapper}>
                <div className={styles.frame1312316425} onClick={goA11y}> 
                    <img className={styles.frame1312316426} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/a11y-detail.png" />
                    <div className={styles.details}>
                        <p className={styles.headline}> {_t("content_a11y")} </p>
                        <p className={styles.description}>{_t("content_ally_info")}</p>
                    </div>
                </div>
                <div className={styles.frame1312316425} onClick={goTheme}>
                    <img className={styles.frame1312316426} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dsm-detail.png" />
                    <div className={styles.details}>
                        <p className={styles.headline}>{_t("content_theme")}</p>
                        <p className={styles.description}>{_t("content_theme_info")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeepContent;
