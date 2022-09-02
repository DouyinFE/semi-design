import { es } from 'date-fns/locale';
import { Locale } from '../interface';

/**
 * [i18n-Spanish(es)]
 *
 */

const locale: Locale = {
    code: 'es',
    dateFnsLocale: es,
    Pagination: {
        item: 'objeto',
        pageSize: ' objetos / página',
        page: ' páginas',
        total: '',
        jumpTo: 'Ir a',
    },
    Modal: {
        confirm: 'Aceptar',
        cancel: 'Cancelar',
    },
    TimePicker: {
        placeholder: {
            time: 'Seleccionar hora',
            timeRange: 'Seleccionar rango de tiempo',
        },
        begin: 'Hora inicial',
        end: 'Hora final',
        hour: '',
        minute: '',
        second: '',
        AM: 'AM',
        PM: 'PM',
    },
    DatePicker: {
        placeholder: {
            date: 'Seleccionar fecha',
            dateTime: 'Seleccionar hora y fecha',
            dateRange: ['Fecha inicial', 'Fecha final'],
            dateTimeRange: ['Fecha inicial', 'Fecha final'],
        },
        footer: {
            confirm: 'Aceptar',
            cancel: 'Cancelar',
        },
        selectDate: 'Seleccionar fecha',
        selectTime: 'Seleccionar hora',
        year: 'año',
        month: 'mes',
        day: 'día',
        monthText: '${month} ${year}',
        months: {
            1: 'Ene',
            2: 'Feb',
            3: 'Mar',
            4: 'Abr',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Ago',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dic',
        },
        fullMonths: {
            1: 'Enero',
            2: 'Febrero',
            3: 'Marzo',
            4: 'Abril',
            5: 'Mayo',
            6: 'Junio',
            7: 'Julio',
            8: 'Agosto',
            9: 'Septiembre',
            10: 'Octubre',
            11: 'Noviembre',
            12: 'Diciembre',
        },
        weeks: {
            Mon: 'Lun',
            Tue: 'Mar',
            Wed: 'Mie',
            Thu: 'Jue',
            Fri: 'Vie',
            Sat: 'Sab',
            Sun: 'Dom',
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'yyyy-MM-dd',
        },
    },
    Popconfirm: {
        confirm: 'Aceptar',
        cancel: 'Cancelar',
    },
    Navigation: {
        collapseText: 'Contraer barra lateral',
        expandText: 'Expandir barra lateral',
    },
    Table: {
        emptyText: 'Sin resultados',
        pageText: 'Mostrando del ${currentStart} al ${currentEnd} de ${total}',
    },
    Select: {
        emptyText: 'Sin resultados',
        createText: 'Crear',
    },
    Tree: {
        emptyText: 'Sin resultados',
        searchPlaceholder: 'Búsqueda',
    },
    Cascader: {
        emptyText: 'Sin resultados',
    },
    List: {
        emptyText: 'Sin resultados',
    },
    Calendar: {
        allDay: 'Todo el día',
        AM: '${time} AM',
        PM: '${time} PM',
        datestring: '',
        remaining: '${remained} mas',
    },
    Upload: {
        mainText: 'Clic aquí para cargar archivo o arrastre aquí el archivo',
        illegalTips: 'Este tipo de archivo no es compatible',
        legalTips: 'Suelte y comience a cargar',
        retry: 'Reintentar',
        replace: 'Reemplazar archivo',
        clear: 'Limpiar',
        selectedFiles: 'Archivos seleccionados',
        illegalSize: 'Tamaño de archivo inválido',
        fail: 'Error al cargar',
    },
    TreeSelect: {
        searchPlaceholder: 'Búsqueda',
    },
    Typography: {
        copy: 'Copiar',
        copied: 'Copiado',
        expand: 'Expandir',
        collapse: 'Contraer',
    },
    Transfer: {
        emptyLeft: 'Sin datos',
        emptySearch: 'Sin resultados de búsqueda',
        emptyRight: 'Sin contenido, verifique desde la izquierda',
        placeholder: 'Búsqueda',
        clear: 'Limpiar',
        selectAll: 'Seleccionar todo',
        clearSelectAll: 'Deseleccionar todo',
        total: 'Total ${total} objetos',
        selected: '${total} objetos seleccionados',
    },
    Form: {
        optional: '(opcional)',
    },
    Image: {
        preview: 'Avance',
        loading: 'Cargando',
        loadError: 'Falló al cargar',
    },
};

export default locale;