import React from 'react';
import { Dropdown, Button } from '../../index';
import cls from 'classnames';
import { cssClasses } from '@douyinfe/semi-foundation/aiChatInput/constants';

// Todo: Mcp list 部分的显示，未来可能需要考虑是否支持自定义，因为可能存在分组，或者嵌套 dropdown 的形式
// Todo: The display of the Mcp list part may need to be considered in the future to support customization, 
// because there may be grouping or nested dropdown forms.
const Mcp = (props: any) => {
    const { className, style, options = [], num = 0, children, onConfigureButtonClick, ...rest } = props;

    return (<Dropdown
        style={style}
        className={cls({
            [className]: className,
            [`${cssClasses.PREFIX}-footer-configure-mcp`]: true,
        })}
        {...rest}
        render={<>
            <div className={`${cssClasses.PREFIX}-footer-configure-mcp-header`}>
                <span className={`${cssClasses.PREFIX}-footer-configure-mcp-header-title`} >
                    {/* Todo: locale */}
                    已选 {options.length ?? num} 个
                </span>
                <button 
                    className={`${cssClasses.PREFIX}-footer-configure-mcp-header-config`}
                    onClick={onConfigureButtonClick}
                >
                    {/* Todo: locale */}
                    配置
                </button>
            </div>
            {children ? children : <>
                <Dropdown.Menu>
                    {options.map((item: any) => (
                        <Dropdown.Item key={item.value} icon={item.icon}>{item.label}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </>}
        </>}
    >
        <Button
            theme='outline'
            type='tertiary'
            className={`${cssClasses.PREFIX}-footer-configure-mcp-trigger`}
        >
            MCP · {options.length ?? num}
        </Button>
    </Dropdown>);
};

export default Mcp;