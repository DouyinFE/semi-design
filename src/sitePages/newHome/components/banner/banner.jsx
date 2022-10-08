/* eslint-disable jsx-a11y/click-events-have-key-events */
import { _t } from "src/utils/locale";
import React, { useState, useEffect } from 'react';
import styles from "./banner.module.scss";
import OperateButton from '../operateButton/operateButton.jsx'
import classnames from 'classnames';
import { getLocale } from '../../../../utils/locale';

function Banner() {
    const [locale, setLocale] = useState('');

    useEffect(() => {
        return setLocale(getLocale());
    }, [])

    return (
        <div className={classnames(styles.frame4565, styles.frame4565_pos)}>
            <div className={classnames(styles.content, styles.content_pos)}>
                <p className={classnames(styles.title, {
                    [`${styles.title_en}`]: locale === "en-US",
                })}>{_t("enterprise_product_design_system")}</p>
                <p className={styles.subtitle}>{_t("home_banner_description")}</p>
                <OperateButton />
                <div className={styles.frameworksWrapper}>
                    <img className={styles.frameworks} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/arch.png" />
                    <svg width="82" height="48" viewBox="0 0 82 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.4876 14.442H27.8676V15.4282H16.6227V22.85H27.1969V23.8362H16.6227V31.9847H27.9964V32.9709H15.4876V14.442V14.442ZM28.9764 14.442H30.292L36.1209 22.5905L42.0787 14.442L50.1822 4.0918L36.8689 23.4469L43.7293 32.9709H42.3622L36.1209 24.3034L29.8538 32.9709H28.5124L35.4244 23.4469L28.9769 14.442H28.9764ZM44.2196 15.4282V14.442H58.3271V15.4282H51.828V32.9705H50.6929V15.4282H44.22H44.2196ZM0 14.442H1.41867L20.9791 43.7767L12.8956 32.9709L1.18622 15.8434L1.13467 32.9709H0V14.442V14.442ZM58.2133 31.6869C57.9809 31.6869 57.8071 31.5069 57.8071 31.2745C57.8071 31.0416 57.9809 30.8616 58.2129 30.8616C58.4476 30.8616 58.6187 31.0416 58.6187 31.2745C58.6187 31.5069 58.4476 31.6869 58.2129 31.6869H58.2133ZM59.328 30.6011H59.9356C59.944 30.9309 60.1844 31.1522 60.5373 31.1522C60.932 31.1522 61.1556 30.9145 61.1556 30.4682V27.6434H61.7738V30.4709C61.7738 31.2745 61.3102 31.7371 60.5427 31.7371C59.8227 31.7371 59.3284 31.2882 59.3284 30.6011H59.328ZM62.5822 30.5656H63.1951C63.2476 30.9447 63.6173 31.1856 64.1502 31.1856C64.6467 31.1856 65.0111 30.9278 65.0111 30.5736C65.0111 30.2691 64.7796 30.086 64.252 29.9616L63.7387 29.8371C63.0187 29.6682 62.6898 29.3189 62.6898 28.7318C62.6898 28.0198 63.2693 27.546 64.1387 27.546C64.9476 27.546 65.5387 28.0198 65.5742 28.6927H64.9724C64.9147 28.3247 64.5947 28.0945 64.1307 28.0945C63.6418 28.0945 63.3164 28.33 63.3164 28.69C63.3164 28.9754 63.5262 29.1389 64.0453 29.2607L64.484 29.3687C65.3009 29.5598 65.6378 29.8922 65.6378 30.4931C65.6378 31.2576 65.0467 31.7371 64.1031 31.7371C63.22 31.7371 62.6262 31.2798 62.5822 30.5651V30.5656Z" fill="currentColor"/>
                    </svg>
                </div>
            </div>
            <div className={classnames(styles.autoWrapper_4fa00029, styles.autoWrapper_4fa00029_pos)}>
                <div className={styles.background}></div>
                <img
                    src="https://lf9-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/37361.png"
                    alt="semi application demo"
                    className={styles.group3736} />
                <img
                    src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/desk-dark.png"
                    alt="semi application demo"
                    className={`${styles.group3736dark}`} />
            </div>
        </div>
    );
}

export default Banner;
