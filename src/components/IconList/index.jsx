import React, { useMemo, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Tabs, TabPane, Input, Typography } from '@douyinfe/semi-ui';
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
                iconLabData {
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
    const { iconData, pkgJson, iconLabData } = data.semiIconNodeType;

    const [iconFilterData, setIconFilterData] = useState(iconData);
    const [iconLabFilterData, setIconLabFilterData] = useState(iconLabData);

    const search = keyword => {
        const lowerKeyword = keyword.toLowerCase();
        const res = iconData.filter(icon => icon.name.toLowerCase().includes(lowerKeyword) || icon.category.toLowerCase().includes(lowerKeyword));
        const labRes = iconLabFilterData.filter(icon => icon.name.toLowerCase().includes(lowerKeyword) || icon.category.toLowerCase().includes(lowerKeyword));
        setIconFilterData(res);
        setIconLabFilterData(labRes);
    };

    const { fillGroups, strokedGroups, fillIcons, strokedIcons, labGroups } = useMemo(() => {
        const fillIcons = iconFilterData.filter(i => !/Stroked$/.test(i.name));
        const strokedIcons = iconFilterData.filter(i => /Stroked$/.test(i.name));
        const fillGroups = sortBy(toPairs(groupBy(fillIcons, 'category')), ['0']);
        const strokedGroups = sortBy(toPairs(groupBy(strokedIcons, 'category')), ['0']);

        const labIcons = iconLabFilterData;
        const labGroups = sortBy(toPairs(groupBy(labIcons, 'category')), ['0']);

        return {
            fillGroups,
            strokedGroups,
            fillIcons,
            strokedIcons,
            labGroups,
        };
    }, [iconFilterData, iconLabFilterData]);

    return (
        <div className="semi-icons-container">
            <div>
                <img style={{ marginRight: 8 }} src={`https://badgen.net/badge/${encodeURIComponent(pkgJson.name)}/${pkgJson.version}?blue`} alt="" />
                <img src={`https://badgen.net/badge/count/${iconData.length}/blue`} alt="" />
                <img style={{ marginRight: 8, marginLeft: 24 }} src={`https://badgen.net/badge/%40douyinfe%2Fsemi-icons-lab/${pkgJson.version}?color=cyan`} alt="" />
                <img src={`https://badgen.net/badge/count/${iconLabData.length}/cyan`} alt="" />
            </div>
            <Tabs keepDOM>
                <TabPane tab={_t('icon.list.tab.fill')} itemKey="fill"><IconCategory groups={fillGroups} pkgType='default' /></TabPane>
                <TabPane tab={_t('icon.list.tab.stroked')} itemKey="stroked"><IconCategory groups={strokedGroups} pkgType='default' /></TabPane>
            </Tabs>
            <Typography.Title heading={2}>{_t('icon.list.tab.lab')}</Typography.Title>
            <IconCategory groups={labGroups} pkgType='lab' />
        </div>
    );
};

export default IconList;
