import axios from 'axios';

export default async function searchMaterial(keyword, localeCode = 'zh-CN') {
    const extractMaterialInfo = materialData => {
        const { title, category, id } = materialData;
        return {
            belong: 'material',
            title: [title],
            context: localeCode === 'zh-CN' ? category.text : category.text_en_US,
            type: 'material',
            url: `https://semi.design/material/${localeCode}/detail/${id}`,
        };
    };

    const searchUrl = 'https://semi.design/api/material/search';
    let materialList = [];
    try {
        materialList = (
            await axios.get(searchUrl, {
                timeout: 1000,
                params: {
                    pageSize: 999,
                    pageNum: 1,
                    needDetail: 1,
                    type: 1,
                    isPublic: 1,
                    isDraft: 0,
                    orderBy: 'stars',
                    orderDir: -1,
                    needLikes: true,
                    query: keyword,
                    search: true,
                },
            })
        ).data.data.list;
    } catch (e) {
        console.log(e);
    }
    const materialResult = materialList.map(material => extractMaterialInfo(material));
    return materialResult;
}
