import React, { forwardRef } from "react";
import { IconClose } from "@douyinfe/semi-icons";
import { cssClasses } from "@douyinfe/semi-foundation/image/constants";
import cls from "classnames";
import { HeaderProps } from "./interface";
import { PreviewContext } from "./previewContext";

const prefixCls = `${cssClasses.PREFIX}-preview-header`;

const Header = forwardRef(({ onClose, titleStyle, className, renderHeader, closable }: HeaderProps, ref: React.LegacyRef<HTMLElement>) => (
    <PreviewContext.Consumer>
        {({ currentIndex, titles }) => {
            let title;
            if (titles && typeof currentIndex === "number") {
                title = titles[currentIndex];
            }
            return (
                <section ref={ref} className={cls(prefixCls, className)}>
                    <section className={`${prefixCls}-title`} style={titleStyle}>{renderHeader ? renderHeader(title) : title}</section>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    {closable && <section className={`${prefixCls}-close`} onMouseUp={onClose}>
                        <IconClose />
                    </section>}
                </section>
            );
        }}
    </PreviewContext.Consumer>
));

export default Header;
