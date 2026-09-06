/* محتوى المنصة — نسخة العرض التصميمي */

export type PlateVariant = "khatam" | "rosette" | "girih" | "zellij" | "arabesque" | "shamsa";
export type PaletteName = "lapis" | "olive" | "saffron" | "madder" | "turq" | "night";

export interface Series {
  id: string;
  title: string;
  book: string;
  status: "جارية" | "مكتملة" | "متوقفة";
  level: string;
  lessons: number;
  done: number;
  hours: string;
  axes: string[];
  variant: PlateVariant;
  palette: PaletteName;
  lastLesson?: string;
}

export const seriesList: Series[] = [
  {
    id: "s-bukhari",
    title: "شرح صحيح البخاري",
    book: "صحيح الإمام البخاري",
    status: "جارية",
    level: "متقدّم",
    lessons: 128,
    done: 84,
    hours: "٨٦ ساعة",
    axes: ["كتاب الإيمان", "كتاب العلم", "كتاب الصلاة"],
    variant: "khatam",
    palette: "lapis",
    lastLesson: "الدرس ٨٤ — كتاب العلم، بابُ الاغتباط في العلم والحكمة",
  },
  {
    id: "s-riyad",
    title: "رياض الصالحين",
    book: "رياض الصالحين للنووي",
    status: "جارية",
    level: "مبتدئ",
    lessons: 42,
    done: 17,
    hours: "٢٤ ساعة",
    axes: ["الإخلاص", "الصبر", "الأذكار"],
    variant: "rosette",
    palette: "olive",
    lastLesson: "الدرس ١٧ — بابُ الصبر",
  },
  {
    id: "s-tahawi",
    title: "العقيدة الطحاوية",
    book: "متن الطحاوية",
    status: "مكتملة",
    level: "متوسّط",
    lessons: 24,
    done: 24,
    hours: "١٨ ساعة",
    axes: ["توحيد الربوبية", "الأسماء والصفات", "القدر"],
    variant: "girih",
    palette: "saffron",
  },
  {
    id: "s-nawawi",
    title: "الأربعون النووية",
    book: "الأربعون للنووي",
    status: "مكتملة",
    level: "مبتدئ",
    lessons: 18,
    done: 18,
    hours: "١٢ ساعة",
    axes: ["جوامع الكلم", "قواعد فقهية", "الآداب"],
    variant: "zellij",
    palette: "turq",
  },
  {
    id: "s-tafsir",
    title: "أصول التفسير",
    book: "مقدمة في أصول التفسير",
    status: "جارية",
    level: "متقدّم",
    lessons: 16,
    done: 4,
    hours: "١٤ ساعة",
    axes: ["التفسير بالمأثور", "أسباب النزول", "المكي والمدني"],
    variant: "arabesque",
    palette: "madder",
    lastLesson: "الدرس ٤ — التفسير بالمأثور ومراتبه",
  },
  {
    id: "s-sira",
    title: "فقه السيرة النبوية",
    book: "السيرة من المصادر الأولى",
    status: "متوقفة",
    level: "متوسّط",
    lessons: 30,
    done: 12,
    hours: "٢٢ ساعة",
    axes: ["العهد المكي", "الهجرة", "المدينة"],
    variant: "shamsa",
    palette: "night",
  },
];

/* ---------- الخطب ---------- */
export interface Khutbah {
  id: string;
  title: string;
  mosque: string;
  hijri: string;
  gregorian: string;
  minutes: number;
  topic: string;
  variant: PlateVariant;
  palette: PaletteName;
  excerpt: string;
}

export const khutbahs: Khutbah[] = [
  {
    id: "kh-1",
    title: "حقيقة التوكّل في زمن الفتن",
    mosque: "جامع الإمام البخاري",
    hijri: "١٤ شعبان ١٤٤٧",
    gregorian: "٢ فبراير ٢٠٢٦",
    minutes: 32,
    topic: "الرقائق",
    variant: "shamsa",
    palette: "lapis",
    excerpt: "التوكّل ليس تواكلًا، بل عملٌ بالأسباب مع سكون القلب إلى مسبّبها سبحانه.",
  },
  {
    id: "kh-2",
    title: "البيتُ المسلم حصنٌ ومدرسة",
    mosque: "جامع الإمام البخاري",
    hijri: "٢٨ رجب ١٤٤٧",
    gregorian: "١٦ يناير ٢٠٢٦",
    minutes: 29,
    topic: "الآداب",
    variant: "rosette",
    palette: "madder",
    excerpt: "صلاح البيوت مقدَّم على إصلاح الساحات؛ فمن أتقن رعيّته الصغرى أُعين على ما فوقها.",
  },
  {
    id: "kh-3",
    title: "الرِّبا صوره المعاصرة وخطره",
    mosque: "الجامع الكبير",
    hijri: "١٢ رجب ١٤٤٧",
    gregorian: "٢ يناير ٢٠٢٦",
    minutes: 35,
    topic: "النوازل",
    variant: "girih",
    palette: "saffron",
    excerpt: "تلبّس الربا بألبسة العقود الحديثة لا يغيّر حقيقته؛ والعبرة في العقود بالمقاصد والمعاني.",
  },
  {
    id: "kh-4",
    title: "شكرُ النِّعم سببُ دوامها",
    mosque: "جامع الإمام البخاري",
    hijri: "٢٦ جمادى الآخرة ١٤٤٧",
    gregorian: "١٩ ديسمبر ٢٠٢٥",
    minutes: 27,
    topic: "الرقائق",
    variant: "zellij",
    palette: "olive",
    excerpt: "ما استُديمَت نعمةٌ بمثل شكرها، وما زالت بمثل كفرها؛ والشكر قيدُ الموجود وصيدُ المفقود.",
  },
];

