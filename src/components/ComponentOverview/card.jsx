import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useStaticQuery, graphql, withPrefix, navigate } from 'gatsby';

function processData(data) {
    let res = {};
    for (let item of data.allMdx.edges) {
        res[item.node.frontmatter.title] = item.node.fields.slug;
    }
    return res;
}

const ComponentCard = props => {
    const intl = useIntl();
    const data = processData(
        useStaticQuery(graphql`
            query {
                allMdx {
                    edges {
                        node {
                            fields {
                                slug
                            }
                            frontmatter {
                                title
                            }
                        }
                    }
                }
            }
        `)
    );

    const enName = props.name ? props.name.trim().split(' ')[0] : '';
    const locale = intl.locale;
    let lowerCaseEnName = enName.slice(0, 1).toLowerCase() + enName.slice(1);
    let url = '/' + data[props.name.trim()];

    if (lowerCaseEnName === 'icon') {
        lowerCaseEnName = 'icons';
    }

    if (lowerCaseEnName === 'localeProvider') {
        lowerCaseEnName = 'locale';
    }

    // chart在导航栏中的标题并非是组件名称，较特殊，此处单独处理
    if (props.name.trim() === 'VChart 图表') {
        url = '/' + data['Data Visualization 数据可视化'];
    } else if (props.name.trim() === 'VChart') {
        url = '/' + data['Data Visualization'];
    }

    const [inDarkmode, _setInDarkmode] = useState(false);
    const ref = useRef({ inDarkmode: false });
    const setInDarkmode = inDarkmode => {
        _setInDarkmode(inDarkmode);
        ref.current.inDarkmode = inDarkmode;
    };
    let imgUrl = `https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/${
        inDarkmode ? 'components-dark' : 'components'
    }/${enName}.${inDarkmode ? 'png' : 'jpg'}`;
    useEffect(() => {
        const targetNode = document.body;
        const listenerConfig = { attributes: true };
        const callback = () => {
            const mode = targetNode.getAttribute('theme-mode');
            if (mode === 'dark' && !ref.current.inDarkmode) {
                setInDarkmode(true);
            } else if (mode === null && ref.current.inDarkmode) {
                setInDarkmode(false);
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, listenerConfig);
        return () => observer.disconnect();
    }, []);
    return (
        <a 
            href={url} 
            onClickCapture={(e) => {
                e.preventDefault();
            }}
        >
            <div
                onClick={(e) => {
                    navigate(url);
                    e.stopPropagation();
                }}
                className="semi-overview-card"
            >
                <img src={imgUrl} className="semi-overview-card-image" />
                <div className="semi-overview-card-text">{props.name}</div>
            </div>
        </a>
    );
};

export default ComponentCard;
