import { Anchor, Code, Text } from '@mantine/core';

export const RTL_LANGS = new Set(['ar', 'ckb']);

export const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
  { value: 'ckb', label: 'کوردی' },
  { value: 'fr', label: 'Français' },
];

export const THEME_OPTIONS = [
  { value: 'system', labelKey: 'themeSystem' },
  { value: 'light', labelKey: 'themeLight' },
  { value: 'dark', labelKey: 'themeDark' },
];

function accountsCenterLink() {
  return (
    <Anchor
      href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://accountscenter.instagram.com/info_and_permissions/dyi/
    </Anchor>
  );
}

function instructionsEn() {
  return [
    {
      key: 'ins1',
      node: (
        <>
          <Text span>Open the Accounts Center export page: </Text>
          {accountsCenterLink()}
        </>
      ),
    },
    {
      key: 'ins2',
      node: (
        <>
          <Text span>Go to </Text>
          <Text span fw={700}>
            Download your information
          </Text>
          <Text span> → choose </Text>
          <Text span fw={700}>
            Some of your information
          </Text>
          <Text span> (not “All”).</Text>
        </>
      ),
    },
    {
      key: 'ins3',
      node: (
        <>
          <Text span>In the list of categories, select </Text>
          <Text span fw={700}>
            only
          </Text>
          <Text span> </Text>
          <Text span fw={700}>
            Followers and following
          </Text>
          <Text span>
            {' '}
            (or the checkbox labeled Followers / Followers & Following depending on your UI).{' '}
          </Text>
          <Text span fw={700}>
            Do not select anything else.
          </Text>
        </>
      ),
    },
    {
      key: 'ins4',
      node: (
        <>
          <Text span>Choose </Text>
          <Text span fw={700}>
            JSON
          </Text>
          <Text span> as the format (not HTML), then request the export.</Text>
        </>
      ),
    },
    {
      key: 'ins5',
      node: (
        <>
          <Text span>Wait for Instagram to prepare your download, then download the </Text>
          <Text span fw={700}>
            ZIP
          </Text>
          <Text span> and extract it.</Text>
        </>
      ),
    },
    {
      key: 'ins6',
      node: (
        <>
          <Text span>In this tool, select the extracted folder that contains </Text>
          <Code>connections/followers_and_following/</Code>
          <Text span>.</Text>
        </>
      ),
    },
  ];
}

function instructionsFr() {
  return [
    {
      key: 'ins1',
      node: (
        <>
          <Text span>Ouvrez la page d’export (Accounts Center) : </Text>
          {accountsCenterLink()}
        </>
      ),
    },
    {
      key: 'ins2',
      node: (
        <>
          <Text span>Allez dans </Text>
          <Text span fw={700}>
            Download your information
          </Text>
          <Text span> → choisissez </Text>
          <Text span fw={700}>
            Some of your information
          </Text>
          <Text span> (pas “All”).</Text>
        </>
      ),
    },
    {
      key: 'ins3',
      node: (
        <>
          <Text span>Dans la liste, sélectionnez </Text>
          <Text span fw={700}>
            uniquement
          </Text>
          <Text span> </Text>
          <Text span fw={700}>
            Followers and following
          </Text>
          <Text span>
            {' '}
            (le libellé peut varier).{' '}
          </Text>
          <Text span fw={700}>
            Ne sélectionnez rien d’autre.
          </Text>
        </>
      ),
    },
    {
      key: 'ins4',
      node: (
        <>
          <Text span>Choisissez </Text>
          <Text span fw={700}>
            JSON
          </Text>
          <Text span> comme format (pas HTML), puis demandez l’export.</Text>
        </>
      ),
    },
    {
      key: 'ins5',
      node: (
        <>
          <Text span>Quand le ZIP est prêt, téléchargez-le puis extrayez-le.</Text>
        </>
      ),
    },
    {
      key: 'ins6',
      node: (
        <>
          <Text span>Dans cet outil, sélectionnez le dossier contenant </Text>
          <Code>connections/followers_and_following/</Code>
          <Text span>.</Text>
        </>
      ),
    },
  ];
}

