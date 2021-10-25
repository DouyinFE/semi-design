import React from 'react';
import { withPrefix } from 'gatsby';
import axios from 'axios';
import { Modal, Input } from '@douyinfe/semi-ui';
import _ from 'lodash-es';
import { _t } from 'utils/locale';
import searchFunc from '../search';
import searchMateral from '../additionSearch';
import RecommendList from './RecommendList';
import ResultList from './ResultList';
import styles from './index.module.scss';
class SearchModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: '',
            searchResult: [],
            searchVisible: false,
        };

        this.locale = props.intl.locale;
        this.recommendList = props.recommendList;
        this.data = null;
        this.search = _.debounce(this.search, 300);
        this.standBy = () => {};
        _.bindAll(this, [
            'init',
            'getSearchJSON',
            'search',
            'showSearch',
            'hideSearch',
            'onUserInputChange',
            'transResult',
        ]);
        this.init();
    }

    async init() {
        await this.getSearchJSON();
    }
    componentDidMount() {
        window.showSearch = () => this.showSearch();
        window.hideSearch = () => this.hideSearch();
    }
    formatMessage(id) {
        return this.props.intl.formatMessage({ id });
    }

    async getSearchJSON() {
        await axios(withPrefix('/search_data_client.json'))
            .then(res => {
                this.data = res.data;
            })
            .then(() => {
                this.standBy();
            });
    }

    async search(value) {


        if (!this.data) {
            this.standBy = () => this.search(value);
            return;
        }

        let searchFuncResult = searchFunc(value, this.data, this.props.intl.locale);

        let searchResult = this.transResult(searchFuncResult);
        const materialSearchResult = await searchMateral(value, this.locale);
        let i;
        if (_.get(searchResult[0], 'type', false) !== this.formatMessage('search.type.heading')) {
            i = -1;
        } else {
            i = 1;
            while (_.get(searchResult[i], 'type', false) === this.formatMessage('search.type.heading')) {
                i++;
            }
            i--;
        }
        searchResult = searchResult
            .slice(0, i + 1)
            .concat(materialSearchResult)
            .concat(searchResult.slice(i + 1));


        this.setState({ searchResult });
    }

    transResult(result) {
        const resultList = [];

        result.map(item => {
            if (item.type === 'brief') {
                resultList.push({
                    title: [item.mdxInfo.folder, item.mdxInfo.title, this.formatMessage('search.type.brief')],
                    url: item.url,
                    belong: item.belong,
                    type: _t('search.type.brief'),
                    context: item.text,
                });
            } else if (item.type === 'title') {
                resultList.push({
                    title: [item.mdxInfo.folder, item.mdxInfo.title, item.text],
                    url: item.url,
                    belong: item.belong,
                    type: this.formatMessage('search.type.heading'),
                    context: item.text,
                });
            } else {
                resultList.push({
                    title: item.context,
                    url: item.url,
                    belong: item.belong,
                    type: this.formatMessage(`search.type.${item.type}`),
                    context: item.text,
                });
            }
        });
        return resultList;
    }

    showSearch() {
        this.setState({ searchVisible: true, userInput: '', searchResult: [] });
        setTimeout(() => {
            this.inputRef && this.inputRef.focus();
        }, 0);
    }

    hideSearch() {
        this.setState({ searchVisible: false, userInput: '', searchResult: [] });
    }

    onUserInputChange(value) {
        this.setState({ userInput: value });
        if (value !== '') {
            this.search(value);
        } else {
            this.setState({ searchResult: [] });
        }
    }

    render() {
        const { userInput, searchVisible, searchResult } = this.state;
        const header = (
            <div className={styles.inputWrapper}>
                <Input
                    ref={_ => (this.inputRef = _)}
                    value={userInput}
                    placeholder={this.formatMessage('search.input.placeholder')}
                    onChange={this.onUserInputChange}
                    showClear
                />
            </div>
        );
        return (
            <div className={styles.searchWrapper}>
                <Modal
                    width={688}
                    visible={searchVisible}
                    footer={null}
                    header={header}
                    maskClosable={true}
                    closeOnEsc={true}
                    style={{ top: 40 }}
                    onCancel={() => this.hideSearch()}
                >
                    {userInput.length === 0 ? (
                        <RecommendList recommendItemList={this.recommendList} />
                    ) : (
                        <ResultList searchResult={searchResult} keyword={userInput} />
                    )}
                </Modal>
            </div>
        );
    }
}

export default SearchModal;
