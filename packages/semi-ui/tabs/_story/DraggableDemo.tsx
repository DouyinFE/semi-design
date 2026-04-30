import React, { useState } from 'react';
import Tabs from '../index';
import TabPane from '../TabPane';
import TabItem from '../TabItem';
import { TabBarProps } from '../interface';
import { cssClasses } from '@douyinfe/semi-foundation/tabs/constants';

/**
 * Draggable Tabs Demo using @dnd-kit
 * 
 * This demo shows how to implement drag-and-drop tab reordering
 * using the renderTabBar API with @dnd-kit library.
 * 
 * Required dependencies:
 * - @dnd-kit/core
 * - @dnd-kit/sortable
 * - @dnd-kit/utilities
 * 
 * Install: npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
 */

// Uncomment the imports below to run this demo
// import {
//     DndContext,
//     closestCenter,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors,
//     DragEndEvent,
// } from '@dnd-kit/core';
// import {
//     arrayMove,
//     SortableContext,
//     sortableKeyboardCoordinates,
//     horizontalListSortingStrategy,
//     useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

/**
 * SortableTabItem - A wrapper component that makes TabItem draggable
 * 
 * This component wraps the default TabItem with dnd-kit's sortable functionality.
 * It applies the necessary props and styles for drag-and-drop behavior.
 */
interface SortableTabItemProps {
    id: string;
    tab?: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
    selected?: boolean;
    size?: 'small' | 'medium' | 'large';
    type?: 'line' | 'card' | 'button' | 'slash';
    tabPosition?: 'top' | 'left';
    closable?: boolean;
    onClick?: (itemKey: string, e: React.MouseEvent) => void;
    handleKeyDown?: (e: React.KeyboardEvent, itemKey: string, closable: boolean) => void;
    deleteTabItem?: (tabKey: string, e: React.MouseEvent) => void;
}

/**
 * Implementation with @dnd-kit:
 * 
 * const SortableTabItem: React.FC<SortableTabItemProps> = (props) => {
 *     const {
 *         attributes,
 *         listeners,
 *         setNodeRef,
 *         transform,
 *         transition,
 *         isDragging,
 *     } = useSortable({ 
 *         id: props.id, 
 *         disabled: props.disabled 
 *     });
 *
 *     const style: React.CSSProperties = {
 *         transform: CSS.Transform.toString(transform),
 *         transition,
 *         opacity: isDragging ? 0.5 : 1,
 *         cursor: props.disabled ? 'not-allowed' : 'grab',
 *         zIndex: isDragging ? 1 : 0,
 *         display: 'inline-block',
 *     };
 *
 *     return (
 *         <div 
 *             ref={setNodeRef} 
 *             style={style} 
 *             {...attributes} 
 *             {...listeners}
 *         >
 *             <TabItem 
 *                 {...props} 
 *                 itemKey={props.id}
 *             />
 *         </div>
 *     );
 * };
 */

/**
 * DraggableTabBar - Custom TabBar with drag-and-drop support
 * 
 * This component creates a custom TabBar that integrates with dnd-kit
 * for drag-and-drop functionality.
 */
interface DraggableTabBarProps extends TabBarProps {
    onDragEnd: (event: any) => void;
    sensors: any;
}

/**
 * Implementation:
 * 
 * const DraggableTabBar: React.FC<DraggableTabBarProps> = ({
 *     list,
 *     activeKey,
 *     size,
 *     type,
 *     tabPosition,
 *     collapsible,
 *     onTabClick,
 *     onDragEnd,
 *     sensors,
 *     style,
 *     className,
 *     ...restProps
 * }) => {
 *     const classNames = className ? `${cssClasses.TABS_BAR} ${className}` : cssClasses.TABS_BAR;
 *
 *     return (
 *         <DndContext
 *             sensors={sensors}
 *             collisionDetection={closestCenter}
 *             onDragEnd={onDragEnd}
 *         >
 *             <SortableContext
 *                 items={list.map(item => item.itemKey)}
 *                 strategy={horizontalListSortingStrategy}
 *             >
 *                 <div 
 *                     className={classNames} 
 *                     role="tablist" 
 *                     aria-orientation={tabPosition === "left" ? "vertical" : "horizontal"}
 *                     style={style}
 *                 >
 *                     {list.map((item) => (
 *                         <SortableTabItem
 *                             key={item.itemKey}
 *                             id={item.itemKey}
 *                             tab={item.tab}
 *                             icon={item.icon}
 *                             disabled={item.disabled}
 *                             closable={item.closable}
 *                             selected={activeKey === item.itemKey}
 *                             size={size}
 *                             type={type}
 *                             tabPosition={tabPosition}
 *                             onClick={onTabClick}
 *                         />
 *                     ))}
 *                 </div>
 *             </SortableContext>
 *         </DndContext>
 *     );
 * };
 */

