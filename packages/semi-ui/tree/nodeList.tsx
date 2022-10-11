import React, { PureComponent } from 'react';
import { isEqual } from 'lodash';
import TreeContext from './treeContext';
import { FlattenNode, NodeListProps, NodeListState, TransitionNodes } from './interface';
import Collapsible from '../collapsible';

const getTreeNodeKey = (treeNode: FlattenNode) => {
    const { data } = treeNode;
    const { key } = data;
    return key;
};

export default class NodeList extends PureComponent<NodeListProps, NodeListState> {
    static contextType = TreeContext;

    constructor(props: NodeListProps) {
        super(props);
        this.state = {
            transitionNodes: [],
            isOpen: false
        };
    }

    static getDerivedStateFromProps(props: NodeListProps, prevState: NodeListState) {
        const { flattenNodes = [], motionKeys, motionType, flattenList = [] } = props;
        const hasChanged = !isEqual(prevState.cachedMotionKeys, motionKeys) ||
        !isEqual(prevState.cachedData.map(i => i.key), flattenNodes.map(i => i.key));
        const motionArr = [...motionKeys];
        if (!hasChanged || !motionArr.length) {
            return null;
        }
        const transitionNodes: TransitionNodes<FlattenNode> = [];
        const transitionRange: FlattenNode[] = [];
        let rangeStart = 0;
        let newState = {};
        const lookUpTarget = motionType === 'hide' && flattenList ? flattenList : flattenNodes;
        lookUpTarget.forEach((treeNode, ind) => {
            const nodeKey = getTreeNodeKey(treeNode);
            if (motionKeys.has(nodeKey)) {
                transitionRange.push(treeNode);
                if (nodeKey === motionArr[0]) {
                    rangeStart = ind;
                }
            } else {
                transitionNodes.push(treeNode);
            }
        });
        transitionNodes.splice(rangeStart, 0, transitionRange);
        const isOpen = motionType === 'hide';
        newState = {
            transitionNodes,
            cachedData: flattenNodes,
            cachedMotionKeys: motionKeys,
            cachedMotionType: motionType,
            isOpen
        };
        return newState;
    }

    onMotionEnd = () => {
        typeof this.props.onMotionEnd === 'function' && this.props.onMotionEnd();
        this.setState({ transitionNodes: [] });
    };

    collapsibleRefCb = () => {
        const { motionType } = this.props;
        !isEqual(this.state.isOpen, motionType === 'show') && setTimeout(()=>{
            this.setState({
                isOpen: motionType === 'show',
            });
        }, 0);  
    }

    render() {
        const { flattenNodes, motionType, searchTargetIsDeep, renderTreeNode } = this.props;
        const { transitionNodes, isOpen } = this.state;
        const mapData = transitionNodes.length && !searchTargetIsDeep ? transitionNodes : flattenNodes;
        const options = mapData.map(treeNode => {
            const isMotionNode = Array.isArray(treeNode);
            if (isMotionNode && !(treeNode as FlattenNode[]).length) {
                return null;
            }
            if (isMotionNode && (treeNode as FlattenNode[]).length) {
                const nodeKey = getTreeNodeKey(treeNode[0]);
                return (
                    <Collapsible
                        duration={200}
                        ref={this.collapsibleRefCb}
                        isOpen={isOpen}
                        motion={Boolean(motionType)}
                        key={`motion-${nodeKey}`}
                        onMotionEnd={this.onMotionEnd}
                    >
                        {treeNode.map(node => renderTreeNode(node))}
                    </Collapsible>
                );
            }
            return renderTreeNode(treeNode as FlattenNode);
        });
        return options;
    }
}
