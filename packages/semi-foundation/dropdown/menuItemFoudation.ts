
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { handlePrevent, isPrintableCharacter, getAncestorNodeByRole, getMenuButton, findIndexByCharacter, setFocusToItem, setFocusToNextMenuitem, setFocusToPreviousMenuItem } from '@douyinfe/semi-foundation/utils/a11y';


export default class DropdownMenuItemFoundation extends BaseFoundation<Partial<DefaultAdapter>> {
    menuItemNodes: HTMLElement[] = null;
    menuButton: HTMLElement = null;
    firstChars: string[] = [];

    setFocusByFirstCharacter(curItem: any, char: string): void {
        const index = findIndexByCharacter(this.menuItemNodes, curItem, this.firstChars, char);
        
        if (index >= 0) {
            setFocusToItem(this.menuItemNodes, this.menuItemNodes[index]);
        }
    }

    onMenuItemKeydown(event: any): void {
        if (!this.menuButton){
            const menu = getAncestorNodeByRole(event.target, 'tooltip');
            this.menuButton = getMenuButton(document.querySelectorAll(`[data-trigger]`), menu.id);
            this.menuItemNodes = [...(event.target.parentNode).getElementsByTagName('li')].filter(item => item.ariaDisabled !== "true");
        }

        if (this.firstChars.length === 0){
            this.menuItemNodes.forEach((item: Element) => {
                this.firstChars.push(item.textContent.trim()[0].toLowerCase());
            });
        }
        
        switch (event.key) {
            case ' ':
            case 'Enter':
                event.target.click();
                handlePrevent(event);
                break;
            case 'Escape':
                this.menuButton.focus();
                break;
            case 'ArrowUp':
                setFocusToPreviousMenuItem(this.menuItemNodes, event.target);
                handlePrevent(event);
                break;
            case 'ArrowDown':
                setFocusToNextMenuitem(this.menuItemNodes, event.target);
                handlePrevent(event);
                break;
            default:
                if (isPrintableCharacter(event.key)) {
                    this.setFocusByFirstCharacter(event.target, event.key);
                    handlePrevent(event);
                }
                break;
        }
    }

}