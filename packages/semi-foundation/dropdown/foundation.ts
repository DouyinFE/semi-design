import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { handlePrevent } from '@douyinfe/semi-foundation/utils/a11y';

export interface DropdownAdapter extends Partial<DefaultAdapter> {
    setPopVisible(visible: boolean): void;
    notifyVisibleChange(visible: boolean): void;
}

export default class DropdownFoundation extends BaseFoundation<DropdownAdapter> {
    handleVisibleChange(visible: boolean) {
        this._adapter.setPopVisible(visible);
        this._adapter.notifyVisibleChange(visible);
    }

    getMenuItemNodes(target: any): NodeListOf<Element> {
        console.log(target);
        const id = target.attributes['aria-describedby'].value;
        const menuWrapper = document.getElementById(id);
        // if has dropdown item, the item must wrapped by li
        return menuWrapper ? menuWrapper.querySelectorAll(`li[aria-disabled="false"]`) : null;
    }

    setFocusToFirstMenuItem(target: any): void {
        const menuItemNodes = this.getMenuItemNodes(target);
        menuItemNodes && menuItemNodes.length !== 0 && (menuItemNodes[0] as HTMLAnchorElement).focus();
    }

    setFocusToLastMenuItem(target: any): void {
        const menuItemNodes = this.getMenuItemNodes(target);
        menuItemNodes && menuItemNodes.length !== 0 && (menuItemNodes[menuItemNodes.length - 1] as HTMLAnchorElement).focus();
    }

    isExpandedMenu(target: any): boolean {
        console.log('target', target);
        if (target && target.attributes['aria-describedby']){
            const menuItemNodes = this.getMenuItemNodes(target);
            return menuItemNodes ? true : false; 
        }
        return false;
    }

    handleKeyDown(event: any): void {
        switch (event.key) {
            case ' ':
            case 'Enter':
                event.target.click();
                handlePrevent(event);
                break;
            case 'ArrowDown':
                this.setFocusToFirstMenuItem(event.target);
                handlePrevent(event);
                break;
            case 'ArrowUp':
                this.setFocusToLastMenuItem(event.target);
                handlePrevent(event);
                break;
            default:
                break;
        }
    }
}
