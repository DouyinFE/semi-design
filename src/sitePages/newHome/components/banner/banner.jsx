import { _t } from "src/utils/locale";
import { Button } from '@douyinfe/semi-ui';
import { navigate } from 'gatsby-link';
import React from 'react';
import { getLocale } from '../../../../utils/locale';
import styles from "./banner.module.scss";
import {IconGithubLogo} from '@douyinfe/semi-icons'

function Banner() {
    const goStart = () => {
        navigate(`/${getLocale()}/start/getting-started`);
    }
    const goGithub = () => {
        window.open('https://github.com/DouyinFE/semi-design')
    }
    return (
        <div className={styles.frame4565}>
            <div className={styles.autoWrapper}>
                <div className={styles.content}>
                    <div className={styles.headerCopy}>
                        <p className={styles.text}>{_t("comprehensive__easy_to_use_and_high_quality", { }, "全面、易用、优质的")}<br />{_t("enterprise_product_design_system", { }, "企业级产品设计系统")}</p>
                        <p className={styles.text_63fb91b5}><span className={styles.text_70c95f84}>{_t("home.banner.description")}</span></p>
                    </div>
                    <div className={styles.group2835}>
                        <Button onClick={goStart} size="large" theme="solid" className={styles.extraLarge}>{_t("start_using", { }, "开始使用")}</Button>
                        <div onClick={goGithub} className={styles.buttonSecondarySolid_4427b030}><IconGithubLogo size="extra-large" /><p className={styles.text_bff7eaeb}>Github</p>
                        </div>
                    </div>
                </div>
                <div className={styles.autoWrapper_4fa00029}><div className={styles.background}></div><img src="https://lf9-static.semi.design/obj/semi-tos/images/f54dfa40-33dd-11ec-adec-e911cea4cf98.png" className={styles.group3736} /></div>
            </div>
        </div>
    );
}

export default Banner;
