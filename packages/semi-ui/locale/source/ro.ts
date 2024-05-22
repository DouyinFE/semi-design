import { ro } from 'date-fns/locale';
import { Locale } from '../interface';

const local: Locale = {
    code: 'ro',
    dateFnsLocale: ro,
    Pagination: {
        pageSize: 'Elemente per pagină: ${pageSize}',
        total: 'Total pagini: ${total}',
        jumpTo: 'Treci la',
        page: 'pagini',
    },
    Modal: {
        confirm: 'Confirmă',
        cancel: 'Anulează',
    },
    Tabs: {
        more: "Mai mult"
    },
    TimePicker: {
        placeholder: {
            time: 'Selectează timpul',
            timeRange: 'Selectează o perioadă de timp',
        },
        begin: 'Ora de începere',
        end: 'Ora de încheiere',
        hour: '',
        minute: '',
        second: '',
        AM: 'AM',
        PM: 'PM',
    },
    DatePicker: {
        placeholder: {
            date: 'Selectează data',
            dateTime: 'Selectează data și ora',
            dateRange: ['Data de început', 'Data de sfârșit'],
            dateTimeRange: ['Data de început', 'Data de sfârșit'],
            monthRange: ['Luna de început', 'Luna de sfârșit'],
        },
        presets: 'Selecții rapide',
        footer: {
            confirm: 'Confirmă',
            cancel: 'Anulează',
        },
        selectDate: 'Selectează data',
        selectTime: 'Selectează timpul',
        year: 'an',
        month: 'lună',
        day: 'zi',
        monthText: '${month} ${year}',
        months: {
            1: 'Ian',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'Mai',
            6: 'Iun',
            7: 'Iul',
            8: 'Aug',
            9: 'Sep',
            10: 'Oct',
            11: 'Noi',
            12: 'Dec',
        },
        fullMonths: {
            1: 'Ianuarie',
            2: 'Februarie',
            3: 'Martie',
            4: 'Aprilie',
            5: 'Mai',
            6: 'Iunie',
            7: 'Iulie',
            8: 'August',
            9: 'Septembrie',
            10: 'Octombrie',
            11: 'Noiembrie',
            12: 'Decembrie',
        },
        weeks: {
            Mon: 'Lun',
            Tue: 'Mar',
            Wed: 'Mie',
            Thu: 'Joi',
            Fri: 'Vin',
            Sat: 'Sâm',
            Sun: 'dum',
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'dd.MM.yyyy',
        },
    },
    Popconfirm: {
        confirm: 'Confirmă',
        cancel: 'Anulează',
    },
    Navigation: {
        collapseText: 'Comprimă bara laterală',
        expandText: 'Extinde bara laterală',
    },
    Table: {
        emptyText: 'Nici un rezultat',
        pageText: 'Arată ${currentStart} la ${currentEnd} de ${total}',
    },
    Select: {
        emptyText: 'Nici un rezultat',
        createText: 'Creează',
    },
    Tree: {
        emptyText: 'Nici un rezultat',
        searchPlaceholder: 'Căutare',
    },
    Cascader: {
        emptyText: 'Nici un rezultat',
    },
    List: {
        emptyText: 'Nici un rezultat',
    },
    Calendar: {
        allDay: 'Toată ziua',
        AM: '${time} AM',
        PM: '${time} PM',
        datestring: '',
        remaining: 'Cantitate ramasa: ${remained}',
    },
    Upload: {
        mainText: 'Dă clic pentru a descărca fișierul sau trage fișierul aici',
        illegalTips: 'Acest tip de fișier nu este acceptat',
        legalTips: 'Eliberează și începe încărcarea',
        retry: 'Încearcă din nou',
        replace: 'Înlocuiește fișierul',
        clear: 'Șterge',
        selectedFiles: 'Fișiere selectate',
        illegalSize: 'Dimensiunea greșită a fișierului',
        fail: 'Eșec de încărcare',
    },
    TreeSelect: {
        searchPlaceholder: 'Căutare',
    },
    Typography: {
        copy: 'Copiază',
        copied: 'Copiat',
        expand: 'Extinde',
        collapse: 'Comprimare',
    },
    Transfer: {
        emptyLeft: 'Nu există date',
        emptySearch: 'Nu s-au găsit rezultate',
        emptyRight: 'Fără conținut, verifică la stânga',
        placeholder: 'Căutare',
        clear: 'Șterge',
        selectAll: 'Selectează toate',
        clearSelectAll: 'Deselectează toate',
        total: 'Total elemente: ${total}',
        selected: 'Elemente selectate: ${total}',
    },
    Form: {
        optional: '(opțional)',
    },
    Image: {
        preview: 'Previzualizează',
        loading: 'Se încarcă',
        loadError: 'Nu s-a putut încărca',
        prevTip: 'Anterior',
        nextTip: 'Înainte',
        zoomInTip: 'Mărire',
        zoomOutTip: 'Micșorare',
        rotateTip: 'Rotește',
        downloadTip: 'Descarcă',
        adaptiveTip: 'Afișaj adaptabil',
        originTip: 'Afișaj implicit',
    },
};

// [i18n-Romanian] 罗马尼亚语
export default local;