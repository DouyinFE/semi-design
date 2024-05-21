import { arSA } from 'date-fns/locale';
import { Locale } from '../interface';

const local: Locale = {
    code: 'ar',
    dateFnsLocale: arSA,
    Pagination: {
        pageSize: 'العناصر في كل صفحة: ${pageSize}',
        total: 'إجمالي الصفحات: ${total}',
        jumpTo: 'اقفز إلى',
        page: ' الصفحات',
    },
    Modal: {
        confirm: 'تؤكد',
        cancel: 'إلغاء',
    },
    TimePicker: {
        placeholder: {
            time: 'حدد الوقت',
            timeRange: 'حدد نطاقًا زمنيًا',
        },
        begin: 'وقت البدء',
        end: 'وقت النهاية',
        hour: '',
        minute: '',
        second: '',
        AM: 'صباح',
        PM: 'في الظهيرة',
    },
    DatePicker: {
        placeholder: {
            date: 'حدد تاريخ',
            dateTime: 'حدد التاريخ والوقت',
            dateRange: ['تاريخ البدء', 'تاريخ النهاية'],
            dateTimeRange: ['تاريخ البدء', 'تاريخ النهاية'],
            monthRange: ['الشهر الأول', 'الشهر الأخير'],
        },
        presets: 'اختيار سريع',
        footer: {
            confirm: 'تؤكد',
            cancel: 'إلغاء',
        },
        selectDate: 'حدد تاريخ',
        selectTime: 'حدد الوقت',
        year: 'عام',
        month: 'شهر',
        day: 'يوم',
        monthText: '${month} ${year}',
        months: {
            1: 'يناير',
            2: 'فبراير',
            3: 'مارس',
            4: 'أبريل',
            5: 'مايو',
            6: 'يونيو',
            7: 'يوليو',
            8: 'أغسطس',
            9: 'سبتمبر',
            10: 'أكتوبر',
            11: 'نوفمبر',
            12: 'ديسمبر',
        },
        fullMonths: {
            1: 'يناير',
            2: 'فبراير',
            3: 'مارس',
            4: 'أبريل',
            5: 'مايو',
            6: 'يونيو',
            7: 'يوليو',
            8: 'أغسطس',
            9: 'سبتمبر',
            10: 'أكتوبر',
            11: 'نوفمبر',
            12: 'ديسمبر',
        },
        weeks: {
            Mon: 'الاثنين‬',
            Tue: 'الثلاثاء‬',
            Wed: 'الأربعاء‬',
            Thu: 'الخميس‬',
            Fri: 'الجمعة‬',
            Sat: 'السبت‬',
            Sun: 'الأحد‬',
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'yyyy/MM/dd',
        },
    },
    Popconfirm: {
        confirm: 'تؤكد',
        cancel: 'إلغاء',
    },
    Navigation: {
        collapseText: 'طي الشريط الجانبي',
        expandText: 'قم بتوسيع الشريط الجانبي',
    },
    Table: {
        emptyText: 'لا نتيجة',
        pageText: 'عرض ${currentStart} إلى ${currentEnd} من ${total}',
    },
    Select: {
        emptyText: 'لا نتيجة',
        createText: 'خلق',
    },
    Tree: {
        emptyText: 'لا نتيجة',
        searchPlaceholder: 'بحث',
    },
    Cascader: {
        emptyText: 'لا نتيجة',
    },
    List: {
        emptyText: 'لا نتيجة',
    },
    Calendar: {
        allDay: 'طوال اليوم',
        AM: '${time} صباح',
        PM: '${time} في الظهيرة',
        datestring: '',
        remaining: 'الكمية المتبقية: ${remained}',
    },
    Upload: {
        mainText: 'انقر لتحميل الملف أو اسحب الملف إلى هنا',
        illegalTips: 'هذا النوع من الملفات غير مدعوم',
        legalTips: 'حرر وابدأ التحميل',
        retry: 'أعد المحاولة',
        replace: 'استبدل الملف',
        clear: 'واضح',
        selectedFiles: 'الملفات المختارة',
        illegalSize: 'حجم الملف غير قانوني',
        fail: 'فشل التحميل',
    },
    TreeSelect: {
        searchPlaceholder: 'بحث',
    },
    Typography: {
        copy: 'نسخ',
        copied: 'نسخ',
        expand: 'وسعت',
        collapse: 'انهيار',
    },
    Transfer: {
        emptyLeft: 'لايوجد بيانات',
        emptySearch: 'لا نتائج للبحث',
        emptyRight: 'لا يوجد محتوى ، تحقق من اليسار',
        placeholder: 'بحث',
        clear: 'واضح',
        selectAll: 'اختر الكل',
        clearSelectAll: 'إلغاء تحديد الكل',
        total: "إجمالي العناصر: ${total}",
        selected: "العناصر المحددة: ${total}"
    },
    Form: {
        optional: '(اختياري)',
    },
    Image: {
        preview: 'معاينة',
        loading: 'جار التحميل',
        loadError: 'فشل في التحميل',
        prevTip: "السابق",
        nextTip: "التالي",
        zoomInTip: "تكبير",
        zoomOutTip: "تصغير",
        rotateTip: "استدارة",
        downloadTip: "تنزيل",
        adaptiveTip: "التكيف مع الصفحة",
        originTip: "الحجم الأصلي",
    },
    Chat: {
        deleteConfirm: 'هل ترغب في حذف هذه الجلسة؟',
        clearContext: 'تم مسح السياق',
        copySuccess: 'تم النسخ بنجاح',
        stop: 'توقف',
    },
};

// [i18n-Arabic]
export default local;
