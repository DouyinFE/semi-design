
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { handlePrevent, isPrintableCharacter, findIndexByCharacter, getAncestorNodeByRole, getMenuButton, setFocusToItem, setFocusToNextMenuitem, setFocusToPreviousMenuItem } from '../utils/a11y';

export default class DropdownMenuFoundation extends BaseFoundation<Partial<DefaultAdapter>> {
    menuItemNodes: HTMLElement[] = null;
    firstChars: string[] = [];

    handleEscape(menu: Element): void {
        const trigger = this._adapter.getContext('trigger');
        if (trigger === 'custom') {
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
        
        // event.target can be an element inside an item, such as an input, so read items from the menu handling the event
        const items: HTMLElement[] = [...event.currentTarget.getElementsByTagName('li')];
        const isEnabled = (item: HTMLElement) => item.getAttribute('aria-disabled') !== 'true';
        this.menuItemNodes = items.filter(isEnabled);
        this.firstChars = this.menuItemNodes.map(item => item.textContent.trim()[0]?.toLowerCase());

        const isItemTarget = items.includes(event.target);
        // get the currently focused menu item, which contains the target when focus is on an element inside an item
        const focusedItem = (!isItemTarget && items.find(item => item.contains(event.target))) || items.find(item => item.tabIndex === 0);
        const curItem = focusedItem && isEnabled(focusedItem) ? focusedItem : undefined;
        // The focused item can become disabled while keeping focus, so arrow keys continue from its DOM position
        const disabledCurIndex = focusedItem && !curItem ? items.indexOf(focusedItem) : -1;

        switch (event.key) {
            case ' ':
            case 'Enter':
                event.target.click();
                // user may use input to be the trigger and bind some key event on it, so do not stoppropagation
                // handlePrevent(event);
                break;
            case 'Escape':
                this.handleEscape(menu);
                break;
            case 'ArrowUp':
                if (disabledCurIndex >= 0) {
                    const before = items.slice(0, disabledCurIndex).filter(isEnabled);
                    setFocusToItem(items, before[before.length - 1] ?? this.menuItemNodes[this.menuItemNodes.length - 1]);
                } else {
                    setFocusToPreviousMenuItem(this.menuItemNodes, curItem);
                }
                handlePrevent(event);
                break;
            case 'ArrowDown':
                if (disabledCurIndex >= 0) {
                    setFocusToItem(items, items.slice(disabledCurIndex + 1).find(isEnabled) ?? this.menuItemNodes[0]);
                } else {
                    setFocusToNextMenuitem(this.menuItemNodes, curItem);
                }
                handlePrevent(event);
                break;
            default:
                // Characters typed into an element inside an item, such as an input, belong to that element
                if (isItemTarget && isPrintableCharacter(event.key)) {
                    this.setFocusByFirstCharacter(curItem, event.key);
                    // it can be an input on Dropdown, handlePrevent may affect the input of the component
                    // handlePrevent(event); 
                }
                break;
        }
    }
}