function instructionsAr() {
  return [
    {
      key: 'ins1',
      node: (
        <>
          <Text span>افتح صفحة التصدير في مركز الحسابات: </Text>
          {accountsCenterLink()}
        </>
      ),
    },
    {
      key: 'ins2',
      node: (
        <>
          <Text span>اذهب إلى </Text>
          <Text span fw={700}>
            Download your information
          </Text>
          <Text span> ثم اختر </Text>
          <Text span fw={700}>
            Some of your information
          </Text>
          <Text span> (وليس “All”).</Text>
        </>
      ),
    },
    {
      key: 'ins3',
      node: (
        <>
          <Text span>في قائمة الفئات، حدّد </Text>
          <Text span fw={700}>
            فقط
          </Text>
          <Text span> </Text>
          <Text span fw={700}>
            Followers and following
          </Text>
          <Text span> (قد يختلف الاسم قليلًا حسب الواجهة). </Text>
          <Text span fw={700}>
            لا تحدّد أي خيار آخر.
          </Text>
        </>
      ),
    },
    {
      key: 'ins4',
      node: (
        <>
          <Text span>اختر صيغة </Text>
          <Text span fw={700}>
            JSON
          </Text>
          <Text span> (وليس HTML) ثم اطلب التصدير.</Text>
        </>
      ),
    },
    {
      key: 'ins5',
      node: (
        <>
          <Text span>بعد تجهيز الملف، نزّل </Text>
          <Text span fw={700}>
            ZIP
          </Text>
          <Text span> ثم فك الضغط.</Text>
        </>
      ),
    },
    {
      key: 'ins6',
      node: (
        <>
          <Text span>في هذه الأداة اختر المجلد الذي يحتوي على </Text>
          <Code>connections/followers_and_following/</Code>
          <Text span>.</Text>
        </>
      ),
    },
  ];
}

function instructionsCkb() {
  return [
    {
      key: 'ins1',
      node: (
        <>
          <Text span>پەڕەی دەرکردن (Accounts Center) بکەرەوە: </Text>
          {accountsCenterLink()}
        </>
      ),
    },
    {
      key: 'ins2',
      node: (
        <>
          <Text span>بڕۆ بۆ </Text>
          <Text span fw={700}>
            Download your information
          </Text>
          <Text span> → </Text>
          <Text span fw={700}>
            Some of your information
          </Text>
          <Text span> هەڵبژێرە (نەک “All”).</Text>
        </>
      ),
    },
    {
      key: 'ins3',
      node: (
        <>
          <Text span>لە لیستی بابەتەکان، </Text>
          <Text span fw={700}>
            تەنها
          </Text>
          <Text span> </Text>
          <Text span fw={700}>
            Followers and following
          </Text>
          <Text span> هەڵبژێرە (ناوەکە دەکرێت جیاواز بێت). </Text>
          <Text span fw={700}>
            هیچ شتێکی تر هەڵمەبژێرە.
          </Text>
        </>
      ),
    },
    {
      key: 'ins4',
      node: (
        <>
          <Text span>فۆرمات </Text>
          <Text span fw={700}>
            JSON
          </Text>
          <Text span> هەڵبژێرە (نەک HTML) پاشان داوا بکە.</Text>
        </>
      ),
    },
    {
      key: 'ins5',
      node: (
        <>
          <Text span>کاتێک ئامادە بوو، </Text>
          <Text span fw={700}>
            ZIP
          </Text>
          <Text span> داگرە و پاشان دەر بکە.</Text>
        </>
      ),
    },
    {
      key: 'ins6',
      node: (
        <>
          <Text span>لە ئەم ئامرازەدا فۆڵدەری کە تێیدا ئەمە هەیە هەڵبژێرە </Text>
          <Code>connections/followers_and_following/</Code>
          <Text span>.</Text>
        </>
      ),
    },
  ];
}

function tipNodeEn() {
  return (
    <>
      Tip: export <Code>JSON</Code> and select folder containing{' '}
      <Code>connections/followers_and_following/</Code>.{' '}
      {accountsCenterLink()}
    </>
  );
}

