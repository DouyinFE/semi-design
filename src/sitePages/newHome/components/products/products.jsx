import { _t } from "src/utils/locale";
import React from 'react';
import styles from './products.module.scss'
import classnames from 'classnames'

function Products(props) {
    const classForDarkImage = classnames(styles.showInDark, styles.hideInLight)
    return (
        <div {...props} className={styles.frame4567}>
            <p className={styles.text}><span className={styles.text_ff23e7f4}>{_t("now_serving_100_000", { }, "现已服务 10 万")}</span></p>
            <div className={styles.frame4149}>
                <div className={styles.autoWrapper}>
                    <div className={styles.autoWrapper_9fdc909b}>
                        <div className={classnames(styles.group720, styles.hideInDark)}>
                            <img src="https://lf9-static.semi.design/obj/semi-tos/images/16cec1b0-321a-11ec-adec-e911cea4cf98.png" className={styles.logo} />
                            <img src="https://lf9-static.semi.design/obj/semi-tos/images/16cf0fd0-321a-11ec-ab65-77a60c02a0b5.svg" className={styles.font} />
                        </div>
                        <img className={classForDarkImage} src="https://lf9-static.semi.design/obj/semi-tos/images/b11ce620-3472-11ec-b393-ab4adc2e449f.png" style={{width: 143, height: 36, marginRight: 56}} />     
                        <img src="https://lf9-static.semi.design/obj/semi-tos/images/16cf36e0-321a-11ec-b393-ab4adc2e449f.png" className={classnames(styles.image42, styles.hideInDark)} />      
                        <img className={classForDarkImage} src="https://lf9-static.semi.design/obj/semi-tos/images/a50bd6f0-3474-11ec-b008-15e09471f238.png" style={{width: 155, height: 36}} />        
                    </div>
                    <div className={styles.frame4146}>
                        <img src="https://lf9-static.semi.design/obj/semi-tos/images/16d10ba0-321a-11ec-8b14-8fb159794ae4.svg" className={styles.group4} />
                        <p className={styles.developer}><span className={styles.developer_e897b799}>Starling </span><span className={styles.developer_e5fdd783}>智能翻译</span></p>
                    </div>
                </div>
                <div className={styles.autoWrapper_d646fb63}>
                    <img src="https://lf9-static.semi.design/obj/semi-tos/images/16d02140-321a-11ec-b008-15e09471f238.svg" className={classnames(styles.frame4143, styles.hideInDark)} />
                    <img className={classnames(styles.frame4143, classForDarkImage)} src="https://lf9-static.semi.design/obj/semi-tos/images/1f988530-3475-11ec-9c23-a9f1bde3758e.svg" />
                    <div className={styles.frame4148}><img src="https://lf9-static.semi.design/obj/semi-tos/images/16d159c0-321a-11ec-8b14-8fb159794ae4.svg" className={styles.logoB156da711} />
                        <p className={styles.developer_165d0e27}>直播开放平台</p>
                    </div>
                </div>
                <div className={styles.autoWrapper_98c3cb88}>
                    <div className={styles.frame4144}><img src="https://lf9-static.semi.design/obj/semi-tos/images/16d06f60-321a-11ec-9c23-a9f1bde3758e.png" className={styles.image2} />
                        <p className={styles.developer_11777484}>Bytedance SSO</p>
                    </div>
                    <div className={classnames(styles.frame4147, styles.hideInDark)}>
                        <img src="https://lf9-static.semi.design/obj/semi-tos/images/16d09670-321a-11ec-9c23-a9f1bde3758e.svg" className={styles.group525} />
                        <p className={styles.developer_29f0558c}><span className={styles.developer_7514e1b3}>VEDEM</span><span className={styles.developer_49b20e45}> </span><span className={styles.developer_27d00334}>体验监测</span></p>
                    </div>
                    <img src="https://lf9-static.semi.design/obj/semi-tos/images/e52c5ab0-3475-11ec-9c23-a9f1bde3758e.svg" className={classnames(styles.frame4147, classForDarkImage)} />
                </div>
                <div className={styles.autoWrapper_bd7d4723}>
                    <img src="https://lf9-static.semi.design/obj/semi-tos/images/16d02140-321a-11ec-adec-e911cea4cf98.svg" className={classnames(styles.frame3214, styles.hideInDark)} />
                    <img src="https://lf9-static.semi.design/obj/semi-tos/images/a4aad5c0-3475-11ec-8b14-8fb159794ae4.svg" className={classnames(styles.frame3214, classForDarkImage)} />
                    <div className={styles.frame598}>
                        <div className={styles.frame4148}><img src="https://lf9-static.semi.design/obj/semi-tos/images/16d159c0-321a-11ec-ab65-77a60c02a0b5.svg" className={styles.sun} />
                            <p className={styles.text_c4b32e0c}>内容安全</p>
                        </div>
                    </div>
                </div>
                <div className={styles.frame4145}><img src="https://lf9-static.semi.design/obj/semi-tos/images/16d132b0-321a-11ec-b393-ab4adc2e449f.svg" className={styles.frame} />
                    <p className={styles.developer_697ea731}>Miigo</p>
                </div>
            </div>
        </div>
    );
}

export default Products;
