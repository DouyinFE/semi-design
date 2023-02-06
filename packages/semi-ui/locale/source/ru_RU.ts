import { ru } from 'date-fns/locale';
import { Locale } from '../interface';

const local: Locale = {
    code: 'ru-RU',
    dateFnsLocale: ru,
    Pagination: {
        pageSize: '${pageSize} элементов / страницы',
        total: 'общее ${total} Прыгать в',
        jumpTo: 'Прыгать в',
        page: ' страницы'
    },
    Modal: {
        confirm: 'подтвердить',
        cancel: 'отмена',
    },
    TimePicker: {
        placeholder: {
            time: 'Выбрать время',
            timeRange: 'Выберите временной диапазон',
        },
        begin: 'Время начала',
        end: 'Конец времени',
        // hour: 'час',
        // minute: 'минута',
        // second: 'второй',
        hour: '',
        minute: '',
        second: '',
        AM: 'утро',
        PM: 'после',
    },
    DatePicker: {
        placeholder: {
            date: 'Выбрать дату',
            dateTime: 'Выбрать дату и время',
            dateRange: ['Дата начала', 'Дата окончания'],
            dateTimeRange: ['Дата начала', 'Дата окончания'],
        },
        footer: {
            confirm: 'подтвердить',
            cancel: 'отмена',
        },
        selectDate: 'Выбрать дату',
        selectTime: 'Выбрать время',
        year: 'год',
        month: 'месяц',
        day: 'день',
        monthText: '${month} ${year}',
        months: {
            1: 'Янв',
            2: 'Фев',
            3: 'Мар',
            4: 'Апрель',
            5: 'Май',
            6: 'июнь',
            7: 'июль',
            8: 'Август',
            9: 'Сентябрь',
            10: 'Октябрь',
            11: 'Ноябрь',
            12: 'Декабрь',
        },
        fullMonths: {
            1: 'Январь',
            2: 'Февраль',
            3: 'Март',
            4: 'Апрель',
            5: 'Май',
            6: 'июнь',
            7: 'Июль',
            8: 'Август',
            9: 'Сентябрь',
            10: 'Октябрь',
            11: 'Ноябрь',
            12: 'Декабрь'
        },
        weeks: {
            Mon: 'Пн',
            Tue: 'Вт',
            Wed: 'среда',
            Thu: 'Чт',
            Fri: 'Пт',
            Sat: 'Сб',
            Sun: 'Солнце',
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'yyyy-MM-dd',
        },
    },
    Popconfirm: {
        confirm: 'подтвердить',
        cancel: 'отмена',
    },
    Navigation: {
        collapseText: 'Свернуть боковую панель',
        expandText: 'Развернуть боковую панель',
    },
    Table: {
        emptyText: 'Нет результата',
        pageText: 'Отображение ${currentStart} до ${currentEnd} из ${total}',
    },
    Select: {
        emptyText: 'Нет результата',
        createText: 'Создать',
    },
    Tree: {
        emptyText: 'Нет результата',
        searchPlaceholder: 'Поиск',
    },
    Cascader: {
        emptyText: 'Нет результата',
    },
    List: {
        emptyText: 'Нет результата',
    },
    Calendar: {
        allDay: 'Весь день',
        AM: '${time} утро',
        PM: '${time} после',
        datestring: '',
        remaining: '${remained} еще',
    },
    Upload: {
        mainText: 'Нажмите, чтобы загрузить файл или перетащите файл сюда',
        illegalTips: 'Этот тип файла не поддерживается',
        legalTips: 'Выпустите и начните загрузку',
        retry: 'Повторить',
        replace: 'Заменить файл',
        clear: 'Очистить',
        selectedFiles: 'Выбранные файлы',
        illegalSize: 'Недопустимый размер файла',
        fail: 'Ошибка загрузки',
    },
    TreeSelect: {
        searchPlaceholder: 'Поиск',
    },
    Typography: {
        copy: 'Копировать',
        copied: 'Скопировано',
        expand: 'Развернуть',
        collapse: 'Свернуть',
    },
    Transfer: {
        emptyLeft: 'Нет данных',
        emptySearch: 'Нет результатов поиска',
        emptyRight: 'Нет содержимого, проверьте слева',
        placeholder: 'Поиск',
        clear: 'Очистить',
        selectAll: 'Выбрать все',
        clearSelectAll: 'Снять выделение',
        total: 'Всего ${total} элементов',
        selected: 'Выбрано ${total} элементов',
    },
    Form: {
        optional: '(по желанию)',
    },
    Image: {
        preview: 'предварительный просмотр',
        loading: 'Загрузка',
        loadError: 'Ошибка загрузки',
        prevTip: 'Предыдущий',
        nextTip: 'Далее',
        zoomInTip: 'Увеличить',
        zoomOutTip: 'уменьшить масштаб',
        rotateTip: 'Повернуть',
        downloadTip: 'скачать',
        adaptiveTip: 'Адаптировать к странице',
        originTip: 'Исходный размер',
    },
};

// [i18n-Russia] 俄罗斯语
export default local;
