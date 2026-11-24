import { tr } from 'date-fns/locale';
import { Locale } from '../interface';

const local: Locale = {
    code: 'tr-TR',
    dateFnsLocale: tr,
    currency: 'TRY',
    Pagination: {
        page: '',
        pageSize: 'Sayfa başı öğe: ${pageSize}',
        total: 'Toplam sayfa: ${total}',
        jumpTo: 'Sayfaya git'
    },
    Modal: {
        confirm: 'Tamam',
        cancel: 'İptal',
        close: 'Kapat',
    },
    Banner: {
        close: 'Kapat',
    },
    Tabs: {
        close: 'Kapat',
        more: "Daha fazla"
    },
    TimePicker: {
        placeholder: {
            time: 'Lütfen bir zaman seçin',
            timeRange: 'Lütfen bir zaman aralığı seçin'
        },
        begin: 'Başlangıç zamanı',
        end: 'Bitiş zamanı',
        hour: '',
        minute: '',
        second: '',
        AM: 'ÖÖ',
        PM: 'ÖS'
    },
    DatePicker: {
        placeholder: {
            date: 'Lütfen bir tarih seçin',
            dateTime: 'Lütfen bir tarih ve saat seçin',
            dateRange: ['Başlangıç tarihi', 'Bitiş tarihi'],
            dateTimeRange: ['Başlangıç tarihi', 'Bitiş tarihi'],
            monthRange: ['Başlangıç ayı', 'Bitiş ayı']
        },
        presets: 'Hızlı seçim',
        footer: {
            confirm: 'Tamam',
            cancel: 'İptal'
        },
        selectDate: 'Tarih seçin',
        selectTime: 'Saat seçin',
        year: 'yıl',
        month: 'ay',
        day: 'gün',
        monthText: '${month} ${year}',
        months:
        {
            1: 'Ocak',
            2: 'Şubat',
            3: 'Mart',
            4: 'Nisan',
            5: 'Mayıs',
            6: 'Haziran',
            7: 'Temmuz',
            8: 'Ağustos',
            9: 'Eylül',
            10: 'Ekim',
            11: 'Kasım',
            12: 'Aralık',
        },
        fullMonths: {
            1: 'Ocak',
            2: 'Şubat',
            3: 'Mart',
            4: 'Nisan',
            5: 'Mayıs',
            6: 'Haziran',
            7: 'Temmuz',
            8: 'Ağustos',
            9: 'Eylül',
            10: 'Ekim',
            11: 'Kasım',
            12: 'Aralık'
        },
        weeks: {
            Mon: 'Pzt',
            Tue: 'Sal',
            Wed: 'Çar',
            Thu: 'Per',
            Fri: 'Cum',
            Sat: 'Cmt',
            Sun: 'Paz'
        },
        localeFormatToken: {
            FORMAT_SWITCH_DATE: 'dd.MM.yyyy',
        },
    },
    Navigation:
    {
        collapseText: 'Kenar çubuğunu daralt',
        expandText: 'Kenar çubuğunu genişlet'
    },
    Popconfirm: {
        confirm: 'Tamam',
        cancel: 'İptal'
    },
    Table:
    {
        emptyText: 'Henüz veri yok',
        pageText:
            '${total} öğeden ${currentStart}-${currentEnd} arası gösteriliyor',
        descend: 'Azalan sıralama için tıklayın',
        ascend: 'Artan sıralama için tıklayın',
        cancelSort: 'Sıralamayı iptal et',
        confirmFilter: 'Tamam',
        resetFilter: 'Sıfırla',
    },
    Select: { emptyText: 'Henüz veri yok', createText: 'Oluştur' },
    Cascader: { emptyText: 'Henüz veri yok' },
    Tree: { emptyText: 'Henüz veri yok', searchPlaceholder: 'Ara' },
    List: { emptyText: 'Henüz veri yok' },
    Calendar:
    {
        allDay: 'Tüm gün',
        AM: 'ÖÖ ${time}',
        PM: 'ÖS ${time}',
        datestring: '',
        remaining: '${remained} tane daha'
    },
    Upload:
    {
        mainText:
            'Dosya yüklemek için tıklayın veya dosyayı buraya sürükleyin',
        illegalTips: 'Bu dosya türü desteklenmiyor',
        legalTips: 'Yüklemeyi başlatmak için bırakın',
        retry: 'Yeniden dene',
        replace: 'Dosyayı değiştir',
        clear: 'Temizle',
        selectedFiles: 'Seçili dosyalar',
        illegalSize: 'Dosya boyutu geçersiz',
        fail: 'Yükleme başarısız',
        cropTitle: 'Resmi kırp',
        cropOk: 'Tamam',
        cropCancel: 'İptal',
    },
    TreeSelect: { searchPlaceholder: 'Ara' },
    Typography:
    {
        copy: 'Kopyala',
        copied: 'Kopyalandı',
        expand: 'Genişlet',
        collapse: 'Daralt'
    },
    Transfer:
    {
        emptyLeft: 'Henüz veri yok',
        emptySearch: 'Arama sonucu yok',
        emptyRight: 'İçerik yok, soldan seçin',
        placeholder: 'Ara',
        clear: 'Temizle',
        selectAll: 'Tümünü seç',
        clearSelectAll: 'Tümünün seçimini kaldır',
        total: 'Toplam öğe: ${total}',
        selected: 'Seçilen öğeler: ${total}'
    },
    Form: {
        optional: '(isteğe bağlı)',
    },
    Image: {
        preview: 'Önizleme',
        loading: 'Yükleniyor',
        loadError: 'Yükleme başarısız',
        prevTip: 'Önceki',
        nextTip: 'Sonraki',
        zoomInTip: 'Yakınlaştır',
        zoomOutTip: 'Uzaklaştır',
        rotateTip: 'Döndür',
        downloadTip: 'İndir',
        adaptiveTip: 'Sayfaya uyarla',
        originTip: 'Orijinal boyut',
    },
    Chat: {
        deleteConfirm: 'Bu sohbeti silmek istediğinize emin misiniz?',
        clearContext: 'Bağlam temizlendi',
        copySuccess: 'Başarıyla kopyalandı',
        stop: 'Durdur',
        copy: 'Kopyala',
        copied: 'Kopyalandı',
        dropAreaText: 'Dosyayı buraya bırakın',
    },
    UserGuide: {
        skip: 'Atla',
        next: 'Sonraki',
        prev: 'Önceki',
        finish: 'Tamamla',
    },
    InputNumber: {},
    JsonViewer: {
        search: 'Ara',
        replace: 'Değiştir',
        replaceAll: 'Tümünü değiştir',
    },
    VideoPlayer: {
        rateChange: 'Hız: ${rate}',
        qualityChange: 'Kalite: ${quality}',
        routeChange: 'Kaynak: ${route}',
        mirror: 'Ayna',
        cancelMirror: 'Aynayı kaldır',
        loading: 'Yükleniyor...',
        stall: 'Yükleme başarısız',
        noResource: 'Kaynak yok',
        videoError: 'Video yükleme hatası'
    },
    AIChatDialogue: {
        delete: 'Sil',
        deleteConfirm: 'Bu mesajı silmek istediğinizden emin misiniz?',
        deleteContent: 'Bu mesaj kalıcı olarak silinecek ve geri getirilemeyecek.',
        copySuccess: 'Başarıyla kopyalandı',
        loading: 'Yükleniyor...',
        reasoning: {
            completed: 'Düşünme tamamlandı',
            thinking: 'Düşünüyor...'
        },
        annotationText: 'kaynak'
    },
    Feedback: {
        placeholder: 'Ek geri bildirim sağlayın',
        optionalPlaceholder: 'Ek geri bildirim sağlayın (isteğe bağlı)',
        submit: 'Gönder',
        cancel: 'İptal'
    },
    AIChatInput: {
        template: 'Şablon',
        configure: 'Yapılandır',
        selected: '${count} öğe seçildi',
    },
    Sidebar: {
        close: 'Kapat',
        linkAddSuccess: 'Bağlantı başarıyla eklendi',
        linkRemoveSuccess: 'Bağlantı başarıyla silindi',
        enterLinkAddress: "Bağlantı adresini girin",
        validateFailInfo: 'Doğrulama başarısız, lütfen tekrar yükleyin',
        uploadFailInfo: 'Yükleme başarısız, lütfen tekrar deneyin',
        uploadImgInfo: 'Resim yüklemek için tıklayın veya buraya sürükleyin',
        defaultMcpInfo: "Hazır MCP, kapatılamaz",
        searchPlaceholder: 'Lütfen girin',
        emptyCustomMcpInfo: 'Henüz özel MCP yok',
        newMcpAdd: 'Özel MCP',
        mcpConfigure: 'MCP Yapılandırması',
        annotationTitle: 'Kaynaklar',
        activeMCPNumber: 'Etkin MCP sayısı:',
        copySuccess: 'Başarıyla kopyalandı',
    },
    AudioPlayer: {
        backward: '${skipDuration} sn geri',
        forward: '${skipDuration} sn ileri',
        prev: 'Önceki',
        next: 'Sonraki',
        loop: 'Döngü',
        volume: 'Ses',
        mediaError: 'Ses yükleme hatası'
    }
};

// [i18n-Turkish]
export default local;