/* ---------- الفتاوى ---------- */
export interface Fatwa {
  id: string;
  q: string;
  a: string;
  hijri: string;
  topic: string;
}

export const fatawa: Fatwa[] = [
  {
    id: "f-1",
    q: "هل يُشرع الجمع بين الصلاتين بسبب المطر الشديد؟",
    a: "نعم، إذا وُجد مطر يبلّ الثياب ويحصل معه مشقة في الخروج إلى المسجد، فللإمام أن يجمع المغرب والعشاء، وكذا الظهر والعصر على الراجح، جمع تقديم، ولا يُشترط استمرار المطر إلى دخول وقت الثانية على الصحيح. والأصل في ذلك فعل النبي ﷺ فيما رواه مسلم من جمعه من غير خوف ولا سفر، وحمل أهل العلم أحاديث الجمع للمطر على هذا.",
    hijri: "٩ شعبان ١٤٤٧",
    topic: "فقه الصلاة",
  },
  {
    id: "f-2",
    q: "عليّ مالٌ أدّخره لشراء مسكن، فهل تجب فيه الزكاة؟",
    a: "تجب الزكاة في المال المدَّخر إذا بلغ النصاب وحال عليه الحول، ولو كان صاحبه ينوي به شراء مسكن أو الزواج أو غير ذلك؛ لأن النية المستقبلية لا تُسقط الزكاة الواجبة. فتُخرج ربع العشر (٢٫٥٪) عن كل حول ما دام النصاب قائمًا.",
    hijri: "٢١ رجب ١٤٤٧",
    topic: "الزكاة",
  },
  {
    id: "f-3",
    q: "ما حكم التعامل بالعملات الرقمية المشفّرة بيعًا وشراءً؟",
    a: "هذه نازلة معاصرة اختلفت فيها أنظار المجامع والباحثين، والذي أراه — والله أعلم — أن ما كان منها قائمًا على محض المضاربة من غير غطاء ولا منفعة حقيقية ولا انضباط شرعي في التعاقد، فالأصل المنع لما فيه من الغرر الفاحش والمقامرة وأكل المال بالباطل، وما انضبط بضوابط الأثمان والمنافع المباحة فيُنظر في صورته الخاصة، ولا يُقضى فيه بحكم عام.",
    hijri: "٣ رجب ١٤٤٧",
    topic: "النوازل الاقتصادية",
  },
  {
    id: "f-4",
    q: "هل صلاة المرأة في بيتها أفضل من صلاتها في المسجد؟",
    a: "نعم، صلاتها في بيتها أعظم أجرًا؛ لقوله ﷺ: «لا تمنعوا نساءكم المساجد وبيوتهن خير لهن»، رواه أبو داود بسند صحيح. وهذا في الأفضلية لا في المنع، فلها حضور الجماعة إذا التزمت الضوابط الشرعية، ولا سيّما صلاة العيدين.",
    hijri: "١٥ جمادى الآخرة ١٤٤٧",
    topic: "فقه الأسرة",
  },
];

/* ---------- الردود العلمية ---------- */
export interface Radd {
  id: string;
  claim: string;
  claimer: string;
  reply: string;
  stage: "ردٌّ مفصّل" | "ردٌّ أوّلي" | "تعقيب";
  hijri: string;
}

