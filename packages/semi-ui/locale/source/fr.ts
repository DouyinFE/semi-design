import { fr } from 'date-fns/locale';
import { Locale } from '../interface';

const local: Locale = {
    code: 'fr',
    dateFnsLocale: fr,
    Pagination: {
        item: 'article',
        pageSize: ' articles/page',
        page: ' pages',
        total: '',
        jumpTo: 'Sauter à'
    },
    Modal: {
        confirm: 'Confirmer',
        cancel: 'Annuler',
    },
    TimePicker: {
        placeholder: {
            time: 'Sélectionner temps',
            timeRange: 'Sélectionner une période de temps',
        },
        begin: 'Heure de début',
        end: 'Heure de fin',
        hour: '',
        minute: '',
        second: '',
        AM: 'AM',
        PM: 'PM',
    },
    DatePicker: {
        placeholder: {
            date: 'Sélectionner date',
            dateTime: 'Sélectionner date et temps',
            dateRange: ['Date de début', 'Date de fin'],
            dateTimeRange: ['Date de début', 'Date de fin'],
        },
        footer: {
            confirm: 'Confirmer',
            cancel: 'Annuler',
        },
        selectDate: 'Sélectionner date',
        selectTime: 'Sélectionner temps',
        year: 'année',
        month: 'mois',
        day: 'jour',
        monthText: '${month} ${year}',
        months: {
            1: 'janv.',
            2: 'févr.',
            3: 'mars',
            4: 'avr.',
            5: 'mai',
            6: 'juin',
            7: 'juill.',
            8: 'août',
            9: 'sept.',
            10: 'oct.',
            11: 'nov.',
            12: 'déc.',
        },
        fullMonths: {
            1: 'janvier',
            2: 'février',
            3: 'mars',
            4: 'avril',
            5: 'mai',
            6: 'juin',
            7: 'juillet',
            8: 'août',
            9: 'septembre',
            10: 'octobre',
            11: 'novembre',
            12: 'décembre',
        },
        weeks: {
            Mon: 'lun.',
            Tue: 'mar.',
            Wed: 'mer.',
            Thu: 'jeu.',
            Fri: 'ven.',
            Sat: 'sam.',
            Sun: 'dim.',
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'yyyy-MM-dd',
        },
    },
    Popconfirm: {
        confirm: 'Confirmer',
        cancel: 'Annuler',
    },
    Navigation: {
        collapseText: 'Comprimer la barre latérale',
        expandText: 'Étendre la barre latérale',
    },
    Table: {
        emptyText: 'Aucun Résultat',
        pageText: 'Montrant ${currentStart} to ${currentEnd} of ${total}',
    },
    Select: {
        emptyText: 'Aucun Résultat',
        createText: 'Créer',
    },
    Tree: {
        emptyText: 'Aucun Résultat',
        searchPlaceholder: 'Recherche',
    },
    Cascader: {
        emptyText: 'Aucun Résultat',
    },
    List: {
        emptyText: 'Aucun Résultat',
    },
    Calendar: {
        allDay: ' Toute la journée',
        AM: '${time} AM',
        PM: '${time} PM',
        datestring: '',
        remaining: '${remained} plus',
    },
    Upload: {
        mainText: 'Cliquez pour télécharger le fichier ou faites glisser le fichier vers ici',
        illegalTips: 'Ce type de fichier n\'est pas pris en charge',
        legalTips: 'Libérer et commencer le chargement',
        retry: 'Réessayer',
        replace: 'Remplacer le fichier',
        clear: 'Supprimer',
        selectedFiles: 'Fichiers sélectionnés',
        illegalSize: 'Taille de fichier erronée',
        fail: 'Échec du chargement',
    },
    TreeSelect: {
        searchPlaceholder: 'Recherche',
    },
    Typography: {
        copy: 'Copier',
        copied: 'Copié',
        expand: 'Étendre',
        collapse: 'Comprimer',
    },
    Transfer: {
        emptyLeft: 'Aucune Donnée',
        emptySearch: 'Aucun résultat n\'a été trouvé',
        emptyRight: 'Pas de contenu, vérification à gauche',
        placeholder: 'Recherche',
        clear: 'Supprimer',
        selectAll: 'Sélectionner tout',
        clearSelectAll: 'Désélectionner tout',
        total: 'Totale ${total} articles',
        selected: '${total} articles sélectionnés',
    },
    Form: {
        optional: '(optionnel)',
    },
};

// [i18n-French]
export default local;
