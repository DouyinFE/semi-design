import { ms } from 'date-fns/locale';
import { Locale } from '../interface';

const local: Locale = {
    code: 'ms-MY',
    dateFnsLocale: ms,
    Pagination: {
        item: 'item',
        pageSize: ' items / halaman',
        page: ' halaman',
        total: '',
        jumpTo: 'Lompat ke'
    },
    Modal: {
        confirm: 'Sahkan',
        cancel: 'Batal',
    },
    TimePicker: {
        placeholder: {
            time: 'Pilih masa',
            timeRange: 'Pilih julat masa',
        },
        begin: 'Masa Mula',
        end: 'Masa Akhir',
        hour: '',
        minute: '',
        second: '',
        AM: 'pagi',
        PM: 'petang',
    },
    DatePicker: {
        placeholder: {
            date: 'Pilih tarikh',
            dateTime: 'Pilih tarikh dan masa',
            dateRange: ['Tarikh mula', 'Tarikh akhir'],
            dateTimeRange: ['Tarikh mula', 'Tarikh akhir'],
        },
        footer: {
            confirm: 'Sahkan',
            cancel: 'Batal',
        },
        selectDate: 'Pilih Tarikh',
        selectTime: 'Pilih Masa',
        year: 'tahun',
        month: 'bulan',
        day: 'hari',
        monthText: '${month} ${year}',
        months: {
            1: 'Januari',
            2: 'Februari',
            3: 'Mac',
            4: 'April',
            5: 'Mei',
            6: 'Jun',
            7: 'Julai',
            8: 'Ogos',
            9: 'September',
            10: 'Oktober',
            11: 'November',
            12: 'Disember',
        },
        fullMonths: {
            1: 'Januari',
            2: 'Februari',
            3: 'Mac',
            4: 'April',
            5: 'Mei',
            6: 'Jun',
            7: 'Julai',
            8: 'Ogos',
            9: 'September',
            10: 'Oktober',
            11: 'November',
            12: 'Disember',
        },
        weeks: {
            Mon: 'Isnin',
            Tue: 'Selasa',
            Wed: 'Rabu',
            Thu: 'Khamis',
            Fri: 'Jumaat',
            Sat: 'Sabtu',
            Sun: 'Ahad',
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'dd/MM/yyyy',
        },
    },
    Popconfirm: {
        confirm: 'Sahkan',
        cancel: 'Batal',
    },
    Navigation: {
        collapseText: 'Kolapse Sidebar',
        expandText: 'Kembangkan bar sisi',
    },
    Table: {
        emptyText: 'Tiada kandungan',
        pageText: 'Papar halaman ${currentStart} hingga ${currentEnd} daripada ${total}',
    },
    Select: {
        emptyText: 'Tiada kandungan',
        createText: 'Tetapkan',
    },
    Cascader: {
        emptyText: 'Tiada kandungan',
    },
    Tree: {
        emptyText: 'Tiada kandungan',
        searchPlaceholder: 'Cari',
    },
    List: {
        emptyText: 'Tiada kandungan',
    },
    Calendar: {
        allDay: 'Sepanjang Hari',
        AM: '${time} pagi',
        PM: '${time} petang',
        datestring: '',
        remaining: '${remained} lebih',
    },
    Upload: {
        mainText: 'Klik untuk Muat Naik Fail atau Seret Fail ke sini',
        illegalTips: 'Jenis fail ini tidak disokong',
        legalTips: 'Lepaskan dan mula muat naik',
        retry: 'Cuba Semula',
        replace: 'Ganti fail',
        clear: 'Kosongkan',
        selectedFiles: 'Fail Dipilih',
        illegalSize: 'Saiz fail tidak sah',
        fail: 'Muat naik gagal',
    },
    TreeSelect: {
        searchPlaceholder: 'Cari',
    },
    Typography: {
        copy: 'Samin',
        copied: 'Disalin',
        expand: 'Buka',
        collapse: 'Collapse',
    },
    Transfer: {
        emptyLeft: 'Tiada Data',
        emptySearch: 'Tiada hasil gelintar',
        emptyRight: 'Tiada kandungan, periksa dari kiri',
        placeholder: 'Cari',
        clear: 'Kosongkan',
        selectAll: 'Pilih Semua',
        clearSelectAll: 'Nyahpilih semua',
        total: 'Jumlah ${total} item',
        selected: '${total} projek dipilih',
    },
    Form: {
        optional: '(pilihan)',
    },
};

// [i18n-Malaysia(MY)]
export default local;
