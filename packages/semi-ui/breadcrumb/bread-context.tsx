import React from 'react';
import { showToolTipProps } from './index';
import { BreadcrumbItemInfo } from './item';
export interface BreadContextProps {
    onClick?: (info: BreadcrumbItemInfo, event: React.MouseEvent) => void;
    showTooltip?: boolean | showToolTipProps;
    compact?: boolean;
    separator?: string | React.ReactNode;
}

const BreadContext = React.createContext<BreadContextProps>({});

export default BreadContext;