function tipNodeFr() {
  return (
    <>
      Astuce : exportez en <Code>JSON</Code> et sélectionnez le dossier qui contient{' '}
      <Code>connections/followers_and_following/</Code>.{' '}
      {accountsCenterLink()}
    </>
  );
}

function tipNodeAr() {
  return (
    <>
      تلميح: صدّر بصيغة <Code>JSON</Code> ثم اختر المجلد الذي يحتوي على{' '}
      <Code>connections/followers_and_following/</Code>.{' '}
      {accountsCenterLink()}
    </>
  );
}

function tipNodeCkb() {
  return (
    <>
      ئاماژە: بە <Code>JSON</Code> دەر بکە و فۆڵدەری کە ئەمەی تێدایە هەڵبژێرە{' '}
      <Code>connections/followers_and_following/</Code>.{' '}
      {accountsCenterLink()}
    </>
  );
}

export const I18N = {
  en: {
    appTitle: 'Connections Diff',
    appSubtitle: 'Private, offline comparison of followers vs following from your Instagram export.',
    badgeLocal: 'Local',
    badgeNoUpload: 'No uploads',

    aboutTitle: 'What this does',
    aboutLead:
      'Ever followed someone, then later they unfollowed you — and you kept following without noticing? This tool helps you spot that quickly.',
    howItWorksTitle: 'How it works (in your browser)',
    howItWorks: () => [
      { key: 'h1', text: 'Reads the JSON files you select from your device.' },
      { key: 'h2', text: 'Extracts usernames (and available timestamps) from the export.' },
      { key: 'h3', text: 'Computes the differences: not following back, you don\'t follow back, mutuals.' },
      { key: 'h4', text: 'Shows results instantly and lets you copy/download lists.' },
    ],
    privacyNote: 'Nothing is uploaded. Processing stays on your device.',
    langLabel: 'Language',
    themeLabel: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',

    landingTitle: 'Your Privacy Matters',
    landingDescription: 'This tool runs entirely in your browser. Your data never leaves your computer. No data is uploaded to any server.',
    landingOfflineTip: 'For extra peace of mind, you can even turn off your internet connection after the page loads.',
    landingStartBtn: 'Get Started',
    landingPrivateTitle: '100% Private',
    landingPrivateDesc: 'Data stays on your device',
    landingOfflineTitle: 'Offline Ready',
    landingOfflineDesc: 'Works without internet',
    landingSecureTitle: 'Secure',
    landingSecureDesc: 'No server uploads',

    openDownloadPageBtn: 'Open Accounts Center download page',
    downloadHint: 'Export format: JSON (not HTML). Select only Followers and following.',
    instructions: instructionsEn,
    tipNode: tipNodeEn,

    inputTitle: 'Input files',
    pickModeLabel: 'Selection mode',
    pickModeFolder: 'Folder',
    pickModeFiles: 'Files',
    folderPickLabel: 'Select extracted export folder (recommended)',
    folderPickHint: 'If folder selection is not supported, use the file inputs below.',
    followersFilesLabel: 'Followers JSON file(s) (followers_1.json, followers_2.json, …)',
    followingFileLabel: 'Following JSON file (following.json)',
    parseComputeBtn: 'Parse + Compute',

    resultsTitle: 'Results',
    modeCards: 'Cards',
    modeRaw: 'Raw',
    copyListBtn: 'Copy list',
    copied: 'Copied',
    copy: 'Copy',
    visitProfile: 'Visit profile',
    youFollowedSince: 'You followed',
    theyFollowedSince: 'Follows you since',
    requestedSince: 'Requested on',
    emptyList: 'Nothing to show for this list.',
    sortLabel: 'Sort',
    sortOriginal: 'Original',
    sortAlphaAsc: 'A → Z',
    sortAlphaDesc: 'Z → A',
    sortDateAsc: 'Date ↑',
    sortDateDesc: 'Date ↓',
    onlyWithDate: 'Only with date',
    searchPlaceholder: 'Filter by username',

    downloadNotBackBtn: 'Download not_following_back.txt',
    downloadYouDontBtn: 'Download you_dont_follow_back.txt',
    downloadMutualsBtn: 'Download mutuals.txt',

    viewNotFollowingBackBtn: 'Not following back',
    viewYouDontFollowBackBtn: "You don't follow back",
    viewMutualsBtn: 'Mutuals',
    viewPendingBtn: 'Pending requests',
    viewFollowersBtn: 'All followers',
    viewFollowingBtn: 'All following',
    viewUnknown: 'View',

    outputPlaceholder: 'Output will appear here…',

    statusWaiting: 'Waiting for input…',
    statusWorking: 'Working…',
    statusReadingFiles: 'Reading files…',
    statusParsingFollowers: 'Parsing followers ({n} file(s)) + following (1 file)…',
    statusDone: 'Done. Your data stayed in the browser.',

    statsFollowers: 'Followers',
    statsFollowing: 'Following',
    statsPending: 'Pending requests',
    statsNotFollowingBack: 'Not following back',
    statsYouDontFollowBack: "You don't follow back",
    statsMutuals: 'Mutuals',

    errParseJson: 'Failed to parse JSON: {name}',
    errNoFollowers: 'No followers JSON found/selected. Choose the extracted folder or select followers_*.json.',
    errNoFollowing: 'No following JSON found/selected. Choose the extracted folder or select following.json.',
  },
  fr: {
    appTitle: 'Connections Diff',
    appSubtitle:
      'Comparaison privée et hors ligne des abonnés/abonnements à partir de votre export Instagram.',
    badgeLocal: 'Local',
    badgeNoUpload: 'Sans envoi',

    aboutTitle: 'À quoi ça sert',
    aboutLead:
      'Vous avez déjà suivi quelqu\'un puis, plus tard, cette personne ne vous suit plus — et vous continuez à la suivre sans vous en rendre compte ? Cet outil aide à le voir rapidement.',
    howItWorksTitle: 'Comment ça marche (dans votre navigateur)',
    howItWorks: () => [
      { key: 'h1', text: 'Lit les fichiers JSON que vous sélectionnez sur votre appareil.' },
      { key: 'h2', text: 'Extrait les noms d\'utilisateur (et les dates quand disponibles) depuis l\'export.' },
      { key: 'h3', text: 'Calcule les différences : ne vous suivent pas, vous ne suivez pas, mutuels.' },
      { key: 'h4', text: 'Affiche les résultats et permet de copier/télécharger les listes.' },
    ],
    privacyNote: 'Aucun envoi : tout reste sur votre appareil.',
    langLabel: 'Langue',
    themeLabel: 'Thème',
    themeSystem: 'Système',
    themeLight: 'Clair',
    themeDark: 'Sombre',

    landingTitle: 'Votre vie privée est importante',
    landingDescription: 'Cet outil fonctionne entièrement dans votre navigateur. Vos données ne quittent jamais votre ordinateur. Aucune donnée n\'est téléchargée sur un serveur.',
    landingOfflineTip: 'Pour plus de tranquillité d\'esprit, vous pouvez même couper votre connexion internet après le chargement de la page.',
    landingStartBtn: 'Commencer',
    landingPrivateTitle: '100% Privé',
    landingPrivateDesc: 'Les données restent sur votre appareil',
    landingOfflineTitle: 'Prêt pour le hors-ligne',
    landingOfflineDesc: 'Fonctionne sans internet',
    landingSecureTitle: 'Sécurisé',
    landingSecureDesc: 'Aucun envoi sur serveur',

    openDownloadPageBtn: 'Ouvrir la page de téléchargement (Accounts Center)',
    downloadHint: "Format d’export : JSON (pas HTML). Sélectionnez uniquement Abonnés et abonnements.",
    instructions: instructionsFr,
    tipNode: tipNodeFr,

    inputTitle: 'Fichiers',
    pickModeLabel: 'Mode de sélection',
    pickModeFolder: 'Dossier',
    pickModeFiles: 'Fichiers',
    folderPickLabel: 'Sélectionner le dossier extrait (recommandé)',
    folderPickHint: "Si la sélection de dossier n’est pas disponible, utilisez les fichiers ci-dessous.",
    followersFilesLabel: 'Fichier(s) JSON des abonnés (followers_1.json, followers_2.json, …)',
    followingFileLabel: 'Fichier JSON des abonnements (following.json)',
    parseComputeBtn: 'Analyser + Calculer',

    resultsTitle: 'Résultats',
    modeCards: 'Cartes',
    modeRaw: 'Brut',
    copyListBtn: 'Copier la liste',
    copied: 'Copié',
    copy: 'Copier',
    visitProfile: 'Visiter le profil',
    youFollowedSince: 'Vous suivez depuis',
    theyFollowedSince: 'Vous suit depuis',
    requestedSince: 'Demandée le',
    emptyList: 'Rien à afficher pour cette liste.',
    sortLabel: 'Tri',
    sortOriginal: 'Original',
    sortAlphaAsc: 'A → Z',
    sortAlphaDesc: 'Z → A',
    sortDateAsc: 'Date ↑',
    sortDateDesc: 'Date ↓',
    onlyWithDate: 'فقط مع تاريخ',
    searchPlaceholder: 'Filtrer par nom d\'utilisateur',

    downloadNotBackBtn: 'Télécharger not_following_back.txt',
    downloadYouDontBtn: 'Télécharger you_dont_follow_back.txt',
    downloadMutualsBtn: 'Télécharger mutuals.txt',

    viewNotFollowingBackBtn: 'Ne vous suivent pas',
    viewYouDontFollowBackBtn: 'Vous ne suivez pas',
    viewMutualsBtn: 'Mutuels',
    viewPendingBtn: 'Demandes en attente',
    viewFollowersBtn: 'Tous les abonnés',
    viewFollowingBtn: 'Tous les abonnements',
    viewUnknown: 'Voir',

    outputPlaceholder: 'Le résultat apparaîtra ici…',

    statusWaiting: 'En attente…',
    statusWorking: 'Traitement…',
    statusReadingFiles: 'Lecture des fichiers…',
    statusParsingFollowers: 'Analyse des abonnés ({n} fichier(s)) + abonnements (1 fichier)…',
    statusDone: 'Terminé. Vos données restent dans le navigateur.',

    statsFollowers: 'Abonnés',
    statsFollowing: 'Abonnements',
    statsPending: 'Demandes en attente',
    statsNotFollowingBack: 'Ne vous suivent pas',
    statsYouDontFollowBack: 'Vous ne suivez pas',
    statsMutuals: 'Mutuels',

    errParseJson: 'Impossible de lire le JSON : {name}',
    errNoFollowers:
      "Aucun fichier JSON d’abonnés sélectionné. Choisissez le dossier extrait ou sélectionnez followers_*.json.",
    errNoFollowing:
      "Aucun fichier JSON d’abonnements sélectionné. Choisissez le dossier extrait ou sélectionnez following.json.",
  },
  ar: {
    appTitle: 'Connections Diff',
    appSubtitle: 'مقارنة خاصة وبدون إنترنت بين المتابعين والمتابَعين من ملف تصدير إنستغرام.',
    badgeLocal: 'محلي',
    badgeNoUpload: 'بدون رفع',

    aboutTitle: 'ماذا يفعل هذا التطبيق؟',
    aboutLead:
      'هل مرّ بك موقف أن تتابع شخصًا ثم بعد فترة يلغي متابعتك، وتبقى تتابعه بدون أن تنتبه؟ هذا التطبيق يساعدك على اكتشاف ذلك بسرعة وبشكل واضح.',
    howItWorksTitle: 'كيف يعمل (داخل المتصفح)',
    howItWorks: () => [
      { key: 'h1', text: 'يقرأ ملفات JSON التي تختارها من جهازك.' },
      { key: 'h2', text: 'يستخرج أسماء المستخدمين (وأحيانًا التواريخ إن كانت موجودة في التصدير).' },
      { key: 'h3', text: 'يحسب القوائم: لا يتابعونك، أنت لا تتابعهم، متبادلون.' },
      { key: 'h4', text: 'يعرض النتائج فورًا ويتيح النسخ/التحميل.' },
    ],
    privacyNote: 'لا يتم رفع أي شيء. كل المعالجة تتم على جهازك.',
    langLabel: 'اللغة',
    themeLabel: 'المظهر',
    themeSystem: 'حسب النظام',
    themeLight: 'فاتح',
    themeDark: 'داكن',

    landingTitle: 'خصوصيتك تهمنا',
    landingDescription: 'هذه الأداة تعمل بالكامل في متصفحك. بياناتك لا تغادر جهاز الكمبيوتر الخاص بك أبدًا. لا يتم رفع أي بيانات إلى أي خادم.',
    landingOfflineTip: 'لمزيد من الاطمئنان، يمكنك حتى إيقاف اتصالك بالإنترنت بعد تحميل الصفحة.',
    landingStartBtn: 'ابدأ الآن',
    landingPrivateTitle: 'خصوصية 100%',
    landingPrivateDesc: 'بياناتك تبقى على جهازك',
    landingOfflineTitle: 'يعمل بدون إنترنت',
    landingOfflineDesc: 'لا يحتاج لاتصال بالشبكة',
    landingSecureTitle: 'آمن',
    landingSecureDesc: 'لا يتم رفع أي بيانات',

    openDownloadPageBtn: 'فتح صفحة التنزيل (مركز الحسابات)',
    downloadHint: 'صيغة التصدير: JSON (وليس HTML). حدّد فقط المتابعين والمتابَعين.',
    instructions: instructionsAr,
    tipNode: tipNodeAr,

    inputTitle: 'الملفات',
    pickModeLabel: 'طريقة الاختيار',
    pickModeFolder: 'مجلد',
    pickModeFiles: 'ملفات',
    folderPickLabel: 'اختر مجلد التصدير بعد فك الضغط (مُفضّل)',
    folderPickHint: 'إذا لم يدعم المتصفح اختيار المجلد، استخدم اختيار الملفات أدناه.',
    followersFilesLabel: 'ملف/ملفات JSON للمتابعين (followers_1.json, followers_2.json, …)',
    followingFileLabel: 'ملف JSON للمتابَعين (following.json)',
    parseComputeBtn: 'تحليل + حساب',

    resultsTitle: 'النتائج',
    modeCards: 'بطاقات',
    modeRaw: 'نص خام',
    copyListBtn: 'نسخ القائمة',
    copied: 'تم النسخ',
    copy: 'نسخ',
    visitProfile: 'زيارة الملف الشخصي',
    youFollowedSince: 'أنت تتابع منذ',
    theyFollowedSince: 'يتابعك منذ',
    requestedSince: 'طُلِب في',
    emptyList: 'لا يوجد عناصر لعرضها.',
    sortLabel: 'فرز',
    sortOriginal: 'الأصلي',
    sortAlphaAsc: 'أ → ي',
    sortAlphaDesc: 'ي → أ',
    sortDateAsc: 'التاريخ ↑',
    sortDateDesc: 'التاريخ ↓',
    onlyWithDate: 'فقط مع تاريخ',
    searchPlaceholder: 'تصفية بالاسم',

    downloadNotBackBtn: 'تنزيل not_following_back.txt',
    downloadYouDontBtn: 'تنزيل you_dont_follow_back.txt',
    downloadMutualsBtn: 'تنزيل mutuals.txt',

    viewNotFollowingBackBtn: 'لا يتابعونك',
    viewYouDontFollowBackBtn: 'أنت لا تتابعهم',
    viewMutualsBtn: 'متبادلون',
    viewPendingBtn: 'طلبات معلقة',
    viewFollowersBtn: 'كل المتابعين',
    viewFollowingBtn: 'كل المتابَعين',    viewUnknown: 'عرض',
    outputPlaceholder: 'سيظهر الناتج هنا…',

    statusWaiting: 'بانتظار الاختيار…',
    statusWorking: 'جارٍ العمل…',
    statusReadingFiles: 'جارٍ قراءة الملفات…',
    statusParsingFollowers: 'جارٍ تحليل المتابعين ({n} ملف/ملفات) + المتابَعين (ملف واحد)…',
    statusDone: 'تم. بياناتك بقيت داخل المتصفح.',

    statsFollowers: 'المتابعون',
    statsFollowing: 'المتابَعون',
    statsPending: 'الطلبات المعلقة',
    statsNotFollowingBack: 'لا يتابعونك',
    statsYouDontFollowBack: 'أنت لا تتابعهم',
    statsMutuals: 'متبادلون',

    errParseJson: 'فشل تحليل JSON: {name}',
    errNoFollowers: 'لم يتم العثور على ملف JSON للمتابعين. اختر المجلد أو حدّد followers_*.json.',
    errNoFollowing: 'لم يتم العثور على ملف JSON للمتابَعين. اختر المجلد أو حدّد following.json.',
  },
  ckb: {
    appTitle: 'Connections Diff',
    appSubtitle: 'بە شێوەی نهێنی و بێ ئینتەرنێت فۆڵۆوەر/شوێنکەوتن لەسەر داتای دەرکراوی Instagram دەکات.',
    badgeLocal: 'ناوخۆ',
    badgeNoUpload: 'بێ ناردن',

    aboutTitle: 'ئەمە چی دەکات؟',
    aboutLead:
      'هەندێ جار تۆ کەسێک شوێن دەکەویت، دوای ماوەیەک ئەو کەسە شوێنت ناکەوێت، و تۆ هەر بەردەوام دەبیت لە شوێنکەوتن. ئەم ئامرازە یارمەتیت دەدات زوو بزانیت.',
    howItWorksTitle: 'چۆن کار دەکات (لە ناو وێبگەڕ)',
    howItWorks: () => [
      { key: 'h1', text: 'فایلەکانی JSON ی هەڵبژێردراو لەسەر ئامێرەکەت دەخوێنێتەوە.' },
      { key: 'h2', text: 'ناوی بەکارهێنەر (و کات/ڕێکەوت ئەگەر هەبوو) دەهێنێت لە دەرکراوەکەوە.' },
      { key: 'h3', text: 'جیاوازیەکان دەکات: لەگەڵت ناین، تۆ نایتەوێت، هاوبەش.' },
      { key: 'h4', text: 'ئەنجامەکان دەردەخات و دەتوانیت کۆپی/داگرتن بکەیت.' },
    ],
    privacyNote: 'هیچ شتێک نانێردرێت. هەموو پرۆسەکردن لەسەر ئامێرەکەتە.',
    langLabel: 'زمان',
    themeLabel: 'ڕووکار',
    themeSystem: 'سیستەم',
    themeLight: 'ڕووناک',
    themeDark: 'تاریک',

    landingTitle: 'پاراستنی تایبەتمەندییەکانت گرنگە',
    landingDescription: 'ئەم ئامرازە بە تەواوی لە وێبگەڕەکەتدا کاردەکات. داتاکانت هەرگیز کۆمپیوتەرەکەت جێناهێڵن. هیچ داتایەک بۆ هیچ سێرڤەرێک بەرزناکرێتەوە.',
    landingOfflineTip: 'بۆ دڵنیایی زیاتر، دەتوانیت تەنانەت پەیوەندی ئینتەرنێتەکەت بکوژێنیتەوە دوای ئەوەی لاپەڕەکە بارکرا.',
    landingStartBtn: 'دەستپێبکە',
    landingPrivateTitle: '100% نهێنی',
    landingPrivateDesc: 'داتاکان لەسەر ئامێرەکەت دەمێننەوە',
    landingOfflineTitle: 'ئامادەیە بۆ بێ ئینتەرنێت',
    landingOfflineDesc: 'بەبێ ئینتەرنێت کاردەکات',
    landingSecureTitle: 'پارێزراو',
    landingSecureDesc: 'هیچ ناردنێک بۆ سێرڤەر نییە',

    openDownloadPageBtn: 'کردنەوەی پەڕەی داگرتن (Accounts Center)',
    downloadHint: 'فۆرمات: JSON (نەک HTML). تەنها Followers and following هەڵبژێرە.',
    instructions: instructionsCkb,
    tipNode: tipNodeCkb,

    inputTitle: 'فایلەکان',
    pickModeLabel: 'شێوازی هەڵبژاردن',
    pickModeFolder: 'فۆڵدەر',
    pickModeFiles: 'فایلەکان',
    folderPickLabel: 'فۆڵدەری دەرکراوە هەڵبژێرە (باشترە)',
    folderPickHint: 'ئەگەر هەڵبژاردنی فۆڵدەر پشتگیری نەکرا، فایل هەڵبژێرە.',
    followersFilesLabel: 'فایلی/فایلەکانی JSON ی فۆڵۆوەرەکان (followers_1.json, followers_2.json, …)',
    followingFileLabel: 'فایلی JSON ی شوێنکەوتن (following.json)',
    parseComputeBtn: 'خوێندنەوە + هەژمارکردن',

    resultsTitle: 'ئەنجامەکان',
    modeCards: 'کارتەکان',
    modeRaw: 'دەقی خام',
    copyListBtn: 'کۆپی کردنی لیست',
    copied: 'کۆپی کرا',
    copy: 'کۆپی',
    visitProfile: 'سەردانی پرۆفایل',
    youFollowedSince: 'تۆ شوێن دەکەویت لە',
    theyFollowedSince: 'شوێنت دەکەوێت لە',
    requestedSince: 'داواکرا لە',
    emptyList: 'هیچ شتێک نییە بۆ پیشاندان.',
    sortLabel: 'داڕێژە',
    sortOriginal: 'سەرەتایی',
    sortAlphaAsc: 'A → Z',
    sortAlphaDesc: 'Z → A',
    sortDateAsc: 'بڕگە ↑',
    sortDateDesc: 'بڕگە ↓',
    onlyWithDate: 'تەنها بەڕووكەوت',
    searchPlaceholder: 'گەڕان بە ناوی بەکارهێنەر',

    downloadNotBackBtn: 'داگرتنی not_following_back.txt',
    downloadYouDontBtn: 'داگرتنی you_dont_follow_back.txt',
    downloadMutualsBtn: 'داگرتنی mutuals.txt',

    viewNotFollowingBackBtn: 'لەگەڵت ناین',
    viewYouDontFollowBackBtn: 'تۆ نایتەوێت',
    viewMutualsBtn: 'هاوبەش',
    viewPendingBtn: 'داواکارییە وەستانەکان',
    viewFollowersBtn: 'هەموو فۆڵۆوەرەکان',
    viewFollowingBtn: 'هەموو شوێنکەوتنەکان',

    outputPlaceholder: 'ئەنجام لێرە دەردەکەوێت…',

    statusWaiting: 'چاوەڕوانی…',
    statusWorking: 'لە کاردایە…',
    statusReadingFiles: 'خوێندنەوەی فایلەکان…',
    statusParsingFollowers: 'خوێندنەوەی فۆڵۆوەرەکان ({n} فایل) + شوێنکەوتن (1 فایل)…',
    statusDone: 'تەواو. داتاکەت لە ناو وێبگەڕدا مایەوە.',

    statsFollowers: 'فۆڵۆوەرەکان',
    statsFollowing: 'شوێنکەوتن',
    statsPending: 'داواکارییە وەستانەکان',
    statsNotFollowingBack: 'لەگەڵت ناین',
    statsYouDontFollowBack: 'تۆ نایتەوێت',
    statsMutuals: 'هاوبەش',

    errParseJson: 'نەتوانرا JSON بخوێندرێتەوە: {name}',
    errNoFollowers: 'هیچ فایلی فۆڵۆوەر نەدۆزرایەوە. فۆڵدەر یان followers_*.json هەڵبژێرە.',
    errNoFollowing: 'هیچ فایلی شوێنکەوتن نەدۆزرایەوە. فۆڵدەر یان following.json هەڵبژێرە.',
  },
};

export function getInitialLang(savedLang) {
  if (savedLang && savedLang in I18N) return savedLang;
  const nav = (navigator.language || 'en').toLowerCase();
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('ar')) return 'ar';
  if (nav.startsWith('ckb') || nav.startsWith('ku')) return 'ckb';
  return 'en';
}

export function createT(lang) {
  const table = I18N[lang] || I18N.en;
  const fallback = I18N.en;

  return function t(key, vars) {
    let value = key in table ? table[key] : fallback[key];

    if (typeof value === 'function') value = value();

    if (typeof value === 'string') {
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replaceAll(`{${k}}`, String(v));
        }
      }
      return value;
    }

    return value;
  };
}
