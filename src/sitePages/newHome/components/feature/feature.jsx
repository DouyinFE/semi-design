/* eslint-disable jsx-a11y/click-events-have-key-events */
import { _t } from "../../../../utils/locale";
import React from 'react';
import styles from "./feature.module.scss";

function Feature(props) {

    return (
        <div {...props} className={styles.frame14370}>
            <p className={styles.title} data-locale={"en-US"}>{_t("feature_title")}</p>
            <p className={styles.subtitle}>{_t("feature_subtitle")}</p>
            <div className={styles.featuresList}>
                <div className={styles.row1}>
                    <div className={styles.iconDetails}>
                        <img className={styles.icon} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/fa-icon.png" />
                        <div className={styles.details}>
                            <p className={styles.headline}>{_t("feature_FA")}</p>
                            <p className={styles.description}>
                            {_t("feature_FA_description")}
                            </p>
                        </div>
                    </div>
                    <div className={styles.iconDetails}>
                        <img className={styles.icon} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/a11y-icon.png" />
                        <div className={styles.details}>
                            <p className={styles.headline}>{_t("feature_a11y")}</p>
                            <p className={styles.description}>
                                {_t("feature_a11y_description")}
                            </p>
                        </div>
                    </div>
                    <div className={styles.iconDetails}>
                        <img className={styles.icon} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/language-icon.png" />
                        <div className={styles.details}>
                            <p className={styles.headline}>{_t("feature_language")}</p>
                            <p className={styles.description}>
                                {_t("feature_language_description")}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.row1}>
                    <div className={styles.iconDetails}>
                        <img className={styles.icon} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/livecode-icon.png" />
                        <div className={styles.details}>
                            <p className={styles.headline}>{_t("feature_live_code")}</p> 
                            <p className={styles.description}>
                                {_t("feature_live_code_description")}
                            </p>
                        </div>
                    </div>
                    <div className={styles.iconDetails}>
                        <img className={styles.table} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/ssr-icon.png" />
                        <div className={styles.details}>
                            <p className={styles.headline}>{_t("feature_test")}</p>
                            <p className={styles.description}>
                                {_t("feature_test_description")}
                            </p>
                        </div>
                    </div>
                    <div className={styles.iconDetails}>
                        <img className={styles.table} src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/a11y-icon.png" />
                        <div className={styles.details}>
                            <p className={styles.headline}>{_t("feature_SSR")}</p>
                            <p className={styles.description}>
                                {_t("feature_SSR_description")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feature;
