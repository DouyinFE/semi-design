/* argus-disable dangerMethod */
/* eslint-disable max-lines-per-function */
import React, { isValidElement, useRef, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Icon, List, Empty } from '@douyinfe/semi-ui';
import { IllustrationNoResult } from '@douyinfe/semi-illustrations';
import _ from 'lodash-es';
import cls from 'classnames';
import { useIntl } from 'react-intl';
import { makeAnchorId } from 'utils/index';
import * as commonUtils from '../../common';

const isResultInThisPage = resultUrl => {
    if (!process.browser) {
        return false;
    }

    return location.pathname === resultUrl.split('#')[0];
};

export default props => {
    const intl = useIntl();
    const { searchResult, keyword } = props;
    const makeItHighlight = words => {

        const reg = new RegExp(`(${_.escapeRegExp(keyword)})`, 'i');
        const result = words.replace(reg, p1 => `<span class=${styles.highlight}>
                             ${p1}
                         </span>`);

        return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };
    const ref = useRef({ endIndexCache: 0, currentSelectedIndexCache: 0 });
    const [endIndex, setEndIndex] = useState(10);

    const pagedSearchResult = searchResult.slice(0, endIndex <= searchResult.length ? endIndex : searchResult.length);
    useEffect(() => {
        const scrollEle = document.querySelector(`.${ styles.list}`);
        const scrollEventListener = _.throttle(event => {
            if (commonUtils.isScrollContainerScrollToEnd(scrollEle, 500)) {
                setEndIndex(ref.current.endIndexCache + 10);
                ref.current.endIndexCache += 10;
            }
        }, 500);
        scrollEle.addEventListener('scroll', scrollEventListener);
        return () => {
            scrollEle.removeEventListener('scroll', scrollEventListener);
        };
    }, []);

    const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);

    useEffect(() => {
        const upDownBtnOnPressListener = keyEvent => {
            let targetIndex;
            if (keyEvent.code === 'ArrowDown') {
                targetIndex = ref.current.currentSelectedIndexCache + 1;
                if (targetIndex > searchResult.length) {
                    targetIndex = 0;
                }
            } else if (keyEvent.code === 'ArrowUp') {
                targetIndex = ref.current.currentSelectedIndexCache - 1;
                if (targetIndex < 0) {
                    targetIndex = 0;
                }
            } else {
                if (keyEvent.code === 'Enter' && searchResult.length > 0) {
                    window.open(searchResult[ref.current.currentSelectedIndexCache].url);
                }
                return;
            }
            setTimeout(() => {
                setCurrentSelectedIndex(targetIndex);
                ref.current.currentSelectedIndexCache = targetIndex;


                const currentSelectedDom = document.querySelector(`#searchResult-${targetIndex}`);
                const scrollViewContainer = document.querySelector(`.${ styles.list}`);
                const position = commonUtils.isDomVisibleInScrollView(currentSelectedDom, scrollViewContainer);
                if (position > 0) {
                    scrollViewContainer.scrollTop = scrollViewContainer.scrollTop + currentSelectedDom.clientHeight;
                } else if (position < 0) {
                    scrollViewContainer.scrollTop = scrollViewContainer.scrollTop - currentSelectedDom.clientHeight;
                }
            }, 0);
        };
        document.addEventListener('keydown', upDownBtnOnPressListener);

        return () => document.removeEventListener('keydown', upDownBtnOnPressListener);
    }, [searchResult]);

    return (
        <div className={styles.results}>
            <List
                split={false}
                emptyContent={<Empty image={<IllustrationNoResult />} description={'角度过于刁钻，未找到结果'} />}
                className={styles.list}
                dataSource={pagedSearchResult}
                renderItem={(item, index) => {
                    const classname = {};
                    classname[styles.resultItem] = true;
                    classname[styles.hovered] = index === currentSelectedIndex;
                    let iconType = 'search-text';
                    switch (item.belong) {
                        case 'component':
                            iconType = 'search-text';
                            break;
                        case 'material':
                            iconType = 'search-material';
                            break;
                        default:
                            break;
                    }

                    return (
                        <List.Item style={{ padding: '0px' }}>
                            <a
                                className={cls(classname)}
                                id={`searchResult-${index}`}
                                href={item.url}
                                target={'_blank'}
                                rel="noreferrer"
                                onClick={e => {
                                    if (!isResultInThisPage(item.url)) {
                                        return;
                                    }
                                    let hash = item.url.split('#')[1];
                                    hash = decodeURI(hash);
                                    const safeHash = makeAnchorId(hash);
                                    const resultDom = document.querySelector(`#${safeHash}`);
                                    window.hideSearch();
                                    if (resultDom) {
                                        resultDom.scrollIntoView();
                                    }
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onMouseEnter={() => {
                                    setCurrentSelectedIndex(index);
                                    ref.current.currentSelectedIndexCache = index;
                                }}
                            >
                                <div className={styles.imgWrapper}>
                                    <Icon
                                        type={iconType}
                                        size={'extra-large'}
                                        style={{ display: 'block', width: '100%', height: '100%' }}
                                    />
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.title}>
                                        {item.title.length !== 0
                                            ? item.title
                                            : isValidElement(item.context)
                                                ? item.context
                                                : makeItHighlight(item.context)}
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.type}>{intl.formatMessage({ id: `search.belong.${item.belong}` })}</div>
                                        <div className={styles.context}>
                                            {isValidElement(item.context)
                                                ? item.context
                                                : makeItHighlight(item.context)}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};