export const rudud: Radd[] = [
  {
    id: "r-1",
    claim: "«خبر الواحد لا تقوم به حجة في العقائد»",
    claimer: "مقالة قديمة جدّدها بعض المعاصرين",
    reply: "خبر الواحد الصحيح المقبول إذا تلقّته الأمة عملًا واحتجاجًا أفاد العلم بشواهده، وقد احتجّ الصحابة بأخبار الآحاد في أعظم مسائل الاعتقاد، والردُّ المفصّل في ثلاثة مباحث: نقض الدليل العقلي المزعوم، وتتبع عمل السلف، وبيان لوازم القول الباطلة.",
    stage: "ردٌّ مفصّل",
    hijri: "شعبان ١٤٤٧",
  },
  {
    id: "r-2",
    claim: "«التعارض بين أحاديث الصحيحين ثابت»",
    claimer: "شبهة تُطرح في المجالس الرقمية",
    reply: "أئمة هذا الشأن — من ابن خزيمة إلى ابن حجر — قرّروا أن التعارض المستقر منتفٍ عن صحيحي البخاري ومسلم، وما يُدّعى تعارضُه فإما اختلاف رواية، أو سياق يُزيل الإشكال، أو نسخٌ بيّنه أهل العلم، وقد فُصّل الكلام في ستة مواضع مع أمثلتها.",
    stage: "ردٌّ أوّلي",
    hijri: "رجب ١٤٤٧",
  },
  {
    id: "r-3",
    claim: "«فهم السلف قيدٌ على الاجتهاد المعاصر»",
    claimer: "اتجاه فكري معاصر",
    reply: "فهم السلف ليس قيدًا على الاجتهاد بل هو مناطه؛ فالاجتهاد المعتبر ما وُظّفت فيه الأدوات في ضوء دلالات النصوص كما فهمها أهل القرون المفضّلة، وما سُمّي اجتهادًا مع قطع الصلة بفهمهم إنما هو رأيٌ مجرد عن سنده، والبيان في مبحثين.",
    stage: "تعقيب",
    hijri: "جمادى الآخرة ١٤٤٧",
  },
];

/* ---------- المقالات ---------- */
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  topic: string;
  readMin: number;
  hijri: string;
  variant: PlateVariant;
  palette: PaletteName;
}

export const articles: Article[] = [
  {
    id: "a-1",
    title: "منهج السلف في التعامل مع النصوص المتشابهة",
    excerpt: "قضية المتشابه من أعظم ما يُمحّص به التسليم؛ فبين إثباتٍ بلا تمثيل وتنزيهٍ بلا تعطيل سار أهل السنة، وهذا المقال يؤصّل المنهج من نصوص الوحيين وكلام الأئمة، مع أمثلة تطبيقية تكشف انحراف طائفتي الغلوّ والجفاء.",
    topic: "العقيدة",
    readMin: 14,
    hijri: "١١ شعبان ١٤٤٧",
    variant: "khatam",
    palette: "turq",
  },
  {
    id: "a-2",
    title: "قواعدُ في فَهم النصوص",
    excerpt: "خمس قواعد تعصم القارئ من التعسّف في الاستدلال.",
    topic: "الأصول",
    readMin: 8,
    hijri: "٢٥ رجب ١٤٤٧",
    variant: "rosette",
    palette: "saffron",
  },
  {
    id: "a-3",
    title: "أثرُ حفظ المتون في التحصيل العلمي",
    excerpt: "لماذا يبدأ الطلب بالمتون قبل المطولات؟ قراءة في تجربة السلف.",
    topic: "الآداب",
    readMin: 6,
    hijri: "١٠ رجب ١٤٤٧",
    variant: "girih",
    palette: "olive",
  },
  {
    id: "a-4",
    title: "التأصيل قبل التصدّر",
    excerpt: "في ذمّ التعجّل إلى الفتيا والقضاء قبل استحكام الآلة.",
    topic: "الآداب",
    readMin: 7,
    hijri: "٢٨ جمادى الآخرة ١٤٤٧",
    variant: "zellij",
    palette: "lapis",
  },
  {
    id: "a-5",
    title: "مع المعلّم الأول ﷺ في تربية أصحابه",
    excerpt: "ملامح المنهج النبوي في التدرّج والتربية بالقدوة.",
    topic: "السيرة",
    readMin: 10,
    hijri: "١٤ جمادى الآخرة ١٤٤٧",
    variant: "arabesque",
    palette: "madder",
  },
];

/* ---------- المكتبة ---------- */
export interface Book {
  id: string;
  title: string;
  kind: "مطبوع" | "مخطوط" | "تحت الطبع";
  pages: number;
  yearH: string;
  downloads: number;
  variant: PlateVariant;
  palette: PaletteName;
}

