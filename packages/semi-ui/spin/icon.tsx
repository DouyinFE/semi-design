import React, { useEffect, useState } from 'react';
import isNullOrUndefined from '@douyinfe/semi-foundation/utils/isNullOrUndefined';
import { getUuidShort } from '@douyinfe/semi-foundation/utils/uuid';
import semiGlobal from '../_utils/semi-global';
import { get } from 'lodash';
import cls from 'classnames';

export interface IconProps {
    id?: number;
    component?: React.ReactNode;
    size?: number;
    className?: string;
    type?: string;
    customIconCls?: string;
}

function Icon(props: IconProps = {}) {
    const { id: propsId, className, customIconCls, ...rest } = props;
    const globalIndicator = get(semiGlobal, 'config.overrideDefaultProps.Spin.indicator');
    if (globalIndicator && React.isValidElement(globalIndicator)) {
        return React.cloneElement(globalIndicator, { className: cls({ [customIconCls]: customIconCls, [className]: className }) } as any);
    }

    /**
     * NOTE(SSR / Next.js):
     * We must keep the original SVG implementation based on <linearGradient> + url(#id).
     * However, generating ids via module-level counters or random values during render can
     * cause hydration mismatch (server/client ids differ).
     *
     * Strategy:
     * - On SSR and the client's initial render, use a stable fallback id to keep markup identical.
     * - After mount (client-only), replace it with an instance-unique id to avoid cross-instance
     *   collisions where one Spin could affect another via duplicate ids.
     *
     * If consumers pass `props.id`, we treat it as a stable explicit seed.
    */
    const fallbackId = 'linearGradient-semi-spin';
    const [gradientId, setGradientId] = useState<string>(() => {
        if (!isNullOrUndefined(propsId)) {
            return `linearGradient-${propsId}`;
        }
        return fallbackId;
    });

    useEffect(() => {
        if (!isNullOrUndefined(propsId)) {
            // Explicit id is stable; no need to mutate after mount.
            setGradientId(`linearGradient-${propsId}`);
            return;
        }
        const unique = getUuidShort({ prefix: 'semi-spin-gradient' });
        setGradientId(`linearGradient-${unique}`);
    }, [propsId]);

    return (
        <svg
            {...rest}
            className={className}
            width="48"
            height="48"
            viewBox="0 0 36 36"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            data-icon="spin"
        >
            <defs>
                <linearGradient x1="0%" y1="100%" x2="100%" y2="100%" id={gradientId}>
                    <stop stopColor="currentColor" stopOpacity="0" offset="0%" />
                    <stop stopColor="currentColor" stopOpacity="0.50" offset="39.9430698%" />
                    <stop stopColor="currentColor" offset="100%" />
                </linearGradient>
            </defs>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect fillOpacity="0.01" fill="none" x="0" y="0" width="36" height="36" />
                <path
                    d="M34,18 C34,9.163444 26.836556,2 18,2 C11.6597233,2 6.18078805,5.68784135 3.59122325,11.0354951"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
}

export default Icon;
