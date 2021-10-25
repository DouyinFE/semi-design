import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import Home from 'src/sitePages/newHome';
import SEO from '../../components/seo';
import { getLocale } from '../../utils/locale';

const IndexPage = ({ location }) => {
    const locale = getLocale(location.pathname);

    const handleNavigate = item => {
        navigate(`${locale}${item.link}`);
    };

    useEffect(() => {
        window?.__semi__?.Tea?.userVisited();
    }, []);


    return (
        <div className="semi-site-page">
            <SEO lang="zh-CN" title="Semi Design" />
            <Home />
        </div>
    );
};

export default IndexPage;