/**
 * Complete Usage Example:
 * 
 * function DraggableTabsDemo() {
 *     const [activeKey, setActiveKey] = useState('1');
 *     const [items, setItems] = useState([
 *         { itemKey: '1', tab: 'Tab 1', content: 'Content 1' },
 *         { itemKey: '2', tab: 'Tab 2', content: 'Content 2' },
 *         { itemKey: '3', tab: 'Tab 3', content: 'Content 3' },
 *     ]);
 *
 *     const sensors = useSensors(
 *         useSensor(PointerSensor, {
 *             activationConstraint: { distance: 5 },
 *         }),
 *         useSensor(KeyboardSensor, {
 *             coordinateGetter: sortableKeyboardCoordinates,
 *         })
 *     );
 *
 *     const handleDragEnd = (event: DragEndEvent) => {
 *         const { active, over } = event;
 *         if (over && active.id !== over.id) {
 *             setItems((items) => {
 *                 const oldIndex = items.findIndex((i) => i.itemKey === active.id);
 *                 const newIndex = items.findIndex((i) => i.itemKey === over.id);
 *                 return arrayMove(items, oldIndex, newIndex);
 *             });
 *         }
 *     };
 *
 *     const renderTabBar: Tabs['renderTabBar'] = (tabBarProps) => {
 *         return (
 *             <DraggableTabBar
 *                 {...tabBarProps}
 *                 sensors={sensors}
 *                 onDragEnd={handleDragEnd}
 *             />
 *         );
 *     };
 *
 *     return (
 *         <Tabs
 *             activeKey={activeKey}
 *             onChange={setActiveKey}
 *             renderTabBar={renderTabBar}
 *             type="card"
 *         >
 *             {items.map((item) => (
 *                 <TabPane 
 *                     key={item.itemKey} 
 *                     tab={item.tab} 
 *                     itemKey={item.itemKey}
 *                 >
 *                     {item.content}
 *                 </TabPane>
 *             ))}
 *         </Tabs>
 *     );
 * }
 */

/**
 * Simple Demo showing the concept
 */
const DraggableDemo = () => {
    const [activeKey, setActiveKey] = useState('1');
    const [items] = useState([
        { itemKey: '1', tab: '文档', content: '文档内容' },
        { itemKey: '2', tab: '表格', content: '表格内容' },
        { itemKey: '3', tab: '幻灯片', content: '幻灯片内容' },
        { itemKey: '4', tab: '表单', content: '表单内容' },
    ]);

    return (
        <div>
            <h3>拖拽排序 Tabs 示例</h3>
            <p>
                使用 <code>renderTabBar</code> API 配合 <code>@dnd-kit</code> 可以实现拖拽排序功能。
            </p>
            
            <h4>实现步骤：</h4>
            <ol>
                <li>安装 dnd-kit: <code>npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities</code></li>
                <li>创建 <code>SortableTabItem</code> 组件包装 TabItem</li>
                <li>创建自定义 TabBar 集成 DndContext 和 SortableContext</li>
                <li>使用 <code>renderTabBar</code> 返回自定义 TabBar</li>
                <li>处理 <code>onDragEnd</code> 更新 tab 顺序</li>
            </ol>

            <h4>参考上方代码注释中的完整实现</h4>
            
            <div style={{ marginTop: 16 }}>
                <h5>普通 Tabs（用于对比）:</h5>
                <Tabs
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    type="card"
                >
                    {items.map((item) => (
                        <TabPane key={item.itemKey} tab={item.tab} itemKey={item.itemKey}>
                            <div style={{ padding: 20 }}>{item.content}</div>
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        </div>
    );
};

export default DraggableDemo;
