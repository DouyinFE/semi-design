import { ro } from 'date-fns/locale';

/**
 * [i18n-Romanian]
 */
export default {
    code: 'ro',
    dateFnsLocale: ro,
    Pagination: {
        pageSize: 'Articole pe pagină: ${pageSize}',
        total: 'Total ${total} de pagini',
        jumpTo: 'Treci la',
        page: 'pagini',
    },
    Modal: {
        confirm: 'Confirmă',
        cancel: 'Anulează',
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
        },
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
            FORMAT_SWITCH_DATE: 'yyyy-MM-dd',
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
        remaining: '${remained} plus',
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
        total: 'Total ${total} articole',
        selected: '${total} articole selectate',
    },
    Form: {
        optional: '(opțional)',
    },
};
