import { ja } from 'date-fns/locale';
import { Locale } from '../interface';

const local: Locale = {
    code: 'ja-JP',
    dateFnsLocale: ja,
    Pagination: {
        pageSize: '1ページあたりのアイテム数：${pageSize}',
        total: '合計ページ数：${total}',
        jumpTo: 'ページへ',
        page: 'ページ',
    },
    Modal: {
        confirm: '確認する',
        cancel: 'キャンセル',
    },
    TimePicker: {
        placeholder: {
            time: '時間を選択してください',
            timeRange: '時間範囲を選択してください'
        },
        begin: '始まる時間',
        end: '終了時間',
        hour: '時',
        minute: '分',
        second: '秒',
        AM: '午前',
        PM: '午後',
    },
    DatePicker: {
        placeholder: {
            date: '日付を選択してください',
            dateTime: '日時を選択してください',
            dateRange: ['開始日', '終了日'],
            dateTimeRange: ['開始日', '終了日'],
            monthRange: ['開始月', '終了月'],
        },
        presets: 'クイック選択',
        footer: {
            confirm: '確認する',
            cancel: 'キャンセル',
        },
        selectDate: '日付を選ぶ',
        selectTime: '時間を選ぶ',
        year: '年',
        month: '月',
        day: '日',
        monthText: '${year}年 ${month}', // 此处不使用标准token是因为需要做replace，月份M这个Token可能会被误伤，例如May
        months: {
            1: '1月',
            2: '2月',
            3: '3月',
            4: '4月',
            5: '5月',
            6: '6月',
            7: '7月',
            8: '8月',
            9: '9月',
            10: '10月',
            11: '11月',
            12: '12月',
        },
        // timepicker scrollwheel里只需要展示[1、2……]，所以这里的fullMonths根据UI定制了
        fullMonths: {
            1: '一月',
            2: '二月',
            3: '三月',
            4: '四月',
            5: '五月',
            6: '六月',
            7: '七月',
            8: '八月',
            9: '九月',
            10: '十月',
            11: '十一月',
            12: '十二月',
        },
        weeks: {
            Mon: '月',
            Tue: '火',
            Wed: '水',
            Thu: '木',
            Fri: '金',
            Sat: '土',
            Sun: '日',
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'yyyy/MM/dd',
        },
    },
    Popconfirm: {
        confirm: '確認する',
        cancel: 'キャンセル',
    },
    Navigation: {
        collapseText: 'サイドバーを折りたたむ',
        expandText: 'サイドバーを展開',
    },
    Table: {
        emptyText: 'データがありません',
        pageText: '第 ${currentStart} 条から第 ${currentEnd} 条まで表示します。計 ${total} 条',
    },
    Select: {
        emptyText: 'データがありません',
        createText: '作成する',
    },
    Tree: {
        emptyText: 'データがありません',
        searchPlaceholder: '検索する',
    },
    Cascader: {
        emptyText: 'データがありません',
    },
    List: {
        emptyText: 'データがありません',
    },
    Calendar: {
        allDay: '終日',
        AM: '午前${time}時',
        PM: '午後${time}時',
        datestring: '日',
        remaining: 'あと${remained}つ',
    },
    Upload: {
        mainText: '[ファイルのアップロード]または[ファイルをここにドラッグ]をクリックします',
        illegalTips: 'このタイプのファイルはサポートされていません',
        legalTips: '手放してアップロード',
        retry: '再試行',
        replace: 'ファイルを置き換える',
        clear: 'クリア',
        selectedFiles: '選択されたファイル',
        illegalSize: '不正なファイルサイズ',
        fail: 'アップロードに失敗しました',
    },
    TreeSelect: {
        searchPlaceholder: '検索する',
    },
    Typography: {
        copy: 'コピー',
        copied: 'コピーしました',
        expand: '展開',
        collapse: '折り',
    },
    Transfer: {
        emptyLeft: 'データがありません',
        emptySearch: '検索結果がありません',
        emptyRight: '内容なし、左から確認',
        placeholder: '検索する',
        clear: '空っぽ',
        selectAll: 'すべて選択',
        clearSelectAll: 'すべてを選択解除',
        total: '合計アイテム数：${total}',
        selected: '選択されているアイテム数：${total}',
    },
    Form: {
        optional: '(オプション)',
    },
    Image: {
        preview: 'プレビュー',
        loading: '読み込み中',
        loadError: '読み込みに失敗しました',
        prevTip: '前へ',
        nextTip: '次へ',
        zoomInTip: 'ズームイン',
        zoomOutTip: 'ズームアウト',
        rotateTip: '回転',
        downloadTip: 'ダウンロード',
        adaptiveTip: 'ページに適応',
        originTip: '元のサイズ',
    },
    Chat: {
        deleteConfirm: 'このセッションを削除してもよろしいですか？',
        clearContext: 'コンテキストを削除しました',
        copySuccess: '正常にコピーされました',
        stop: 'とめる',
    },
};

// [i18n-Japan]
export default local;
