import React from 'react';
import { _t } from 'utils/locale';
import SemiSiteHeader from 'semi-site-header';
import 'semi-site-header/dist/index.css';
import { navigate } from 'gatsby';

const Header = ({ location, localeCode, style }) => (
    <div>
        <SemiSiteHeader
            style={style}
            onDarkChange={(mode)=>{
                const iframeDOM=document.querySelector('iframe');
                try {
                    iframeDOM?.contentWindow?.semidoc?.setDarkmode(mode==='dark');
                } catch (e){

                }
            }}
            onLocaleChange={locale => {
                if (locale === 'en-US') {
                    localStorage.setItem('locale', 'en-US');
                    navigate(location.pathname.replace('zh-CN', 'en-US'));

                } else {
                    localStorage.setItem('locale', 'zh-CN');
                    navigate(location.pathname.replace('en-US', 'zh-CN'));

                }
                return false;
            }}
        />
    </div>
);

export default Header;