export const books: Book[] = [
  { id: "b-1", title: "القول السديد في شرح كتاب التوحيد", kind: "مطبوع", pages: 480, yearH: "١٤٤٤", downloads: 12400, variant: "khatam", palette: "saffron" },
  { id: "b-2", title: "نُكت رياض الصالحين", kind: "مطبوع", pages: 356, yearH: "١٤٤٥", downloads: 9800, variant: "rosette", palette: "turq" },
  { id: "b-3", title: "العقيدة الطحاوية — تعليق ودراسة", kind: "مطبوع", pages: 210, yearH: "١٤٤٦", downloads: 15200, variant: "girih", palette: "lapis" },
  { id: "b-4", title: "فقه النوازل الاقتصادية", kind: "تحت الطبع", pages: 640, yearH: "١٤٤٧", downloads: 0, variant: "zellij", palette: "olive" },
  { id: "b-5", title: "شرح أصول التفسير — القسم الأول", kind: "مطبوع", pages: 288, yearH: "١٤٤٦", downloads: 7600, variant: "arabesque", palette: "madder" },
  { id: "b-6", title: "مجموع الفتاوى — المجلد الأول", kind: "مخطوط", pages: 520, yearH: "١٤٤٧", downloads: 0, variant: "shamsa", palette: "night" },
];

/* ---------- المحاضرات (خط زمني) ---------- */
export interface Lecture {
  id: string;
  title: string;
  venue: string;
  hijri: string;
  minutes: number;
  topic: string;
  variant: PlateVariant;
  palette: PaletteName;
}

export const lectures: Lecture[] = [
  { id: "l-1", title: "العلمُ قبل القول والعمل", venue: "ملتقى طلبة العلم السنوي", hijri: "١٤٤٧/٨/٥", minutes: 55, topic: "الآداب", variant: "khatam", palette: "olive" },
  { id: "l-2", title: "قراءة في نوازل العصر الرقمي", venue: "الدورة العلمية الصيفية", hijri: "١٤٤٧/٧/١٨", minutes: 70, topic: "النوازل", variant: "shamsa", palette: "lapis" },
  { id: "l-3", title: "صناعةُ المفتي الراسخ", venue: "جامع الإمام البخاري", hijri: "١٤٤٧/٦/٢٢", minutes: 48, topic: "الأصول", variant: "girih", palette: "madder" },
  { id: "l-4", title: "الشباب وأسئلة العصر", venue: "لقاء مفتوح مع الطلبة", hijri: "١٤٤٧/٥/٣٠", minutes: 62, topic: "الفكر", variant: "rosette", palette: "saffron" },
  { id: "l-5", title: "حفظ السنة: تاريخه ورجاله", venue: "أسبوع السنة النبوية", hijri: "١٤٤٧/٣/١٢", minutes: 84, topic: "الحديث", variant: "zellij", palette: "turq" },
];

/* ---------- اليوميات ---------- */
export interface Diary {
  id: string;
  text: string;
  hijri: string;
}

export const diary: Diary[] = [
  { id: "d-1", text: "من أكثر من «لا أدري» وُفّق للصواب إذا تكلّم؛ فإن العلم إنما يُبتلى صاحبه عند جوابه بما لا يحسن.", hijri: "١٢ شعبان ١٤٤٧" },
  { id: "d-2", text: "رأيتُ بركة الوقت في البكور، وبركة الفهم في المراجعة، وبركة القبول في الإخلاص.", hijri: "٥ شعبان ١٤٤٧" },
  { id: "d-3", text: "الفتوى أمانةٌ يحملها المفتي عن رسول الله ﷺ؛ فليُعدّ للسؤال عنها جوابًا.", hijri: "٢٧ رجب ١٤٤٧" },
  { id: "d-4", text: "ما جلس طالبٌ مجلسَ علمٍ إلا قام بأجرٍ أو بإثم؛ أجرُ من انتفع، وإثمُ من قصّر في التبليغ.", hijri: "١٩ رجب ١٤٤٧" },
  { id: "d-5", text: "الكتبُ لا تُغني عن المشايخ، والمشايخُ لا يُغنون عن الكتب؛ والجمع بينهما هو الطلب.", hijri: "٨ رجب ١٤٤٧" },
  { id: "d-6", text: "أعظمُ ما يُحفظ به العلم: العملُ به، ثم تعليمُه، ثم مدارستُه مع الأقران.", hijri: "٣٠ جمادى الآخرة ١٤٤٧" },
];

/* ---------- عناصر مساعدة ---------- */
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export const toAr = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => AR_DIGITS[+d]);

export const formatTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${toAr(m)}:${toAr(String(s).padStart(2, "0"))}`;
};

export const normalizeAr = (s: string): string =>
  s
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .trim();

export const topics = [
  "العقيدة", "التفسير", "الحديث وعلومه", "الفقه", "أصول الفقه",
  "السيرة", "الرقائق", "النوازل", "الردود", "الآداب",
];

/* سجل البحث الشائع */
export const commonSearches = ["العقيدة", "رياض الصالحين", "الربا", "التوكل", "الزكاة"];
