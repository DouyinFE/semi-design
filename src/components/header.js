import React from 'react';
import { _t } from 'utils/locale';
import SemiSiteHeader from '@douyinfe/semi-site-header';
import '@douyinfe/semi-site-header/dist/index.css';
import { navigate } from 'gatsby';

const Header = ({ location, localeCode, style }) => (
    <div>
        <SemiSiteHeader
            style={style}
            transparent={true}
            colorReverse={false}
            location={location}
            hasSearch={true}
            onSearch={() => window.showSearch()}
            onDarkChange={(mode)=>{
                const iframeDOM=document.querySelector('iframe');
                try{
                    iframeDOM?.contentWindow?.semidoc?.setDarkmode(mode==='dark');
                }catch (e){

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
