import React, { useMemo, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Tabs, TabPane, Input } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { groupBy, toPairs, sortBy } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import IconCategory from './IconCategory';
import './index.scss';

const _t = id => <FormattedMessage id={id} />;

const IconList = props => {
    const data = useStaticQuery(graphql`
        query {
            semiIconNodeType {
                iconData {
                  name
                  category
                }
                pkgJson {
                  name
                  version
                  description
                  author
                  homepage
                  main
                  module
                  license
                  _unpkg
                }
              }
        }
    `);
    // debugger;
    console.log(data);
    const { iconData, pkgJson } = data.semiIconNodeType;
    const [iconFilterData, $iconFilterData] = useState(iconData);
    const search = keyword => {
        const lowerKeyword = keyword.toLowerCase();
        const res = iconData.filter(icon => icon.name.toLowerCase().includes(lowerKeyword) || icon.category.toLowerCase().includes(lowerKeyword));
        $iconFilterData(res);
    };
    const { fillGroups, strokedGroups, fillIcons, strokedIcons } = useMemo(() => {
        const fillIcons = iconFilterData.filter(i => !/Stroked$/.test(i.name));
        const strokedIcons = iconFilterData.filter(i => /Stroked$/.test(i.name));
        const fillGroups = sortBy(toPairs(groupBy(fillIcons, 'category')), ['0']);
        const strokedGroups = sortBy(toPairs(groupBy(strokedIcons, 'category')), ['0']);
        return {
            fillGroups,
            strokedGroups,
            fillIcons,
            strokedIcons,
        };
    }, [iconFilterData]);
    return (
        <div className="semi-icons-container">
            <div>
                <img style={{ marginRight: 8 }} src={`https://badgen.net/badge/${encodeURIComponent(pkgJson.name)}/${pkgJson.version}`} alt="" />
                <img src={`https://badgen.net/badge/count/${iconData.length}/grey`} alt="" />
            </div>
            <Tabs keepDOM tabBarExtraContent={<Input suffix={<IconSearch />} showClear onEnterPress={e => search(e.target.value)} onClear={() => search('')} />}>
                <TabPane tab={_t('icon.list.tab.fill')} itemKey="fill"><IconCategory groups={fillGroups} /></TabPane>
                <TabPane tab={_t('icon.list.tab.stroked')} itemKey="stroked"><IconCategory groups={strokedGroups} /></TabPane>
            </Tabs>
        </div>
    );
};

export default IconList;
