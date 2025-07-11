import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/aiLoading/constants';
import '@douyinfe/semi-foundation/aiLoading/aiLoading.scss';

const prefixcls = cssClasses.PREFIX;

const Loading = ({ type = 'small', title, description, iconUrl, className }) => {
    if (!strings.TYPE_SET.includes(type)) {
        // 容错处理，默认用small
        type = 'small';
    }
    return (
        <div className={cls(prefixcls, className, `${prefixcls}-${type}`)}>
            {type === 'small' && (
                <>
                    <div className={`${prefixcls}-small-dots`}>
                        <span className={cls(`${prefixcls}-small-dots-dot`, `${prefixcls}-small-dots-dot-1`)} />
                        <span className={cls(`${prefixcls}-small-dots-dot`, `${prefixcls}-small-dots-dot-2`)} />
                        <span className={cls(`${prefixcls}-small-dots-dot`, `${prefixcls}-small-dots-dot-3`)} />
                    </div>
                    <div className={`${prefixcls}-small-text`}>Thinking...</div>
                </>
            )}
            {type === 'large' && (
                <React.Fragment>
                    <div className={`${prefixcls}-large-dots`}>
                        <span className={cls(`${prefixcls}-large-dots-dot`, `${prefixcls}-large-dots-dot-1`)} />
                        <span className={cls(`${prefixcls}-large-dots-dot`, `${prefixcls}-large-dots-dot-2`)} />
                        <span className={cls(`${prefixcls}-large-dots-dot`, `${prefixcls}-large-dots-dot-3`)} />
                    </div>
                    <div className={`${prefixcls}-large-track`}>
                        <div className={`${prefixcls}-large-track-inner`} />
                    </div>
                    <div className={`${prefixcls}-large-info`}>
                        <span className={`${prefixcls}-large-info-title`}>{title || 'In processing...'}</span>
                        <span className={`${prefixcls}-large-info-desc`}>{description || 'This is the empty description'}</span>
                    </div>
                </React.Fragment>
            )}
            {type === 'colored' && (
                <div className={`${prefixcls}-colored-icon`}>
                    <img
                        src={iconUrl || 'https://cdn-tos-cn.bytedance.net/obj/ies-semi/images/mcvcemsn-iso1lvx.svg'}
                        alt={title || 'loading'}
                        className={cls(`${prefixcls}-colored-icon`)}
                    />
                </div>
            )}
        </div>
    );
};

Loading.propTypes = {
    type: PropTypes.oneOf(strings.TYPE_SET),
    title: PropTypes.string,
    description: PropTypes.string,
    iconUrl: PropTypes.string,
    className: PropTypes.string,
};

export default Loading;
