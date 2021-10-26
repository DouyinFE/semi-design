import React, { useEffect } from 'react';
import Banner from './components/banner/banner.jsx'
import Products from './components/products/products.jsx';
import Comments from './components/comments/comments.jsx';
import Resource from './components/resource/resource.jsx'
import Dsm from './components/dsm/dsm.jsx';
import Pro from './components/pro/pro.jsx';
import Theme from './components/theme/theme.jsx'
import styles from './index.module.scss'
import { getLocale } from '../../utils/locale.js';
import classnames from 'classnames'
import AOS from 'aos';
import 'aos/dist/aos.css';

function NewHome() {
    const locale = getLocale();
    useEffect(() => {
        AOS.init()
    }, [])
    return (
        <div className={classnames(styles.homePage, {[styles.homeEnglish]: locale === 'en-US'})}>
            <Banner></Banner>
            <Products data-aos="fade-in"></Products>
            <Resource data-aos="fade-in"></Resource>
            <Theme data-aos="fade-in"></Theme>
            <Dsm data-aos="fade-in"></Dsm>
            <Pro data-aos="fade-in"></Pro>
            <Comments data-aos="fade-in"></Comments>
        </div>
    );
}

export default NewHome;
