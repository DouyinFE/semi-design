
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { handlePrevent, isPrintableCharacter, findIndexByCharacter, getAncestorNodeByRole, getMenuButton, setFocusToFirstItem, setFocusToItem, setFocusToNextMenuitem, setFocusToPreviousMenuItem } from '../utils/a11y';


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

    handleEscape(menu: Element): void {
        const trigger = this._adapter.getContext('trigger');
        if (trigger === 'custom'){
            const menuButton = menu && getMenuButton(document.querySelectorAll(`[data-popupid]`), menu.id); 
            menuButton.focus();
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
        
        if (!this.menuItemNodes){
            this.menuItemNodes = [...(event.target.parentNode).getElementsByTagName('li')].filter(item => item.ariaDisabled !== "true");
        }

        if (this.firstChars.length === 0){
            this.menuItemNodes.forEach((item: Element) => {
                // the menuItemNodes can be an component and not exit textContent
                this.firstChars.push(item.textContent.trim()[0]?.toLowerCase());
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
                this.handleEscape(menu);
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
                    // it can be an input on Dropdown, handlePrevent may affect the input of the component
                    // handlePrevent(event); 
                }
                break;
        }
    }
}