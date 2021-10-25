import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
// import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import withPropsCombinations from 'react-storybook-addon-props-combinations';

import 'normalize.css';
import { Button } from '../../index';
import Pagination from '../index';

const stories = storiesOf('Pagination', module);

// stories.addDecorator(withKnobs);;

stories.add('Pagination small', () => (
    <Pagination total={90} size="small"></Pagination>
));

stories.add('Pagination default', () => (
    <div>
        <Pagination total={1}></Pagination>
        <Pagination total={0}></Pagination>
        <Pagination total={9}></Pagination>
        <Pagination total={30}></Pagination>
        <Pagination total={80}></Pagination>
        <Pagination total={200}></Pagination>
        <Pagination total={80} pageSize={30}></Pagination>
        <Pagination total={1000000000} ></Pagination>
    </div>
));

stories.add('Pagination hideOnSinglePage', () => (
    <div>
        <Pagination total={1} hideOnSinglePage></Pagination>
        <Pagination total={0} hideOnSinglePage></Pagination>
        <Pagination total={9} hideOnSinglePage></Pagination>
        <Pagination total={30} hideOnSinglePage></Pagination>
    </div>
));

stories.add('Pagination 指定当前页', () => (
    <div>
        <Pagination total={20000} defaultCurrentPage={2}></Pagination>
    </div>
));

const ControlPage = () => {
    const [page, setPage] = useState(3);
    function onPageChange(currentPage) {
        setPage(currentPage);
    }
    return (
        <div>
            <Pagination total={200} currentPage={page} onPageChange={onPageChange}></Pagination>
        </div>
    );
};
stories.add('Pagination 页码受控', () => <ControlPage />);

stories.add('Pagination showPageSizeChanger', () => (
    <div>
        <Pagination total={100} showSizeChanger showTotal></Pagination>
        <Pagination total={200}></Pagination>
        <Pagination total={300}
            showSizeChanger
            pageSizeOpts={[10, 20, 50, 200]}
            onPageChange={(page, pageSize)=>console.log(`pageChange:${page},pageSize:${pageSize}`)}
            onPageSizeChange={pageSize=>console.log(`pageSizeChange${pageSize}`)}
        >
        </Pagination>
        <Pagination total={300} showSizeChanger></Pagination>
    </div>
));

stories.add('Pagination pageSizeOpts', () => (
    <div>
        <Pagination total={80} showSizeChanger></Pagination>
        <Pagination total={200}></Pagination>
        
        <Pagination total={300} showSizeChanger pageSizeOpts={[50, 80, 90, 200]}></Pagination>
    </div>
));

stories.add('Pagination showQuickJumper', () => (
    <div>
        <Pagination total={1} showSizeChanger showQuickJumper></Pagination>
        <Pagination total={80} showSizeChanger showQuickJumper></Pagination>
        <Pagination total={200} showQuickJumper></Pagination>
        <Pagination total={300} showSizeChanger pageSizeOpts={[50, 80, 90, 200]} showQuickJumper></Pagination>
    </div>
));



const DynamicPageSize = () => {
    const [pageSize, setPageSize] = useState(10); 
    function changePageSize() {
        let map = {
            10: 40,
            40: 100,
            100: 20,
            100: 10
        }
        setPageSize(map[pageSize]);
    }
    return (
        <>
        <Pagination
            total={200}
            showSizeChanger
            pageSize={pageSize}
         >
        </Pagination>
        <br/>
        <Button onClick={changePageSize}>change</Button>
        </>
    );
};

stories.add('Pagination dynamic update pageSize', () => <DynamicPageSize />);

// stories.add('combination', withPropsCombinations(
//     Button,
//     {
//         disaled: [false, true],
//         children: ['hello button'],
//         size: ['large', 'default', 'small'],
//         type: ['default', 'primary', 'warning', 'danger'],
//         // block: [false, true],
//         ghost: [false, true]
//     }
// ));
