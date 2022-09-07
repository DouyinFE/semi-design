import BaseFoundation, { DefaultAdapter } from "../base/foundation";

export default class PreviewFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<Partial<DefaultAdapter>> {
    
    handleVisibleChange = (newVisible : boolean) => {
        const { onVisibleChange } = this.getProps();
        onVisibleChange && onVisibleChange(newVisible);
    };

    handleSwitch = (index: number) => {
        const { onChange } = this.getProp("preview");
        onChange && onChange(index);
        this.setState({
            currentIndex: index,
        } as any);
    };
    
}