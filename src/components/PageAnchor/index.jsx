import { Anchor } from '@douyinfe/semi-ui';
import React from 'react';
import { makeAnchorId } from '../../utils/index';
import './index.scss';

const makeAnchorOfToken = data => {
    const anchorList = [];
    data.forEach(({ url, title }) => {
        anchorList.push(<Anchor.Link
            href={`#${makeAnchorId(title)}`}
            title={title}
            key={title}
        />);
    });
    return anchorList;
};

const PageAnchor = props => {
    const { data = [], slug } = props;
    const skipCondition = ['accessibility', 'dark-mode', 'customize-theme', 'content-guidelines', 'getting-started', 'design-to-code', 'chart'].some(item => slug.includes(item));

    let flag = false;
    const makeAnchor = data => {
        let anchorList = [];
        for (let anchorItem of data) {
            if (anchorItem.title === '代码演示' || anchorItem.title === 'Demos' || skipCondition) {
                flag = true;
            }
            if (!flag) {
                continue;
            }
            if (Array.isArray(anchorItem.items) && anchorItem.items.length > 0) {
                if (['Voice and Tone', '语法', 'Grammar and Mechanics',
                    'Installing and Using VChart', '安装和使用 VChart'].includes(anchorItem.title)) {
                    anchorList.push(<Anchor.Link
                        href={`#${makeAnchorId(anchorItem.title)}`}
                        title={anchorItem.title}
                        key={anchorItem.title}
                    > 
                        {makeAnchor(anchorItem.items)}
                    </Anchor.Link>);
                } else if (['与其他方案的差异', 'Comparisons', '配置 VChart 主题', 'Configuring VChart Theme'].includes(anchorItem.title)) {
                    anchorList.push(<Anchor.Link
                        href={`#${makeAnchorId(anchorItem.title)}`}
                        title={anchorItem.title}
                        key={anchorItem.title}
                    > 
                    </Anchor.Link>);
                } else if (anchorItem.title === '代码演示' || anchorItem.title === 'Demos' || skipCondition) {
                    anchorList.push(makeAnchor(anchorItem.items));
                } else {
                    anchorList.push(
                        <Anchor.Link
                            href={`#${makeAnchorId(anchorItem.title)}`}
                            title={anchorItem.title}
                            key={anchorItem.title}
                        />
                    );
                }
            } else {
                anchorList.push(
                    <Anchor.Link
                        href={`#${makeAnchorId(anchorItem.title)}`}
                        title={anchorItem.title}
                        key={anchorItem.title}
                    />
                );
            }
        }
        return anchorList;
    };

    let anchorLinkList = [];
    if (/tokens/.test(slug.toLowerCase())) {
        anchorLinkList = makeAnchorOfToken(data);
    } else {
        anchorLinkList = makeAnchor(data);
    }
    return (
        <Anchor
            showTooltip
            position={'left'}
            scrollMotion
            offsetTop={200}
            className="category-anchor"
            targetOffset={100}
            size={'small'}
        >
            {anchorLinkList}
        </Anchor>
    );
};

export default PageAnchor;
