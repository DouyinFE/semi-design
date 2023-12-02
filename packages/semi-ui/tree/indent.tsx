import * as React from 'react';
import classNames from 'classnames';

interface IndentProps {
    prefixcls: string;
    level: number;
    isStart: boolean[];
    isEnd: boolean[];
    showLine: boolean
}

const Indent = ({ prefixcls, level, isStart, isEnd, showLine }: IndentProps) => {
    console.log(showLine, 'showLine');
    const baseClassName = `${prefixcls}-indent-unit`;
    const list: React.ReactElement[] = [];
    for (let i = 0; i < level; i += 1) {
        list.push(
            <span
                key={i}
                className={classNames(baseClassName, {
                    [`${baseClassName}-start`]: isStart[i],
                    [`${baseClassName}-end`]: isEnd[i],
                })}
            />,
        );
    }

    return (
        <span aria-hidden="true" className={
            classNames(`${prefixcls}-indent`, {
                [`${prefixcls}-indent-show-line`]: showLine,
            })
        }>
            {list}
        </span>
    );
};

export default React.memo(Indent);
