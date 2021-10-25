import React, { useEffect } from 'react';
import Home from 'src/sitePages/newHome';
import SEO from '../../components/seo';

const IndexPage = ({ location }) => {

    useEffect(() => {
        window?.__semi__?.Tea?.userVisited();
        window?.__semi__?.Tea?.eventHappened("refer",document?.referrer ?? 'empty');
    }, []);

    return (
        <div className="semi-site-page">
            <SEO lang="zh-CN" title="Semi Design" />
            <Home />
        </div>
    );
};

export default IndexPage;
