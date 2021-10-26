/**
 * [description] app locale
 */

const appLocale = {
    locale: 'zh-CN',
    messages: {

        'apiDoc':'API 文档',
        'designDoc':'设计文档',

        // designToken
        'designToken.variable': '变量',
        'designToken.defaultValue': '默认值',
        'designToken.usage': '用法',
        'designToken.WIP': '暂无',

        // app
        'app.next': '下一步',
        // footer
        'footer.component': 'React 组件库',
        'footer.dsm': '主题与DSM',
        // search
        'search.belong.component': '组件',
        'search.belong.material': '物料',
        'search.belong.design': '设计规范',
        'search.belong.site': '站点',
        'search.type.paragraph': '段落',
        'search.type.heading': '标题',
        'search.type.code': '代码',
        'search.type.brief': '简要',
        // 'search.type.title':'文档',
        'search.type.strong': '加粗',
        'search.msg.peopleSearch': '大家在搜',
        'search.input.placeholder': '搜索组件/物料/资源',

        component: '组件',
        themeStore: '主题商店',
        designLanguage: '设计语言',
        designConcept: '为企业级中后台应用，打造高效易用美观的产品体验。',
        language: '语言',
        materialSite: '物料平台',
        changelog: '更新日志',
        'changelog.internal.link': '该类地址为Semi未开源时使用地址，外部用户可能无法访问，如有问题可以提issue~',

        // header
        'header.switchLanguage': 'Switch Language',
        'themePicker.primaryColor': '主色',
        'themePicker.confirm': '确定',

        'editor.copy': '拷贝代码',
        'editor.copy.success': '复制成功',
        'editor.reset': '重置代码',
        'editor.expand': '展开代码',
        'editor.collapse': '收起代码',
        'editor.liveTag': '可实时编辑',

        // changelog diff
        'changelog.diff.button': '版本对比',
        'changelog.diff.title': '版本对比',
        'changelog.diff.version1.insetLabel': '版本1',
        'changelog.diff.version2.insetLabel': '版本2',
        'changelog.diff.version.placeholder': '请选择版本',
        'changelog.diff.change.insetLabel': '变更',
        'changelog.diff.change.all': '全部',
        'changelog.diff.empty': '该版本之间无更新',
        'changelog.diff.type.placeholder': '请选择变更类别',
        'changelog.diff.type.insetLabel': '类别',


        // Icon list
        'icon.list.tab.fill': '面性图标',
        'icon.list.tab.stroked': '线性图标',

        // new  Home
        "comprehensive__easy_to_use_and_high_quality": "全面、易用、优质的",
        "enterprise_product_design_system": "企业级产品设计系统",
        "home.banner.description": "由字节跳动抖音前端与 UED 团队设计、开发并维护，包含设计语言、React 组件、主题等开箱即用的中后台解决方案，帮助设计师与开发者打造高质量产品。",
        "start_using": "开始使用",
        "now_serving_100_000": "现已服务 10 万 + 用户",
        "user": "用户",
        "smart_translation": "智能翻译",
        "live_open_platform": "直播开放平台",
        "experience_monitoring": "体验监测",
        "content_security": "内容安全",
        "grow_with_users": "与用户共同成长",
        "pay_attention_to_our_users__join_and_help_us_to_continuously_improve": "重视我们的用户，加入并助力我们不断完善",
        "access_is_simple_and_easy_to_use;": "接入简单易上手；Semi UI 样式美观，主题统一；API 丰富全面。",
        "beautiful_style_and_unified_theme;": "样式美观，主题统一；",
        "rich_and_comprehensive_": "丰富全面。",
        "front_end__bytedance": "前端, 字节跳动",
        "the_components_are_quite_complete__covering_a_wide_range_and_the_overall_style_i_e10d9214b403886d249f00b8c4dbb975": "Semi 组件挺全的，覆盖的比较广泛，整体风格也不错。",
        "design_resources_are_obviously_helpful_to_improve_efficiency_": "设计资源对提效有明显帮助。",
        "design__bytedance": "设计, 字节跳动",
        "there_are_many_other_business_uses_within_the_company__there_are_more_sample_ref_c5fe7051d5fbf1a547084c91f7c4fd8e": "Semi 有很多公司内的其他业务使用，有比较多的样例参考，我们依托 Semi 的组件设计，参考其他业务平台的设计方案，总结了自己的前端规范，统一平台的交付标准。",
        "component_design__referring_to_the_design_schemes_of_other_business_platforms__s_e47da10ff860ba8b9db1268c06011006": "的组件设计，参考其他业务平台的设计方案，总结了自己的前端规范，统一平台的交付标准。",
        "product_manager__bytedance": "产品经理, 字节跳动",
        "super_good!_strong_push_": "Semi 超级好用！强推。",
        "as_an_excellent_benchmarking_industry": "Semi 作为对标业界优秀的 UI 库来说做的确实很不错了，对于问题的相应速度，问题的解决效率都有很好的保障。",
        "the_library_did_a_really_good_job__it_has_a_good_guarantee_for_the_corresponding_61cb34deb7e27e6561dd9a5bce00de72": "库来说做的确实很不错了，对于问题的相应速度，问题的解决效率都有很好的保障。",
        "easy_to_use__beautiful_style_": "Semi Design使用方便，样式美观。",
        "uniform_style_and_high_fidelity_prototype_facilitate_communication_with_front_en_95d0c0ccece05c104b98ac0dae9fb53b": "Semi 统一的样式，高保真的原型便于与前端同学进行沟通。",
        "the_documentation_is_very_detailed_and_the_details_of_the_components_are_well_th_aadc51a1122c41cf69ebd4b15e83e864": "文档非常详细，对组件的细节思考非常充足。",
        "powerful_theme_editor__real_time_effect__one_click_synchronization_of_design_too_d77f5776bf126331e801d6d6aa0146f2": "强大的主题编辑器，实时生效，设计工具一键同步",
        "learn_more": "了解更多",
        "based_on": "基于",
        "real_component_code_design__massive_page_template_front_end_code_one_click": "真实组件代码设计，海量页面模板前端代码一键转",
        "under_construction": "建设中",
        "home.resource.rd": "研发",
        "home.resource.rd.desc": "基于设计语言开发，能够在线调试的 React UI 组件库, 帮助开发者高效构建应用",
        "component_documentation": "组件文档",
        "home.resource.design": "设计",
        "home.resource.design.desc": "基于 Figma 构建，与组件库代码完全对齐的设计资源，使用 Semi 设计出色的中后台企业应用",

        "excellent_design_of_mid_background_enterprise_applications": "设计出色的中后台企业应用",
        "home.theme": "百变主题",
        "home.theme.desc": "快速克隆或深度定制，灵活调配符合品牌调性的设计风格",
        "home.pro.desc": "基于 40+ 真实组件代码设计，海量页面模板前端代码一键转",

        "default": "默认",
        "feishu_universe_design_theme": "飞书 Universe Design 主题",
        "douyin_creative_service_theme": "抖音创作服务主题",
        "volcengine_theme": "火山引擎主题",
        "system_notification": "系统通知",
        "#nezha_s_magic_child_descent_#topic_activity_is_now_open!_according_to_the_rules_e2fe356bd395679eb176daa81ef0d082": "#哪吒之魔童降世# 话题活动开讲啦！根据活动规则，恭喜 13 位...",
        "semi_design_share_presentation": "Semi Design 分享演示文稿",
        "beijing__china": "中国 北京",
        "douyin_certification": "官方认证",
        "chief_foodie__good_at_algorithms__especially": "首席吃货，擅长算法，特别是",
        "video_compression_algorithm": "视频压缩算法",
        "official_topics": "官方话题",
        "commercialization": "商业化",
        "big_v": "大 V",
        "private_message_management": "私信管理",
        "apple_account": "Apple 账号",
        "google_account": "Google 账号",
        "douyin_little_assistant": "抖音小助手",
        "volcano_little_helper": "火山小助手",
        "placeholder_text": "占位文本",
        "send": "发送",
        "sender": "发信人",
        "private_message_content": "私信内容",
        "time_of_dispatch": "发信时间"
    },
};

export default appLocale;
