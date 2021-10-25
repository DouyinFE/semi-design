import { Table } from '@douyinfe/semi-ui';
import React from 'react';
import datsJson from './data.json';

class App extends React.Component {
    constructor() {
        super();
        const labels = [
            { text: '范政源测试', value: 1428 },
            { text: '商业化接单候选人', value: 4 },
            { text: '华星MCN签约', value: 6 },
            { text: '抖音', value: 18 },
            { text: '抖音认证特效师', value: 3 },
            { text: '测试boe能解决', value: 1427 },
            { text: 'a哈哈哈哈', value: 1 },
            { text: '测试啊', value: 1406 },
            { text: 'asa', value: 1404 },
            { text: '啊啊啊啊啊啊大 sad但', value: 1401 },
            { text: 'chess', value: 1397 },
            { text: '试试看嗷', value: 1396 },
            { text: '爆款特效师', value: 2 },
            { text: '123456789123', value: 24 },
            { text: '哈哈', value: 23 },
            { text: '匠子空间mcn签约', value: 7 },
        ];
        this.state = {
            data: datsJson,

            columns: [
                {
                    title: 'Name',
                    dataIndex: 'username',
                    filters: [
                        {
                            text: 'Joe',
                            value: 'Joe',
                        },
                        {
                            text: 'Jim',
                            value: 'Jim',
                        },
                    ],
                    filterDropdownProps: {
                        position: 'top',
                        autoAdjustOverflow: false,
                    },
                },
                {
                    title: '标签',
                    dataIndex: 'labelIds',
                    filters: labels,
                    filterMultiple: true,
                    onFilter: (value, record) => {
                        const labelIdsArr = record.labelIds.split(',').map(l => Number(l));
                        console.log('record ==> ', value, labelIdsArr, labelIdsArr.includes(value));
                        return labelIdsArr.includes(value);
                    },
                    render: (text, record) => (
                        <span>
                            {record.labels.map((l, i) => `${l.name} ${record.labels.length - 1 !== i ? ' / ' : ''}`)}
                        </span>
                    ),
                },
            ],
        };

        this.onChange = ({ filters }) => {
            console.log(filters);

            // this.setState({ data: [{ name: '1' }] });
        };
    }

    render() {
        return (
            <Table rowKey={'id'} columns={this.state.columns} dataSource={this.state.data} onChange={this.onChange} />
        );
    }
}

export default App;
