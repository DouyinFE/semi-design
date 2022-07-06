import { it } from 'date-fns/locale';
import { Locale } from '../interface';

const local: Locale = {
    code: 'it',
    dateFnsLocale: it,
    Pagination: {
        item: 'elemento',
        pageSize: ' elementi / pagine',
        page: ' pagine',
        total: '',
        jumpTo: 'Vai a'
    },
    Modal: {
        confirm: 'Conferma',
        cancel: 'Cancella',
    },
    TimePicker: {
        placeholder: {
            time: 'Seleziona ora',
            timeRange: 'Seleziona un intervallo di tempo',
        },
        begin: 'Ora inizio',
        end: 'Ora fine',
        hour: '',
        minute: '',
        second: '',
        AM: 'AM',
        PM: 'PM',
    },
    DatePicker: {
        placeholder: {
            date: 'Seleziona data',
            dateTime: 'Seleziona data e ora',
            dateRange: ['Data inizio', 'Data fine'],
            dateTimeRange: ['Data inizio', 'Data fine'],
        },
        footer: {
            confirm: 'Conferma',
            cancel: 'Cancella',
        },
        selectDate: 'Seleziona data',
        selectTime: 'Seleziona ora',
        year: 'anno',
        month: 'mese',
        day: 'giorno',
        monthText: '${month} ${year}',
        months: {
            1: 'Gen',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'Mag',
            6: 'Giu',
            7: 'Lug',
            8: 'Ago',
            9: 'Set',
            10: 'Ott',
            11: 'Nov',
            12: 'Dic',
        },
        fullMonths: {
            1: 'Gennaio',
            2: 'Febbraio',
            3: 'Marzo',
            4: 'Aprile',
            5: 'Maggio',
            6: 'Giugno',
            7: 'Luglio',
            8: 'Agosto',
            9: 'Settembre',
            10: 'Ottobre',
            11: 'Novembre',
            12: 'Dicembre',
        },
        weeks: {
            Mon: 'Lun',
            Tue: 'Mar',
            Wed: 'Mer',
            Thu: 'Gio',
            Fri: 'Ven',
            Sat: 'Sab',
            Sun: 'Dom',
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'yyyy-MM-dd',
        },
    },
    Popconfirm: {
        confirm: 'Conferma',
        cancel: 'Cancella',
    },
    Navigation: {
        collapseText: 'Comprimi la barra laterale',
        expandText: 'Espandi la barra laterale',
    },
    Table: {
        emptyText: 'Nessun risultato',
        pageText: 'Mostra ${currentStart} a ${currentEnd} di ${total}',
    },
    Select: {
        emptyText: 'Nessun risultato',
        createText: 'Crea',
    },
    Tree: {
        emptyText: 'Nessun risultato',
        searchPlaceholder: 'Cerca',
    },
    Cascader: {
        emptyText: 'Nessun risultato',
    },
    List: {
        emptyText: 'Nessun risultato',
    },
    Calendar: {
        allDay: 'Tutto il giorno',
        AM: '${time} AM',
        PM: '${time} PM',
        datestring: '',
        remaining: '${remained} più',
    },
    Upload: {
        mainText: 'Clicca per caricare il file o trascina il file qui',
        illegalTips: 'Questo tipo di file non è supportato',
        legalTips: 'Rilascia e inizia a caricare',
        retry: 'Riprova',
        replace: 'Sostituisci file',
        clear: 'Cancella',
        selectedFiles: 'File selezionati',
        illegalSize: 'Dimensione file errata',
        fail: 'Caricamento fallito',
    },
    TreeSelect: {
        searchPlaceholder: 'Cerca',
    },
    Typography: {
        copy: 'Copia',
        copied: 'Copiato',
        expand: 'Espandi',
        collapse: 'Comprimi',
    },
    Transfer: {
        emptyLeft: 'Nessun dato',
        emptySearch: 'Nessun risultato trovato',
        emptyRight: 'Nessun contenuto, controlla da sinistra',
        placeholder: 'Cerca',
        clear: 'Cancella',
        selectAll: 'Seleziona tutto',
        clearSelectAll: 'Deseleziona tutto',
        total: 'Totale ${total} elementi',
        selected: '${total} elementi selezionati',
    },
};

// [i18n-Italian]
export default local;
