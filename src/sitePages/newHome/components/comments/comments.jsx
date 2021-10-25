import { _t } from "src/utils/locale";
import { Button } from '@douyinfe/semi-ui';
import { navigate } from 'gatsby-link';
import React from 'react';
import { getLocale } from '../../../../utils/locale';
import styles from './comments.module.scss';
import {IconGithubLogo} from '@douyinfe/semi-icons';

function Comments(props) {
    const goStart = () => {
        navigate(`/${getLocale()}/start/getting-started`);
    }
    const goGithub = () => {
        window.open('https://github.com/DouyinFE/semi-design')
    }
    return (
        <div {...props} className={styles.frame4571} style={{marginTop: 120}}>
            <div className={styles.frame4570}>
                <p className={styles.text}>{_t("grow_with_users", { }, "与用户共同成长")}</p>
                <p className={styles.text_cd35ea6d}><span className={styles.text_8e955bee}>Semi Design </span><span className={styles.text_70c95f84}>{_t("pay_attention_to_our_users__join_and_help_us_to_continuously_improve", { }, "重视我们的用户，加入并助力我们不断完善")}</span></p>
                <div className={styles.group3737}>
                    <Button onClick={goStart} size="large" theme="solid" className={styles.extraLarge}>{_t("start_using", { }, "开始使用")}</Button>
                    <div onClick={goGithub} className={styles.buttonSecondarySolid_4427b030}>
                        <IconGithubLogo size="extra-large" /><p className={styles.text_bff7eaeb}>Github</p>
                    </div>
                </div>
            </div>
            <div className={styles.frame4569}>
                <div className={styles.autoWrapper}>
                    <div className={styles.testimonial1}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1756c0-321a-11ec-adec-e911cea4cf98.png" className={styles.mColorCN} />
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e19c7c0-321a-11ec-b393-ab4adc2e449f.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback}><span className={styles.feedback_3a905c13}>{_t("access_is_simple_and_easy_to_use;", { }, "接入简单易上手；")}</span></p>
                                <div className={styles.personDetails}>
                                    <p className={styles.aMengzhou}>@Mengzhou</p>
                                    <p className={styles.text_18f690df}>{_t("front_end__bytedance", { }, "前端, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.testimonial1}>
                        <div className={styles.mColorCN_beba3295}>
                            <div className={styles.autoWrapper_4fa00029}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e17a4e1-321a-11ec-9c23-a9f1bde3758e.svg" className={styles.autoWrapper_4fa00029} />
                                <p className={styles.text_b1d6cd66}>C</p>
                            </div>
                        </div>
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e190470-321a-11ec-b008-15e09471f238.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback}>{_t("the_components_are_quite_complete__covering_a_wide_range_and_the_overall_style_i_e10d9214b403886d249f00b8c4dbb975", { }, "组件挺全的，覆盖的比较广泛，整体风格也不错。")}</p>
                                <div className={styles.personDetails}>
                                    <p className={styles.aChangyi}>@Changyi</p>
                                    <p className={styles.text_18f690df}>{_t("front_end__bytedance", { }, "前端, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.testimonial7}>
                        <div className={styles.mColorCN_beba3295}>
                            <div className={styles.autoWrapper_4fa00029}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1ab220-321a-11ec-ab65-77a60c02a0b5.svg" className={styles.autoWrapper_4fa00029} />
                                <p className={styles.text_11043f46}>M</p>
                            </div>
                        </div>
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1ad930-321a-11ec-ab65-77a60c02a0b5.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback_daa8760d}>{_t("design_resources_are_obviously_helpful_to_improve_efficiency_", { }, "设计资源对提效有明显帮助。")}</p>
                                <div className={styles.personDetails}>
                                    <p className={styles.aMiaomiao}>@Miaomiao</p>
                                    <p className={styles.text_18f690df}>{_t("design__bytedance", { }, "设计, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.autoWrapper}>
                    <div className={styles.testimonial1}>
                        <div className={styles.mColorCN_beba3295}>
                            <div className={styles.autoWrapper_4fa00029}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e190470-321a-11ec-8b14-8fb159794ae4.svg" className={styles.autoWrapper_4fa00029} />
                                <p className={styles.text_f8842908}>Y</p>
                            </div>
                        </div>
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1b0040-321a-11ec-ab65-77a60c02a0b5.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback}>{_t("there_are_many_other_business_uses_within_the_company__there_are_more_sample_ref_c5fe7051d5fbf1a547084c91f7c4fd8e", { }, "有很多公司内的其他业务使用，有比较多的样例参考，我们依托")}</p>
                                <div className={styles.personDetails_53392045}>
                                    <p className={styles.aYinfeng}>@Yinfeng</p>
                                    <p className={styles.text_05913fb1}>{_t("product_manager__bytedance", { }, "产品经理, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.testimonial1}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e190471-321a-11ec-b008-15e09471f238.png" className={styles.mColorCN} />
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1a15e0-321a-11ec-b393-ab4adc2e449f.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback}>{_t("super_good!_strong_push_", { }, "超级好用！强推。")}</p>
                                <div className={styles.personDetails}>
                                    <p className={styles.aMengzhou}>@Dingwei</p>
                                    <p className={styles.text_18f690df}>{_t("front_end__bytedance", { }, "前端, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.testimonial7}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e192b80-321a-11ec-8b14-8fb159794ae4.png" className={styles.mColorCN} />
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1979a0-321a-11ec-adec-e911cea4cf98.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback}>{_t("as_an_excellent_benchmarking_industry", { }, "作为对标业界优秀的")}</p>
                                <div className={styles.personDetails}>
                                    <p className={styles.aJingyu}>@Jingyu</p>
                                    <p className={styles.text_18f690df}>{_t("front_end__bytedance", { }, "前端, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.frame4571}>
                    <div className={styles.testimonial3}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1b2750-321a-11ec-ab65-77a60c02a0b5.png" className={styles.mColorCN} />
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1a3cf0-321a-11ec-b393-ab4adc2e449f.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback}>{_t("easy_to_use__beautiful_style_", { }, "使用方便，样式美观。")}</p>
                                <div className={styles.personDetails}>
                                    <p className={styles.aYucang}>@Yucang</p>
                                    <p className={styles.text_18f690df}>{_t("front_end__bytedance", { }, "前端, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.testimonial1}>
                        <div className={styles.mColorCN_beba3295}>
                            <div className={styles.autoWrapper_4fa00029}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1b9c80-321a-11ec-ab65-77a60c02a0b5.svg" className={styles.autoWrapper_4fa00029} />
                                <p className={styles.text_b1d6cd66}>G</p>
                            </div>
                        </div>
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e19a0b0-321a-11ec-9c23-a9f1bde3758e.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback}>{_t("uniform_style_and_high_fidelity_prototype_facilitate_communication_with_front_en_95d0c0ccece05c104b98ac0dae9fb53b", { }, "统一的样式，高保真的原型便于与前端同学进行沟通。")}</p>
                                <div className={styles.personDetails}>
                                    <p className={styles.aGuangye}>@Guangye</p>
                                    <p className={styles.text_05913fb1}>{_t("product_manager__bytedance", { }, "产品经理, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.testimonial7}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e1979a1-321a-11ec-adec-e911cea4cf98.png" className={styles.mColorCN} />
                        <div className={styles.frame4569}><img src="https://lf9-static.semi.design/obj/semi-tos/images/7e19c7c0-321a-11ec-9c23-a9f1bde3758e.svg" className={styles.quoteMark} />
                            <div className={styles.feedbackPersonDetail}>
                                <p className={styles.feedback_daa8760d}>{_t("the_documentation_is_very_detailed_and_the_details_of_the_components_are_well_th_aadc51a1122c41cf69ebd4b15e83e864", { }, "文档非常详细，对组件的细节思考非常充足。")}</p>
                                <div className={styles.personDetails}>
                                    <p className={styles.aBaifu}>@Baifu</p>
                                    <p className={styles.text_18f690df}>{_t("front_end__bytedance", { }, "前端, 字节跳动")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comments;
