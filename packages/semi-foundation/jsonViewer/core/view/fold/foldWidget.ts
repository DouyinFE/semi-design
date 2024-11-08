import { elt, setStyles } from '../../common/dom';
import { View } from '../view';
import { FoldingModel } from '../../model/foldingModel';

export class FoldWidget {
    private _view: View;
    private _foldingModel: FoldingModel;

    constructor(view: View, foldingModel: FoldingModel) {
        this._view = view;
        this._foldingModel = foldingModel;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this._view.lineScrollDom.addEventListener('mouseover', e => {
            this.handleLineNumberHover(e);
        });
        this._view.lineScrollDom.addEventListener('mouseleave', () => {
            this.handleLineNumberContainerLeave();
        });
    }

    handleLineNumberHover(e: MouseEvent) {
        this.showFoldingIcon();
    }

    private handleLineNumberContainerLeave() {
        this.removeAllFoldingIcons();
    }

    showFoldingIcon() {
        const lineNumberElement = this._view.lineScrollDom.children;
        for (let i = 0; i < lineNumberElement.length; i++) {
            const element: HTMLElement = lineNumberElement[i] as HTMLElement;
            if (this._foldingModel.isFoldable(Number(element.dataset.lineNumber))) {
                element.appendChild(this.createFoldingIcon(Number(element.dataset.lineNumber)));
            }
        }
    }

    createFoldingIcon(lineNumber: number): HTMLElement {
        const foldingIcon = elt('span', 'folding-icon');
        const isCollapsed = this._foldingModel.isCollapsed(lineNumber);
        foldingIcon.textContent = isCollapsed ? '▶' : '▼';
        setStyles(foldingIcon, {
            position: 'absolute',
            right: '0',
            top: '0',
            width: '40%',
            height: '100%',
            cursor: 'pointer',
            zIndex: '1',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        });

        foldingIcon.addEventListener('mousedown', e => {
            e.preventDefault(); // 防止文本选择
            e.stopPropagation();
            this._foldingModel.toggleFoldingRange(lineNumber);
            this._view.scalingCellSizeAndPositionManager.resetCell(0);
            this._view.layout();
        });

        return foldingIcon;
    }

    removeAllFoldingIcons() {
        const foldingIcons = this._view.lineScrollDom.querySelectorAll('.folding-icon');
        foldingIcons.forEach(icon => icon.remove());
    }
}
