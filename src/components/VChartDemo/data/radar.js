export default {
    title: 'Radar Chart',
    titleZh: "雷达图",
    spec: {
        type: 'radar',
        data: [
            {
                values: [
                    {
                        month: 'Jan.',
                        value: 45,
                        type: 'A'
                    },
                    {
                        month: 'Feb.',
                        value: 61,
                        type: 'A'
                    },
                    {
                        month: 'Mar.',
                        value: 92,
                        type: 'A'
                    },
                    {
                        month: 'Apr.',
                        value: 57,
                        type: 'A'
                    },
                    {
                        month: 'May.',
                        value: 46,
                        type: 'A'
                    },
                    {
                        month: 'Jun.',
                        value: 36,
                        type: 'A'
                    },
                    {
                        month: 'Jul.',
                        value: 33,
                        type: 'A'
                    },
                    {
                        month: 'Aug.',
                        value: 63,
                        type: 'A'
                    },
                    {
                        month: 'Sep.',
                        value: 57,
                        type: 'A'
                    },
                    {
                        month: 'Oct.',
                        value: 53,
                        type: 'A'
                    },
                    {
                        month: 'Nov.',
                        value: 69,
                        type: 'A'
                    },
                    {
                        month: 'Dec.',
                        value: 40,
                        type: 'A'
                    },
                    {
                        month: 'Jan.',
                        value: 31,
                        type: 'B'
                    },
                    {
                        month: 'Feb.',
                        value: 39,
                        type: 'B'
                    },
                    {
                        month: 'Mar.',
                        value: 81,
                        type: 'B'
                    },
                    {
                        month: 'Apr.',
                        value: 39,
                        type: 'B'
                    },
                    {
                        month: 'May.',
                        value: 64,
                        type: 'B'
                    },
                    {
                        month: 'Jun.',
                        value: 21,
                        type: 'B'
                    },
                    {
                        month: 'Jul.',
                        value: 58,
                        type: 'B'
                    },
                    {
                        month: 'Aug.',
                        value: 72,
                        type: 'B'
                    },
                    {
                        month: 'Sep.',
                        value: 47,
                        type: 'B'
                    },
                    {
                        month: 'Oct.',
                        value: 37,
                        type: 'B'
                    },
                    {
                        month: 'Nov.',
                        value: 80,
                        type: 'B'
                    },
                    {
                        month: 'Dec.',
                        value: 74,
                        type: 'B'
                    },
                    {
                        month: 'Jan.',
                        value: 90,
                        type: 'C'
                    },
                    {
                        month: 'Feb.',
                        value: 95,
                        type: 'C'
                    },
                    {
                        month: 'Mar.',
                        value: 62,
                        type: 'C'
                    },
                    {
                        month: 'Apr.',
                        value: 52,
                        type: 'C'
                    },
                    {
                        month: 'May.',
                        value: 74,
                        type: 'C'
                    },
                    {
                        month: 'Jun.',
                        value: 87,
                        type: 'C'
                    },
                    {
                        month: 'Jul.',
                        value: 80,
                        type: 'C'
                    },
                    {
                        month: 'Aug.',
                        value: 69,
                        type: 'C'
                    },
                    {
                        month: 'Sep.',
                        value: 74,
                        type: 'C'
                    },
                    {
                        month: 'Oct.',
                        value: 84,
                        type: 'C'
                    },
                    {
                        month: 'Nov.',
                        value: 94,
                        type: 'C'
                    },
                    {
                        month: 'Dec.',
                        value: 23,
                        type: 'C'
                    }
                ]
            }
        ],
        categoryField: 'month',
        valueField: 'value',
        seriesField: 'type',
        stack: true,
        outerRadius: 0.8,
        area: {
            visible: true
        },
        legends: {
            visible: true,
            orient: 'right'
        }
        /*
        crosshair: {
          categoryField: {
            visible: true,
            line: {
              type: 'rect'
            },
            label: {
              visible: true
            }
          },
          valueField: {
            visible: true,
            line: {
              type: 'line',
              smooth: true
            },
            label: {
              visible: true
            }
          }
        }
        */
    }
};
