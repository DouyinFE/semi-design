import {
    isNull,
    isUndefined,
    isEqual
} from 'lodash';
import { strings, VALUE_SPLIT } from './constants';

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
            const key = parent ? `${parent.key}${VALUE_SPLIT}${node.value}` : node.value;
            const pos = parent ? getPosition(parent.pos, ind) : `${ind}`;
            item = {
                data: { ...node },
                ind,
                key,
                pos,
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

export function getKeysByValuePath(valuePath: (string | number)[][] | (string | number)[]) {
    if (valuePath?.length) {
        if (Array.isArray(valuePath[0])) {
            return valuePath.map((item) => getKeyByValuePath(item));
        } else {
            return [getKeyByValuePath(valuePath as (string | number)[])];
        }
    }
    return [];
}

export function getKeyByValuePath(valuePath: (string | number)[]) {
    return valuePath.join(VALUE_SPLIT);
}

export function getValuePathByKey(key: string) {
    return key.split(VALUE_SPLIT);
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