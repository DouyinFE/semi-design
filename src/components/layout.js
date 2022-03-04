/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import 'normalize.css';

import '../styles/layout.scss';
import 'typeface-inter';
import 'typeface-inconsolata';

import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { IntlProvider } from 'react-intl';

import { LocaleProvider } from '@douyinfe/semi-ui';
import semiZhCN from '@douyinfe/semi-ui/locale/source/zh_CN';
import semiEnUS from '@douyinfe/semi-ui/locale/source/en_US';
import SemiSiteBanner from 'semi-site-banner';
import 'semi-site-banner/dist/index.css';

import appLocaleCN from '../locale/zh-CN';
import appLocaleUS from '../locale/en-US';

import Header from './header';
import SideNav from './side-nav';
import Footer from './Footer';
import { itemsArr } from 'utils/category';
import { getLocale, _t } from 'utils/locale';


const insertScript = scriptText => {
    let sdk = document.createElement('script');
    sdk.type = 'text/javascript';
    sdk.innerHTML = scriptText;
    document.head.appendChild(sdk);
};

const AppLayout = ({ type, location, children }) => {
    const [showBanner, setShowBanner] = useState(false);

    // ----------------START insert static code to document-------------------------
    useEffect(() => {
        if (window.insertSlardarAndHornbill) {
            return;
        }
    
        Promise.resolve()
            .then(() => {
                // eslint-disable-next-line
                insertScript(`(function(i,s,o,g,r,a,m){i["SlardarMonitorObject"]=r;(i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)}),(i[r].l=1*new Date());(a=s.createElement(o)),(m=s.getElementsByTagName(o)[0]);a.async=1;a.src=g;a.crossOrigin="anonymous";m.parentNode.insertBefore(a,m);i[r].globalPreCollectError=function(){i[r]("precollect","error",arguments)};if(typeof i.addEventListener==="function"){i.addEventListener("error",i[r].globalPreCollectError,true)}if('PerformanceLongTaskTiming'in i){var g=i[r].lt={e:[]};g.o=new PerformanceObserver(function(l){g.e=g.e.concat(l.getEntries())});g.o.observe({entryTypes:['longtask']})}})(window,document,"script","https://i.snssdk.com/slardar/sdk.js?bid=patrol_445","Slardar");`);
                insertScript(`
                    window.Slardar && window.Slardar("config",{
                        bid: 'patrol_445',
                        sampleRate: 1,
                        ignoreAjax: [/.*/],
                        ignoreStatic: [/.*/],
                        ignoreErrors: [/.*/],
                        enableCatchJSError: false,
                        enableFPSJankTimesMonitor: false,
                        enableCrash: false,
                        performanceAuto: true
                    });`);

            })
            .then(() => {
                window.insertSlardarAndHornbill = true;
            })
            .catch(e => {
                console.error('Insert Slardar Failed. Error: ', e);
            });
    }, []);
    // -----------------------------------------------------------------------------

    const showSideNav =
        location.pathname.replace(/(zh\-CN\/?|en\-US\/?)/, '') !== '/' && !/(showcase|resources|customers|contribute|teams)/g.test(location.pathname);
    const data = useStaticQuery(graphql`
        query {
            allMdx(
                filter: { fields: { type: { nin: ["principles", "concepts"] } } }
                sort: { order: ASC, fields: [fields___typeOrder, fields___slug] }
            ) {
                edges {
                    node {
                        fields {
                            type
                            slug
                        }
                        frontmatter {
                            title
                            subTitle
                            localeCode
                            icon
                            order
                        }
                    }
                }
            }
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    const locale = getLocale(location.pathname);

    const messages = locale === 'zh-CN' ? appLocaleCN.messages : appLocaleUS.messages;

    const semiLocale = {
        'zh-CN': semiZhCN,
        'en-US': semiEnUS,
    };
    const semiLocaleSource = semiLocale[locale];

    const bannerRef = useCallback(node => {
        if (node !== null) {
            setShowBanner(true);
        } else {
            setShowBanner(false);
        }
    }, []);

    const headerStyle = {};
    const contentAeraStyle = {};
    const sideNavStyle = {};
    if (!showSideNav) {
        contentAeraStyle.paddingLeft = 0;
    }
    if (showBanner) {
        contentAeraStyle.paddingTop = 92;
        sideNavStyle.marginTop = 92;
    }

    // TODO import semi common footer
    return (
        <>
            <IntlProvider locale={locale} messages={messages}>
                <LocaleProvider locale={semiLocaleSource}>
                    <div style={{ position: 'fixed', width: '100%', top: 0, zIndex: 999 }}>
                        <SemiSiteBanner ref={bannerRef} type="black" style={{ height: 32 }} icon={null} />
                        {/* ssr, can't use location directly, get location from layout and pass to children */}
                        <Header style={headerStyle} location={location} localeCode={locale} />
                    </div>
                    <div className="content-area" style={contentAeraStyle}>
                        {children}
                        {!/showcase|teams/.test(location.pathname) && <Footer />}
                    </div>
                    {showSideNav ? (
                        <>
                            <SideNav hasBanner={showBanner} type={type} style={sideNavStyle} location={location} edges={data.allMdx.edges} itemsArr={itemsArr} />
                            {/* {footer} */}
                        </>
                    ) : null}
                </LocaleProvider>
            </IntlProvider>
        </>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;
