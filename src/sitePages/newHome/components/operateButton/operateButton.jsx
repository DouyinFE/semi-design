import { _t } from "src/utils/locale";
import { Button } from '@douyinfe/semi-ui';
import { navigate } from 'gatsby-link';
import React, { useEffect, useState } from 'react';
import { getLocale } from '../../../../utils/locale';
import styles from "./operateButton.module.scss";
import { IconGithubLogo } from '@douyinfe/semi-icons';

const GITHUB_API = 'https://api.github.com/repos/DouyinFE/semi-design';
const STAR_CACHE_KEY = 'semi-github-star-count';
const STAR_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const FALLBACK_STAR = '9.9k';

const formatStarCount = count => {
    if (typeof count !== 'number' || !isFinite(count) || count <= 0) {
        return FALLBACK_STAR;
    }
    if (count < 1000) {
        return String(count);
    }
    const inK = count / 1000;
    // keep one decimal for < 10k (e.g. 9.3k), drop it for larger / whole numbers
    const text = inK < 10 ? inK.toFixed(1) : Math.round(inK).toString();
    return `${text.replace(/\.0$/, '')}k`;
};

function OperateButton() {
    const [starText, setStarText] = useState(FALLBACK_STAR);

    useEffect(() => {
        let cancelled = false;

        try {
            const cached = JSON.parse(window.localStorage.getItem(STAR_CACHE_KEY) || 'null');
            if (cached && Date.now() - cached.time < STAR_CACHE_TTL) {
                setStarText(formatStarCount(cached.count));
                return undefined;
            }
        } catch (e) {
            // ignore corrupted cache / unavailable storage
        }

        fetch(GITHUB_API)
            .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
            .then(data => {
                const count = data && data.stargazers_count;
                if (cancelled || typeof count !== 'number') {
                    return;
                }
                setStarText(formatStarCount(count));
                try {
                    window.localStorage.setItem(STAR_CACHE_KEY, JSON.stringify({ count, time: Date.now() }));
                } catch (e) {
                    // ignore storage write failure
                }
            })
            .catch(() => {
                // keep fallback text on network error / rate limit
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const goStart = () => {
        navigate(`/${getLocale()}/start/getting-started`);
    };
    const goGithub = () => {
        window.open('https://github.com/DouyinFE/semi-design');
    };
    return (<div className={styles.group2835}>
        <a href={`/${getLocale()}/start/getting-started`}>
            <Button tabIndex={-1} onClick={goStart} size="large" theme="solid" className={styles.extraLarge}>{_t("start_using", { }, "开始使用")}</Button>
        </a>
        <Button
            onClick={goGithub} 
            size="large"
            type={"tertiary"}
            theme="borderless"
            style={{
                border: "1px solid var(--semi-color-border)",
                color: "var(--semi-color-text-0)",
                marginLeft: "16px"
            }}
            className={styles.extraLarge} 
            icon={<IconGithubLogo size={'large'}/>}
        >
            <span style={{ display: 'flex' }}>
                GitHub
                <span className={styles.badge}>{starText}</span>
            </span>
        </Button>
    </div>);
}

export default OperateButton;
