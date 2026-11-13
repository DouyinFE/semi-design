import TreeSelect from '../index';

// `TreeSelect.getDerivedStateFromProps` is where the expansion state is derived,
// so the lifecycle can be replayed without rendering: mount with an empty
// `treeData`, then deliver the tree asynchronously. `defaultProps` are merged by
// hand because React only applies them when it calls the method itself.

const DEFAULTS = TreeSelect.defaultProps || {};

const TREE = [
    {
        key: 'folder-a',
        value: 'folder-a',
        label: 'Folder A',
        children: [{ key: 'item-a-1', value: 'item-a-1', label: 'Item A-1' }],
    },
    { key: 'folder-b', value: 'folder-b', label: 'Folder B' },
];

// The tree without the branch holding the selected node, i.e. the state in
// which `item-a-1` cannot be resolved yet.
const PARTIAL_TREE = [{ key: 'folder-b', value: 'folder-b', label: 'Folder B' }];

const DEEP_TREE = [
    {
        key: 'root-a',
        value: 'root-a',
        label: 'Root A',
        children: [
            {
                key: 'folder-a',
                value: 'folder-a',
                label: 'Folder A',
                children: [{ key: 'item-a-1', value: 'item-a-1', label: 'Item A-1' }],
            },
        ],
    },
    { key: 'folder-b', value: 'folder-b', label: 'Folder B' },
];

function makeProps(overrides) {
    return { ...DEFAULTS, ...overrides };
}

// Mirrors the component constructor.
function initialState(props) {
    return {
        inputTriggerFocus: false,
        isOpen: false,
        isFocus: false,
        rePosKey: 'k0',
        dropdownMinWidth: null,
        inputValue: '',
        keyEntities: {},
        treeData: [],
        flattenNodes: [],
        cachedFlattenNodes: undefined,
        selectedKeys: [],
        checkedKeys: new Set(),
        halfCheckedKeys: new Set(),
        realCheckedKeys: new Set([]),
        disabledKeys: new Set(),
        motionKeys: new Set([]),
        motionType: 'hide',
        expandedKeys: new Set(props.expandedKeys),
        filteredKeys: new Set(),
        filteredExpandedKeys: new Set(),
        filteredShownKeys: new Set(),
        prevProps: null,
        isHovering: false,
        cachedKeyValuePairs: {},
        loadedKeys: new Set(),
        loadingKeys: new Set(),
    };
}

// One render pass; React merges the returned object into the state.
function derive(props, state) {
    return { ...state, ...(TreeSelect.getDerivedStateFromProps(props, state) || {}) };
}

function mount(overrides) {
    const props = makeProps(overrides);
    return derive(props, initialState(props));
}

function update(prevState, overrides) {
    return derive(makeProps(overrides), prevState);
}

const keysOf = set => [...(set || [])];
const flattenKeys = state => (state.flattenNodes || []).map(node => node.key);

describe('TreeSelect async treeData expansion', () => {
    const base = { value: 'item-a-1' };

    it('expands the ancestors of the selected value once treeData arrives', () => {
        const mounted = mount({ ...base, treeData: [] });
        const loaded = update(mounted, { ...base, treeData: TREE });

        expect(keysOf(mounted.expandedKeys)).toEqual([]);
        expect(keysOf(loaded.expandedKeys)).toContain('folder-a');
    });

    it('makes the selected node visible in the flattened list', () => {
        const mounted = mount({ ...base, treeData: [] });
        const loaded = update(mounted, { ...base, treeData: TREE });

        expect(flattenKeys(loaded)).toContain('folder-a');
        expect(flattenKeys(loaded)).toContain('item-a-1');
    });

    it('expands every ancestor, not only the direct parent', () => {
        const mounted = mount({ ...base, treeData: [] });
        const loaded = update(mounted, { ...base, treeData: DEEP_TREE });

        expect(keysOf(loaded.expandedKeys).sort()).toEqual(['folder-a', 'root-a']);
        expect(flattenKeys(loaded)).toContain('item-a-1');
    });

    it('expands an uncontrolled defaultValue once the data arrives', () => {
        const mounted = mount({ defaultValue: 'item-a-1', treeData: [] });
        const loaded = update(mounted, { defaultValue: 'item-a-1', treeData: TREE });

        expect(keysOf(loaded.expandedKeys)).toContain('folder-a');
    });

    it('expands the ancestors of every selected value in multiple mode', () => {
        const multiple = { multiple: true, value: ['item-a-1', 'folder-b'] };
        const mounted = mount({ ...multiple, treeData: [] });
        const loaded = update(mounted, { ...multiple, treeData: TREE });

        expect(keysOf(loaded.expandedKeys)).toContain('folder-a');
    });

    it('leaves expandedKeys untouched when nothing is selected', () => {
        const mounted = mount({ treeData: [] });
        const loaded = update(mounted, { treeData: TREE });

        expect(keysOf(loaded.expandedKeys)).toEqual([]);
    });

    it('never modifies a controlled expandedKeys prop', () => {
        const controlled = { ...base, expandedKeys: ['folder-b'] };
        const mounted = mount({ ...controlled, treeData: [] });
        const loaded = update(mounted, { ...controlled, treeData: TREE });

        expect(keysOf(loaded.expandedKeys)).toEqual(['folder-b']);
    });

    it('keeps expandAll expanding the whole tree', () => {
        const expandAll = { ...base, expandAll: true };
        const mounted = mount({ ...expandAll, treeData: [] });
        const loaded = update(mounted, { ...expandAll, treeData: TREE });

        expect(keysOf(loaded.expandedKeys).sort()).toEqual(['folder-a', 'folder-b', 'item-a-1']);
    });

    it('keeps an expansion made before the selected value resolves', () => {
        const mounted = mount({ ...base, treeData: PARTIAL_TREE });
        const userExpanded = { ...mounted, expandedKeys: new Set(['folder-b']) };
        const loaded = update(userExpanded, { ...base, treeData: TREE });

        expect(keysOf(loaded.expandedKeys)).toContain('folder-b');
    });

    it('does not re-expand a node the user collapsed when treeData updates', () => {
        const mounted = mount({ ...base, treeData: [] });
        const loaded = update(mounted, { ...base, treeData: TREE });
        const collapsed = { ...loaded, expandedKeys: new Set() };
        const refreshed = update(collapsed, {
            ...base,
            treeData: [...TREE, { key: 'folder-c', value: 'folder-c', label: 'Folder C' }],
        });

        expect(keysOf(refreshed.expandedKeys)).toEqual([]);
    });

    it('does not run while the search input owns expandedKeys', () => {
        const searching = { ...base, filterTreeNode: true, showFilteredOnly: true };
        const mounted = mount({ ...searching, treeData: [] });
        const withInput = { ...mounted, inputValue: 'item' };
        const loaded = update(withInput, { ...searching, treeData: TREE });

        expect(keysOf(loaded.expandedKeys)).toEqual([]);
    });
});
