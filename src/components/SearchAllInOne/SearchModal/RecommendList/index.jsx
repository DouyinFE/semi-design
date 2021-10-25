import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@douyinfe/semi-ui';
import { FormattedMessage } from 'react-intl';
import cls from 'classnames';

const RecommendItem = ({ img, title, url, content, disable = false }) => (
    <a
        className={cls(styles.recommendItem, { [styles['item-disable']]: disable })}
        href={disable ? null : url}
        target={'_blank'}
        rel="noreferrer"
    >
        <div className={styles.imgWrapper}>
            <Icon type={img} size={'extra-large'} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
        <div className={styles.detail}>
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>{content}</div>
        </div>
    </a>
);

export default props => {
    const { recommendItemList } = props;

    return (
        <div>
            <div className={styles.msg}>
                <FormattedMessage id={'search.msg.peopleSearch'} />
            </div>
            <div className={styles.recommendList}>
                {recommendItemList.map(item => <RecommendItem {...item} key={item.url} />)}
            </div>
        </div>
    );
};
