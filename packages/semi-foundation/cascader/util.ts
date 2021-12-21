import {
    isNull,
    isUndefined,
    isEqual
} from 'lodash';
import { strings } from './constants';

function getPosition(level: any, index: any) {
    return `${level}-${index}`;
}

export function isValid(val: any) {
    return !isNull(val) && !isUndefined(val);
}

export function normalizedArr(val: any) {
    if (!Array.isArray(val)) {
        return [val];
    } else {
        return val;
    }
}

/**
 * Traverse all the data by `treeData`.
 */
function traverseDataNodes(treeNodes: any, callback: any) {
    const processNode = (node: any, ind?: any, parent?: any) => {
        const children = node ? node.children : treeNodes;
        let item: any = null;
        // Process node if is not root
        if (node) {
            const key = parent ? getPosition(parent.key, ind) : `${ind}`;
            item = {
                data: { ...node },
                ind,
                key,
                level: parent ? parent.level + 1 : 0,
                parentKey: parent ? parent.key : null,
                path: parent ? [...parent.path, key] : [key],
                valuePath: parent ? [...parent.valuePath, node.value] : [node.value]
            };

            callback(item);
        }

        // Process children node
        if (children) {
            children.forEach((subNode: any, subIndex: any) => {
                processNode(subNode, subIndex, item);
            });
        }
    };

    processNode(null);
}

export function convertDataToEntities(dataNodes: any) {
    const keyEntities: any = {};

    traverseDataNodes(dataNodes, (data: any) => {
        const { key, parentKey } = data;
        const entity = { ...data };

        keyEntities[key] = entity;

        // Fill children
        entity.parent = keyEntities[parentKey];
        if (entity.parent) {
            entity.parent.children = entity.parent.children || [];
            entity.parent.children.push(entity);
        }
    });
    return keyEntities;
}

export function findKeysForValues(value: any, keyEntities: any) {
    const valuePath = normalizedArr(value);
    const res = Object.values(keyEntities)
        .filter((item: any) => isEqual(item.valuePath, valuePath))
        .map((item: any) => item.key);
    return res;
}

export function calcMergeType(autoMergeValue: boolean, leafOnly: boolean): string {
    let mergeType: string;
    if (leafOnly) {
        mergeType = strings.LEAF_ONLY_MERGE_TYPE;
    } else if (autoMergeValue) {
        mergeType = strings.AUTO_MERGE_VALUE_MERGE_TYPE;
    } else {
        mergeType = strings.NONE_MERGE_TYPE;
    }
    return mergeType;
}