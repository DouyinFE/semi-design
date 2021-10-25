import { _t } from "src/utils/locale";
import React, {useCallback, useState, useEffect, useRef} from 'react';
import styles from './theme.module.scss'
import Demo from './components/demo';
import classnames from 'classnames';
import themeStyles from './themeConfig.module.scss'
import TopBar from "./components/topBar";
import {compile, insertStyleToDocument, removeStyleFromDocument} from '../../utils/compileScss'
// import { customCssVariables } from "./cutsomCssVariable";
import { Spin } from "@douyinfe/semi-ui";
import { larkTheme, douyinTheme, huoshanTheme } from "./theme";

const MAP_CLASS = {
    'lark': themeStyles.demoWrapperLark,
    'douyin': themeStyles.demoWrapperDouyin,
    'huoshan': themeStyles.demoWrapperHuoshan
}

const MAP_THEME = {
    'lark': larkTheme,
    'douyin': douyinTheme,
    'huoshan': huoshanTheme
}


function Theme(props) {
    // const cache = useRef({})
    const [themeType, setThemeType] = useState('default');
    const [loading, setLoading] = useState(false);
    const onChangeTheme = useCallback(async (type) => {
        setThemeType(type)
        // 添加缓存
        let css = MAP_THEME[type] || '';
        // let css;
        // if (cache.current[type]) {
        //     css = cache.current[type]
        // } else {
        //     setLoading(true)
        //     css = await compile(customCssVariables[type] || {})
        //     setLoading(false)
        //     cache.current[type] = css;
        // }
        insertStyleToDocument(css)
    })

    useEffect(() => {
        return () => {
            removeStyleFromDocument()
        }
    }, [])
    return (
        <div {...props} className={styles.frame14296}>
            <div className={styles.group4218}>
                <p className={styles.text}>{_t("home.theme")}</p>
                <p className={styles.text_5f990524}>{_t("home.theme.desc")}</p>
                <div className={styles.frame4150}>
                    <div onClick={() => onChangeTheme('default')} className={classnames(styles.selectTrigger, {[styles.selected]: themeType === 'default'})}>
                        {
                            loading && themeType === 'default'
                                ? <Spin wrapperClassName={styles.loadingSpin}></Spin>
                                : <img src="https://lf9-static.semi.design/obj/semi-tos/images/5c4bb380-3245-11ec-ab65-77a60c02a0b5.svg" className={styles.frame3059} />
                        }
                        <div className={styles.frame4155}>
                            <p className={styles.value}><span className={styles.value_c28b964d}>Semi Design </span><span className={styles.value_79ae18fb}>{_t("default", { }, "默认")}</span></p>
                        </div>
                    </div>
                    <div onClick={() => onChangeTheme('lark')} className={classnames(styles.selectTrigger_eecab517, {[styles.selected]: themeType === 'lark'})} >
                        {
                            loading && themeType === 'lark'
                                ? <Spin wrapperClassName={styles.loadingSpin}></Spin>
                                : <img src="https://lf9-static.semi.design/obj/semi-tos/images/5c4bb380-3245-11ec-b008-15e09471f238.svg" className={styles.frame3059} />
                        }
                        <div className={styles.frame4155}>
                            <p className={styles.value_ee5552b6}>{_t("feishu_universe_design_theme", { }, "飞书 Universe Design 主题")}</p>
                        </div>
                    </div>
                    <div onClick={() => onChangeTheme('douyin')} className={classnames(styles.selectTrigger_eecab517, {[styles.selected]: themeType === 'douyin'})}>
                        {
                            loading && themeType === 'douyin'
                                ? <Spin wrapperClassName={styles.loadingSpin}></Spin>
                                : <img src="https://lf9-static.semi.design/obj/semi-tos/images/douyin-logo.png" className={styles.frame3059} style={{width: 30}} />
                        }
                        
                        <div className={styles.frame4155}>
                            <p className={styles.value_acee012f}>{_t("douyin_creative_service_theme", { }, "抖音创作服务主题")}</p>
                        </div>
                    </div>
                    <div onClick={() => onChangeTheme('huoshan')} className={classnames(styles.selectTrigger_042dad83, {[styles.selected]: themeType === 'huoshan'})}>
                        {
                            loading && themeType === 'huoshan'
                                ? <Spin wrapperClassName={styles.loadingSpin}></Spin>
                                : <img src="https://lf9-static.semi.design/obj/semi-tos/images/5c4d8840-3245-11ec-b393-ab4adc2e449f.svg" className={styles.frame3059} />
                        }
                        
                        <div className={styles.frame4155}>
                            <p className={styles.value_2b63d90d}>{_t("volcengine_theme", { }, "火山引擎主题")}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.demoWrapper}>
                <TopBar></TopBar>
                <Demo className={MAP_CLASS[themeType]}></Demo>
            </div>
        </div>
    );
}

export default Theme;
