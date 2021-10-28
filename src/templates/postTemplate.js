/* eslint-disable */
import React, { useEffect, useMemo, useCallback, useContext, useState, useLayoutEffect, useRef } from 'react';
import { graphql, Link } from 'gatsby';
import Blocks from '@douyinfe/semi-site-markdown-blocks';
import '@douyinfe/semi-site-markdown-blocks/dist/index.css';
import SearchAllInOne from '../components/SearchAllInOne';
import { Icon, Row, Col, Tag, Tooltip, Checkbox, Button, Radio, Skeleton, Toast, Table } from '@douyinfe/semi-ui';
import * as scopeJSFile from './scope';
import * as hocs from 'components/Hocs';
import { MDXProvider } from '@mdx-js/react';
import Notice from 'components/Notice';
import Compare from 'components/Compare';
import PageAnchor from 'components/PageAnchor';
import PrevAndNext from 'components/PrevAndNext';
import SEO from 'components/seo';
import DesignToken from 'components/DesignToken';
import { makeAnchorId } from '../utils';
import ComponentOverview from 'components/ComponentOverview';
import { get, isString, capitalize, noop } from 'lodash-es';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import IconList from 'components/IconList';
import { getLocale } from '../utils/locale';
import ReactDOM from 'react-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { itemsArr } from '../utils/category';
import FullPalette from 'components/FullPalette';
import ColorConverter from 'components/ColorConverter';
import JumpToToken from 'components/JumpToToken';
import copy from 'copy-text-to-clipboard';
import '@douyinfe/semi-site-doc-style';
import SemiSiteChangeLogDiff from 'components/SemiSiteChangeLogDiff';
import { COMPONENT_LIST } from 'components/SemiSiteChangeLogDiff/constant';
import { getVersion } from 'components/ChangeLogDiff/utils';
import '../styles/changelog.scss';
import '../styles/content.scss';
import '../styles/docDemo.scss';
import '../styles/index.scss';
import '../styles/doc.scss';
import cls from 'classnames';
import { IconLink, IconFile } from '@douyinfe/semi-icons';
import { Switch, TabPane, Tabs } from '../../packages/semi-ui';
import DesignPageAnchor from 'components/DesignPageAnchor';
import transContent, {getAnotherSideUrl, isHaveUedDocs, isJumpToDesignSite} from './toUEDUtils/toUED';
import './toUEDUtils/toUED.scss';
const Text = ({ lang, letterSpacing, size, lineHeight, text }) => {
    letterSpacing = letterSpacing || 'auto';
    return (
        <div
            className={cls('text', 'gatsby-text')}
            style={{
                letterSpacing,
                fontSize: size,
                lineHeight: `${lineHeight}px`,
            }}
        >
            {text}
        </div>
    );
};

const SemiComponents = {
    Row,
    Col,
    Text,
    Icon: props => (
        <Tooltip trigger="click" content={`图标：${props.type}`}>
            <Icon className="md markdown gatsby-icon" {...props} />
        </Tooltip>
    ),
    Notice,
    Checkbox,
    Radio,
    DesignToken,
};

const pre = ({ ...props }) => {
    if (props.children.props.className === 'language-icon') {
        return <Blocks.pre className={'pre-icon gatsby-pre-icon'} {...props} />;
    }

    if (props.children.props.className === 'language-material') {
        return <Blocks.pre className={'pre-material gatsby-material'} {...props} />;
    }

    if (props.children.props.className === 'language-overview') {
        return <Blocks.pre className={'pre-overview gatsby-overview'} {...props} />;
    }

    return <Blocks.pre {...props} />;
};

const code = ({ ...props }) => {
    if (props.className === 'language-icon') {
        return <IconList />;
    }

    if (props.className === 'language-overview') {
        return <ComponentOverview code={props.children} />;
    }

    const scope = {
        useEffect,
        useMemo,
        useCallback,
        useContext,
        useState,
        useLayoutEffect,
        ...scopeJSFile,
    };
    let ref = useRef({
        mounted: false,
        newProps: { ...props, scope },
    });
    let { newProps } = ref.current;
    newProps.lineNumber = false;

    if (!process.browser) {
        newProps.live = false;
    }

    newProps.lineNumber = false;

    const Placeholder = () => (
        <Skeleton
            active
            placeholder={
                <Skeleton.Image
                    style={{
                        width: '100%',
                        height: 518,
                    }}
                />
            }
        />
    );

    const [Component, _setComponent] = useState(() => Placeholder);

    const setComponent = component => {
        if (ref.current.mounted) {
            _setComponent(component);
        }
    };

    useEffect(() => {
        ref.current.mounted = true;
        setTimeout(async () => {
            let { newProps } = ref.current;
            let content = await import('../components/CodeBlock/index.js');
            let lodash_es = await import('lodash-es');
            let lodashScope = { ...lodash_es };
            delete lodashScope.default;
            newProps.scope = { ...newProps.scope, ...lodashScope, _: { ...lodash_es } };
            setComponent(() => content.default);
        }, 0);
        return () => {
            ref.current.mounted = false;
        };
    });
    return (
        <div className={'gatsby-live-code'}>
            <Component {...ref.current.newProps} />
        </div>
    );
};

