
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { getAncestorNodeByRole, getMenuButton, setFocusToFirstItem } from '@douyinfe/semi-foundation/utils/a11y';


export default class DropdownMenuFoundation extends BaseFoundation<Partial<DefaultAdapter>> {
    menuItemNodes = null;

    // if trigger is click, auto focus to the first menu item
    autoFocus(ulElement: any): void {
        const menu = getAncestorNodeByRole(ulElement, 'tooltip');
        // find all non-disabled li under this menu
        this.menuItemNodes = [...ulElement.getElementsByTagName('li')].filter(item => item.ariaDisabled !== "true");
        const menuButton = menu && getMenuButton(document.querySelectorAll(`[data-trigger]`), menu.id);
        
        if (menuButton && this.menuItemNodes.length !== 0){
            const trigger = menuButton.attributes["data-trigger"].value;
            if (trigger === 'click'){
                setFocusToFirstItem(this.menuItemNodes);
            }
        }
    }

}