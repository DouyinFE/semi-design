
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { handlePrevent, isPrintableCharacter, findIndexByCharacter, getAncestorNodeByRole, getMenuButton, setFocusToFirstItem, setFocusToItem, setFocusToNextMenuitem, setFocusToPreviousMenuItem } from '@douyinfe/semi-foundation/utils/a11y';


export default class DropdownMenuFoundation extends BaseFoundation<Partial<DefaultAdapter>> {
    menuItemNodes: HTMLElement[] = null;
    firstChars: string[] = [];

    // if trigger is click, auto focus to the first menu item
    autoFocus(ulElement: any): void {
        const trigger = this._adapter.getContext('trigger');
        if (trigger === 'click'){
            // find all non-disabled li under this menu and set focus to the first menu
            this.menuItemNodes = [...ulElement.getElementsByTagName('li')].filter(item => item.ariaDisabled !== "true");
            setFocusToFirstItem(this.menuItemNodes);
        }
    }

    setFocusByFirstCharacter(curItem: any, char: string): void {
        const index = findIndexByCharacter(this.menuItemNodes, curItem, this.firstChars, char);
        
        if (index >= 0) {
            setFocusToItem(this.menuItemNodes, this.menuItemNodes[index]);
        }
    }

    onMenuKeydown(event: any): void {
        const menu = getAncestorNodeByRole(event.target, 'tooltip');
        const menuButton = menu && getMenuButton(document.querySelectorAll(`[data-trigger]`), menu.id);
        
        if (!this.menuItemNodes){
            this.menuItemNodes = [...(event.target.parentNode).getElementsByTagName('li')].filter(item => item.ariaDisabled !== "true");
        }

        if (this.firstChars.length === 0){
            this.menuItemNodes.forEach((item: Element) => {
                this.firstChars.push(item.textContent.trim()[0].toLowerCase());
            });
        }

        // get the currently focused menu item
        const curItem = this.menuItemNodes.find(item => item.tabIndex === 0);
        
        switch (event.key) {
            case ' ':
            case 'Enter':
                event.target.click();
                handlePrevent(event);
                break;
            case 'Escape':
                // todo: if there can use the function onEscKeyDown in tooltip, do not need to get menuButton
                menuButton.focus();
                break;
            case 'ArrowUp':
                setFocusToPreviousMenuItem(this.menuItemNodes, curItem);
                handlePrevent(event);
                break;
            case 'ArrowDown':
                setFocusToNextMenuitem(this.menuItemNodes, curItem);
                handlePrevent(event);
                break;
            default:
                if (isPrintableCharacter(event.key)) {
                    this.setFocusByFirstCharacter(curItem, event.key);
                    handlePrevent(event);
                }
                break;
        }
    }
}