const components = {
    Compare,
    ColorConverter,
    FullPalette,
    JumpToToken,
    ...SemiComponents,
    ...Blocks,
    code,
    pre,
    hr: ({}) => <hr className={'gatsby-hr'} />,
    h2: ({ children }) => {
        const intl = useIntl();
        return (
            <h2 className="md markdown gatsby-h2" id={makeAnchorId(children)}>
                {children}
                <IconLink
                    className={'anchor-link-button-icon'}
                    onClick={() => {
                        copy(`${window.location.href.replace(window.location.hash, '')}#${window.encodeURI(children)}`);
                        Toast.success({
                            content: intl.formatMessage({
                                id: 'editor.copy.success',
                            }),
                            duration: 3,
                        });
                    }}
                />
            </h2>
        );
    },
    blockquote: ({ children }) => <blockquote className={'gatsby-blockquote'}>{children}</blockquote>,
    h3: ({ children }) => {
        const intl = useIntl();
        return (
            <h3 className="md markdown gatsby-h3" id={makeAnchorId(children)}>
                {children}
                <IconLink
                    className={'anchor-link-button-icon'}
                    onClick={() => {
                        copy(`${window.location.href.replace(window.location.hash, '')}#${window.encodeURI(children)}`);
                        Toast.success({
                            content: intl.formatMessage({
                                id: 'editor.copy.success',
                            }),
                            duration: 3,
                        });
                    }}
                />
            </h3>
        );
    },
    h4: ({ children }) => {
        const version = isString(children) ? getVersion(children) : undefined;
        return (
            <h4 className="md markdown gatsby-h4" id={makeAnchorId(children)}>
                {children}
                { version && <SemiSiteChangeLogDiff style={{ marginLeft: 16 }} hoverContent={children} /> }
            </h4>
        );
    },
    h5: ({ children }) => (
        <h5 className="md markdown gatsby-h5" id={makeAnchorId(children)}>
            {children}
        </h5>
    ),
    h6: ({ children }) => (
        <h6 className="md markdown gatsby-h6" id={makeAnchorId(children)}>
            {children}
        </h6>
    ),
    section: ({ children }) => {
        let id = '';

        if (Array.isArray(children)) {
            if (children[0].props.originalType === 'h2') {
                id = children[0] ? children[0].props.children : '';
            }
        } else {
            id = children.props.children;
        }

        return <section className="markdown md anchor-section gatsby-section">{children}</section>;
    },
    ul: ({ children }) => <ul className="md markdown gatsby-ul">{children}</ul>,
    li: ({ children }) => {
        if (Array.isArray(children)) {
            children = [...children];

            if (children[0] === '【Feature】' || children[0] === '【Feat】') {
                children[0] = <div className={'changelog-title'}>🎁【Feature】</div>;
            }

            if (children[0] === '【Chore】') {
                children[0] = <div className={'changelog-title'}>🗃【Chore】</div>;
            }

            if (children[0] === '【New Component】') {
                children[0] = <div className={'changelog-title'}>💡【New Component】</div>;
            }

            if (children[0] === '【Fix】') {
                children[0] = <div className={'changelog-title'}>🔧【Fix】</div>;
            }

            if (children[0] === '【Perf】') {
                children[0] = <div className={'changelog-title'}>🚀【Performance】</div>;
            }

            if (children[0] === '【Style】') {
                children[0] = <div className={'changelog-title'}>💅【Style】</div>;
            }

            if (children[0] === '【Docs】') {
                children[0] = <div className={'changelog-title'}>✏️【Documentation】</div>;
            }

            if (children[0] === '【Refactor】') {
                children[0] = <div className={'changelog-title'}>🧶【Refactor】</div>;
            }

            if (children[0] === '【Breaking Change】') {
                children[0] = <div className={'changelog-title'}>💥【Breaking Change】</div>;
            }
        }

        return <li className={'gatsby-li'}>{children}</li>;
    },
    img: props => (
        <img className={cls(props.className, 'gatsby-img')} src={props.src} style={props.style} alt={props.alt} />
    ),
    ol: ({ children }) => <ol className="md markdown gatsby-ol">{children}</ol>,
    p: ({ children }) => <div className="md markdown gatsby-p">{children}</div>,
    a: props => {
        let isExternal = false;
        let isCodeBOrGitlab = false;
        const intl = useIntl();

        if (props.href.match(/http(s|):\/\//) || props.href[0] === '#') {
            isExternal = true;
        }

        if (typeof props.href === 'string' && props.href.includes('#code_b_org_gitlab')) {
            isCodeBOrGitlab = true;
        }

        if (isExternal) {
            let { href } = props;

            if (href[0] === '#') {
                href = `#${makeAnchorId(href.slice(1))}`;
            }

            return (
                <a 
                    href={href} 
                    className="md gatsby-a" 
                    target={props.target} 
                    onClick={isCodeBOrGitlab ? (() => Toast.info({
                        content: intl.formatMessage({ id: 'changelog.internal.link' }),
                        duration: 3,
                        textMaxWidth: 300
                    })) : noop}
                    >
                    {props.children}
                </a>
            );
        } else {
            return (
                <Link className="md markdown gatsby-a" to={props.href} target={props.target}>
                    {props.children}
                </Link>
            );
        }
    },
    table: props => {
        const { children } = props;
        const toArray = value => Array.isArray(value) ? value : [value];
        const columnsFiber = toArray(get(children[0], 'props.children.props.children'));
        const dataFiber = toArray(get(children[1], 'props.children'));
        const getColumnsFromFiber = columnsFiber => {
            const columnsTitle = columnsFiber.map(column => get(column, 'props.children'));
            const columns = columnsTitle.map((title, index) => ({ title, dataIndex: `col-${index}` }));
            return columns;
        }
        const getDataFromFiber = dataFiber => {
            const dataSource = dataFiber.map((rowFiber, rowIndex) => {
                const row = toArray(get(rowFiber, 'props.children'));
                const record = {};
                row.forEach((colFiber, colIndex) => {
                    const colContent = get(colFiber, 'props.children');
                    record[`col-${colIndex}`] = colContent;
                });
                return { key: `row-${rowIndex}`, ...record };
            })
            return dataSource;
        }
        try {
            const columns = getColumnsFromFiber(columnsFiber);
            const dataSource = getDataFromFiber(dataFiber);
            return (
                <div className="table-container gatsby-table-container">
                    {/* <table className="md markdown gatsby-table">{children}</table> */}
                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={dataSource}
                    />
                </div>
            );
        } catch {
            return (
                <div className="table-container gatsby-table-container">
                    <table className="md markdown gatsby-table">{children}</table>
                </div>
            );
        }
    },
};

const getPrevAndNext = pageContext => {
    let { previous, next } = pageContext;

    const getUrlFromNode = obj => {
        let locale = getLocale();
        let nodeLocale = obj.frontmatter.localeCode || locale;
        let slug = get(obj, 'fields.slug');

        if (slug.includes(locale)) {
            // nothing to do;
        } else {
            // get another language mdx, should replace localeCode
            slug = slug.replace(nodeLocale, locale);
        }

        return slug;
    };

    const buildItem = obj => ({
        category: '',
        title: get(obj, 'frontmatter.title'),
        url: getUrlFromNode(obj),
        icon: get(obj, 'frontmatter.icon', ''),
    });

    return {
        prev: previous ? buildItem(previous) : null,
        next: next ? buildItem(next) : null,
    };
};

const getEngAndCNTitle = str => {
    let splitIndex = str.lastIndexOf(' ');

    if (splitIndex === -1) {
        splitIndex = str.length;
    }

    return [str.slice(splitIndex), str.slice(0, splitIndex)];
};

const getCNtype = type => {
    for (let item of itemsArr) {
        if (item.itemKey === type) {
            return item.text;
        }
    }

    return type;
};

export default function Template(args) {
    const { pageContext, data,location }=args
    useEffect(() => {
        const { hash } = window.location;

        try {
            if (hash === '') {
                window.scrollTo({
                    top: 0,
                });
            } else {
                const id = `#${makeAnchorId(window.decodeURI(hash.slice(1)))}`; // console.log('id', id);

                const dom = document.querySelector(id);
                if (dom) {
                    setTimeout(()=>dom.scrollIntoView());
                }
            }
        } catch (e) {
            console.log('error', e);
        }
    }, []);
    useEffect(() => {
        if (window.location.pathname.indexOf('/start/changelog') !== -1) {
            let titles = document.querySelectorAll('.main-article .gatsby-h4');
            for (let title of titles) {
                const version = title.firstChild;
                const date = version.textContent.match(/\d\d\d\d-\d\d-\d\d/);
                if (date) {
                    const newVersion = `${version.textContent.replace(`(${date})`, '')}`;
                    version.replaceData(0, version.length, newVersion);
                }
                const tagDateDiv = document.createElement('div');
                tagDateDiv.setAttribute('class', 'changeLog-date');
                tagDateDiv.append(`${date}`);
                title.appendChild(tagDateDiv);
            }
        }
    }, []);
    const { current } = data;
    const intl = useIntl(); // console.log('current', current);
    const { prev, next } = getPrevAndNext(pageContext);
    const [cnTitle, enTitle] = getEngAndCNTitle(current.frontmatter.title);

    const calcClassName = () => {
        let cls = ['article-wrapper'];

        if (pageContext.slug.indexOf('start/changelog') !== -1) {
            cls.push('changelog');
        }

        if (pageContext.slug.indexOf('start/update-to-v2') !== -1) {
            cls.push('update-to-v2');
        }

        if (pageContext.slug.indexOf('start/introduction') !== -1) {
            cls.push('introduction');
        }

        if (pageContext.slug.indexOf('start/faq') !== -1) {
            cls.push('faq');
        }

        return cls.join(' ');
    };

    const setHornbill = userInfo => {
        const appKey = 344;
        const email = userInfo && userInfo.email;
        const options = {
            iconUrl: 'https://sf1-cdn-tos.douyinstatic.com/obj/eden-cn/lteh7hpqpoz/semi-hornbill/hornbill_icon.png',
            iconRight: '40px',
            iconBottom: '40px',
            draggable: false,
        };
        window.EvaluateSDK && window.EvaluateSDK(appKey, email, options);
    };

    const [iframeAnchorData,setIframeAnchorData]=useState(null);

    useEffect(()=>{
        const handleMessage=(e)=>{
            if(e.data==='toRD'){
                transContent('main');
                return;
            }

            let data;
            try{
                data=JSON.parse(e.data);
            }catch (e){
                return;
            }
            if(data.type==='anchorData'){
                setIframeAnchorData(data.value);
            }

        }
        window.addEventListener('message',handleMessage);
        return ()=>window.removeEventListener('message',handleMessage);
    },[]);


    const isComponentPage = COMPONENT_LIST.some(item => item.toLowerCase() === enTitle.toLowerCase());
    const haveUedDoc=isHaveUedDocs(location?.pathname || window.location.pathname);
    const jumpToDesignSite=isJumpToDesignSite(location?.pathname || window.location.pathname);
    const [tabValue,setTabValue]=useState('rd');
    return (
        <div className={calcClassName()}>
            <SEO lang="zh-CN" title={`${current.frontmatter.title} - Semi Design`} />
            <div className="title-area" style={haveUedDoc?{}:{borderBottom:`1px solid var(--semi-color-border)`}}>
                <div>
                    {current.frontmatter.draft ? (
                        <Tag className="article-tag" color="orange">
                            DRAFT
                        </Tag>
                    ) : (
                        ''
                    )}
                    <div className="header-tinyTitle">
                        {intl.locale === 'zh-CN'
                            ? `${getCNtype(current.fields.type)} · ${enTitle}`
                            : `${current.fields.type[0].toUpperCase() + current.fields.type.slice(1)} · ${
                                  current.frontmatter.title
                              }`}
                    </div>
                    <div className="header-title">{intl.locale === 'zh-CN' ? cnTitle : current.frontmatter.title}</div>
                    <div className="article-brief">{current.frontmatter.brief}</div>
                    {isComponentPage && (
                        <SemiSiteChangeLogDiff
                            style={{
                                marginBottom: 30,
                            }}
                            currentComponent={capitalize(enTitle)}
                        />
                    )}
                </div>

                {current.fields.type !== 'start' && haveUedDoc  &&  (
                    <Tabs activeKey={tabValue} onTabClick={(key)=>{
                        if(key==='ued'){
                            if(jumpToDesignSite){
                                window.open(getAnotherSideUrl('design'));
                            }else{
                                transContent('design');
                                setTabValue('ued');
                            }

                        }else{
                            transContent('rd');
                            setTabValue('rd');
                        }
                    }}>
                        <TabPane tab={intl.formatMessage({id:'apiDoc'})} itemKey={'rd'}/>
                        <TabPane tab={intl.formatMessage({id:'designDoc'})} itemKey={'ued'}/>
                    </Tabs>
                )}
            </div>
            {tabValue==='rd' && (
                <PageAnchor slug={pageContext.slug} data={current.tableOfContents.items} />
            )}
            {
                iframeAnchorData && tabValue==='ued' && <DesignPageAnchor data={iframeAnchorData}/>
            }
            <div className="main-article">
                <MDXProvider components={components}>
                    <MDXRenderer>{current.body}</MDXRenderer>
                </MDXProvider>
                <PrevAndNext prev={prev} next={next} />
            </div>
        </div>
    );
}
export const query = graphql`
    query($slug: String!) {
        current: mdx(fields: { slug: { eq: $slug } }) {
            frontmatter {
                title
                order
                brief
                icon
            }
            fields {
                type
            }
            tableOfContents
            body
        }
    }
`;
