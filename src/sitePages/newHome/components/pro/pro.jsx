import { _t } from "src/utils/locale";
import React from 'react';
import styles from './pro.module.scss';

function Pro(props) {
    return (
        <div {...props} className={styles.macBookPro2}>
            <div className={styles.frame14294}>
                <div className={styles.frame4151}>
                    <p className={styles.semiPro}>Semi Pro</p>
                </div>
                <p className={styles.text}><span className={styles.text_4c571d3f}>{_t("home.pro.desc", { }, "基于")}</span></p>
                <div className={styles.buttonSecondarySolid}>
                    <p className={styles.text_001dc6a1}>{_t("under_construction", { }, "建设中")}</p>
                </div>
            </div>
            <div className={styles.autoWrapper}><img src="https://lf9-static.semi.design/obj/semi-tos/images/homepage-pro-code.jpg" className={styles.syntaxHighlighter} />
                <div className={styles.rectangle1080}></div>
                <div className={styles.frame14295}>
                    <div className={styles.autoWrapper}><img src="https://lf9-static.semi.design/obj/semi-tos/images/5de23960-3242-11ec-8b14-8fb159794ae4.png" className={styles.chromeStandart} /><img src="https://lf9-static.semi.design/obj/semi-tos/images/5ddb0d70-3242-11ec-adec-e911cea4cf98.png" className={styles.chromeStandart_2167fd7e} /><img src="https://lf9-static.semi.design/obj/semi-tos/images/5ddc6d00-3242-11ec-9c23-a9f1bde3758e.png" className={styles.chromeStandart_07210c83} /></div>
                </div>
            </div>
        </div>
    );
}

export default Pro;
