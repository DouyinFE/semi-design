import { _t } from "src/utils/locale";
import { navigate } from 'gatsby-link';
import React from 'react';
import styles from './dsm.module.scss';

function Dsm(props) {
    const goDsm = () => {
        location.href = DSM_URL?DSM_URL:"https://semi.design/dsm/landing";
    };
    return (
        <div {...props} className={styles.frame14293}>
            <div className={styles.frame14291}>
                <div className={styles.autoWrapper}>

                    <p className={styles.semiDSM}>Semi DSM</p>
                </div>
                <p className={styles.text_86d8f999}>{_t("powerful_theme_editor__real_time_effect__one_click_synchronization_of_design_too_d77f5776bf126331e801d6d6aa0146f2", { }, "强大的主题编辑器，实时生效，设计工具一键同步")}</p>
                <div onClick={goDsm} className={styles.buttonSecondarySolid}>
                    <p className={styles.text_8f6c2dc2}>{_t("learn_more", { }, "了解更多")}</p>
                </div>
            </div>
            <video autoPlay loop muted src="https://lf9-static.semi.design/obj/semi-tos/images/homepage-dsm.mp4" type="video/mp4" className={styles.frame4160}></video>
        </div>
    );
}

export default Dsm;
