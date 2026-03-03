import type { MCPOption } from './mcpCofContentFoundation';

export function getFilterResult(
    inputValue: string, 
    options: MCPOption[] = [], 
    customFilter?: (value: string, option: MCPOption) => boolean
) {
    const lowCaseInputValue = inputValue.toLowerCase();
    const filteredOptions = options.filter(option => {
        if (typeof customFilter === 'function') {
            return customFilter(lowCaseInputValue, option);
        } else {
            return baseFilter(lowCaseInputValue, option);
        }
    });
    return filteredOptions;
}

export function baseFilter(value: string, option: MCPOption) {
    const labelText = typeof option.label === 'string' ? option.label : '';
    if (labelText.toLowerCase().includes(value)) {
        return true;
    }
    const descText = typeof option.desc === 'string' ? option.desc : '';
    return descText.toLowerCase().includes(value);
}
