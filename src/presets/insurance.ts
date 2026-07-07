// Pre-built FormSchema instances for insurance products: third-party, life (gold), paramedical, body, health, travel, fire,
// plus flows derived from the "others offline calc" rate sheet: business fire, residential fire, medical liability,
// building board liability, personal/family accident, and veterinarian liability.
import type { FormSchema, FormItem } from '../core/types'

let _uid = 0
const uid = () => 'p' + (++_uid)
const _it = (type: FormItem['type'], title: string, x?: Partial<FormItem>): FormItem =>
  ({ type, title, id: uid(), required: true, ...x })
const _opt = (a: string[]) => a.map(x => ({ label: x, value: x }))
const _sec = (title: string, items: FormItem[]) => ({ title, conditions: { show_if: null }, items })
const _stp = (title: string, sections: ReturnType<typeof _sec>[]) => ({ step_id: uid(), title, sections })
const _form = (product_id: string, steps: ReturnType<typeof _stp>[]): FormSchema => ({ product_id, steps })

export function preset_thirdparty(): FormSchema {
  return _form('third-party', [
    _stp('مشخصات خودرو', [_sec('خودرو و مالک', [
      _it('license_plate', 'پلاک خودرو'),
      _it('national_code', 'کد ملی صاحب پلاک'),
      _it('select', 'برند و مدل خودرو', { placeholder: 'انتخاب خودرو', items: _opt(['پراید','پژو ۲۰۶','پژو پارس','سمند','دنا پلاس','تیبا','کوییک','شاهین','هایما','سایر']) }),
      _it('select', 'سال ساخت', { items: _opt(['۱۴۰۵','۱۴۰۴','۱۴۰۳','۱۴۰۲','۱۴۰۱','۱۴۰۰','قبل از ۱۴۰۰']) }),
      _it('select', 'نوع کاربری', { items: _opt(['شخصی','آژانس/تاکسی درون‌شهری','تاکسی برون‌شهری','آموزش رانندگی','بارکش']) }),
      _it('radio', 'تعداد سیلندر', { items: _opt(['کمتر از ۴','۴ سیلندر','بیش از ۴']) }),
    ])]),
    _stp('سابقه و تخفیف', [_sec('تخفیف عدم خسارت', [
      _it('radio', 'بیمه‌نامه‌ی فعلی دارید؟', { items: _opt(['بله','خیر']) }),
      _it('radio', 'سابقه‌ی تعویض پلاک یا تغییر مالکیت', { items: _opt(['بله','خیر']) }),
      _it('select', 'درصد تخفیف عدم خسارت', { items: _opt(['بدون تخفیف','۵٪ (سال اول)','۱۵٪','۳۰٪','۵۰٪','۷۰٪ (سال چهاردهم)']) }),
      _it('radio', 'تعداد خسارت سال گذشته', { items: _opt(['۰','۱','۲','۳ یا بیشتر']) }),
    ])]),
    _stp('پوشش و مدت', [_sec('پوشش‌ها', [
      _it('range', 'سقف تعهدات مالی', { options: { min: 70, max: 1400, unit: 'میلیون تومان' }, hint: 'حداقل ۷۰ و حداکثر ۱۴۰۰ میلیون تومان' }),
      _it('radio', 'مدت اعتبار بیمه‌نامه', { items: _opt(['یک‌ساله','۶ ماهه','۳ ماهه']) }),
      _it('chips_select', 'پوشش‌های تکمیلی', { required: false, items: _opt(['حوادث راننده','حوادث سرنشین','بلایای طبیعی']) }),
      _it('text', 'کد تخفیف', { required: false, placeholder: 'اختیاری' }),
    ])]),
    _stp('بیمه‌گذار و پرداخت', [_sec('مشخصات و پرداخت', [
      _it('datepicker', 'تاریخ تولد صاحب پلاک'),
      _it('phone_number', 'شماره موبایل'),
      _it('text', 'آدرس'),
      _it('radio', 'روش پرداخت', { items: _opt(['نقدی','اقساطی با پیش‌پرداخت','اعتباری بدون پیش‌پرداخت']) }),
    ])]),
  ])
}

export function preset_goldlife(): FormSchema {
  return _form('life-gold', [
    _stp('مشخصات بیمه‌شده', [_sec('بیمه‌شده', [
      _it('text', 'نام و نام خانوادگی'),
      _it('national_code', 'کد ملی'),
      _it('datepicker', 'تاریخ تولد'),
      _it('radio', 'جنسیت', { items: _opt(['مرد','زن']) }),
      _it('phone_number', 'شماره موبایل'),
    ])]),
    _stp('اطلاعات سلامت', [_sec('پرسش‌نامه‌ی سلامت', [
      _it('number', 'قد (سانتی‌متر)', { placeholder: 'مثلاً ۱۷۵' }),
      _it('number', 'وزن (کیلوگرم)', { placeholder: 'مثلاً ۷۰' }),
      _it('radio', 'استعمال دخانیات', { items: _opt(['بله','خیر']) }),
      _it('radio', 'سابقه‌ی بیماری خاص', { items: _opt(['بله','خیر']) }),
    ])]),
    _stp('طرح طلا', [_sec('سرمایه‌گذاری بر پایه طلا', [
      _it('money', 'حق بیمه‌ی سالانه', { hint: 'حداقل سالانه ۱٬۰۰۰٬۰۰۰ تومان' }),
      _it('range', 'مدت بیمه‌نامه', { options: { min: 5, max: 30, unit: 'سال' }, hint: 'حداقل ۵ سال تا سقف ۸۰ سالگی' }),
      _it('radio', 'دوره‌ی پرداخت', { items: _opt(['سالانه','شش‌ماهه']) }),
      _it('select', 'صندوق سرمایه‌گذاری', { items: _opt(['صندوق عیار','صندوق لوتوس']) }),
      _it('chips_select', 'پوشش‌های تکمیلی', { required: false, items: _opt(['معافیت از پرداخت در ازکارافتادگی','فوت بر اثر حادثه','امراض خاص','هزینه‌ی پزشکی ناشی از حادثه','بلایای طبیعی']) }),
    ])]),
    _stp('ذی‌نفع و تأیید', [_sec('ذی‌نفعان', [
      _it('text', 'نام ذی‌نفع'),
      _it('select', 'نسبت ذی‌نفع', { items: _opt(['همسر','فرزند','والدین','سایر']) }),
      _it('range', 'سهم ذی‌نفع', { options: { min: 0, max: 100, unit: 'درصد' } }),
      _it('radio', 'صحت اطلاعات سلامت را تأیید می‌کنم', { items: _opt(['تأیید می‌کنم','خیر']) }),
    ])]),
  ])
}

export function preset_paramed(): FormSchema {
  return _form('paramedical-liability', [
    _stp('مشخصات فرد', [_sec('بیمه‌گذار', [
      _it('text', 'نام و نام خانوادگی'),
      _it('national_code', 'کد ملی'),
      _it('datepicker', 'تاریخ تولد'),
      _it('phone_number', 'شماره موبایل'),
    ])]),
    _stp('اطلاعات حرفه‌ای', [_sec('شغل و محل کار', [
      _it('select', 'رشته‌ی پیراپزشکی', { items: _opt(['پرستاری','مامایی','اتاق عمل','هوشبری','علوم آزمایشگاهی','رادیولوژی','فیزیوتراپی','فوریت‌های پزشکی','بینایی‌سنجی','شنوایی‌سنجی']) }),
      _it('text', 'شماره‌ی نظام'),
      _it('select', 'محل اشتغال', { items: _opt(['بیمارستان دولتی','بیمارستان خصوصی','درمانگاه','مطب/کلینیک','آزمایشگاه','مرکز تصویربرداری']) }),
      _it('number', 'سابقه‌ی کار (سال)', { placeholder: 'مثلاً ۸' }),
    ])]),
    _stp('پوشش و تعهدات', [_sec('سقف تعهدات', [
      _it('select', 'سقف تعهد برای هر نفر در سال', { items: _opt(['۲ میلیارد تومان','۴ میلیارد تومان','۸ میلیارد تومان']) }),
      _it('select', 'سقف تعهد سالانه', { items: _opt(['۶ میلیارد تومان','۱۲ میلیارد تومان','۲۴ میلیارد تومان']) }),
      _it('chips_select', 'پوشش‌های اضافه', { required: false, items: _opt(['هزینه‌ی دادرسی و دفاع حقوقی','مسئولیت در ایام مرخصی','اقدامات اورژانسی خارج از مرکز','مابه‌التفاوت دیه‌ی ماه حرام']) }),
      _it('radio', 'سابقه‌ی خسارت یا شکایت در ۳ سال اخیر', { items: _opt(['بله','خیر']) }),
    ])]),
    _stp('تأیید و شروع', [_sec('نهایی‌سازی', [
      _it('datepicker', 'تاریخ شروع پوشش'),
      _it('radio', 'صحت اطلاعات را تأیید می‌کنم', { items: _opt(['تأیید می‌کنم','خیر']) }),
    ])]),
  ])
}

export function preset_body(): FormSchema {
  return _form('car-body', [
    _stp('مشخصات خودرو', [_sec('خودرو', [
      _it('license_plate', 'پلاک خودرو'),
      _it('select', 'برند و مدل', { items: _opt(['پراید','پژو ۲۰۶','دنا پلاس','شاهین','هایما','سایر']) }),
      _it('select', 'سال ساخت', { items: _opt(['۱۴۰۵','۱۴۰۴','۱۴۰۳','۱۴۰۲','۱۴۰۱','۱۴۰۰']) }),
      _it('money', 'ارزش روز خودرو', { hint: 'ارزش تقریبی خودرو به تومان' }),
    ])]),
    _stp('پوشش‌ها و تخفیف', [_sec('پوشش‌ها', [
      _it('chips_select', 'پوشش‌های اضافه', { required: false, items: _opt(['سرقت کلی','آتش‌سوزی','بلایای طبیعی','شکست شیشه','نوسانات قیمت','حوادث راننده']) }),
      _it('select', 'درصد تخفیف عدم خسارت', { items: _opt(['بدون تخفیف','۲۵٪','۳۵٪','۵۰٪','۶۰٪']) }),
      _it('radio', 'مدت بیمه‌نامه', { items: _opt(['یک‌ساله','۶ ماهه']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'), _it('text', 'آدرس'),
    ])]),
  ])
}

export function preset_health(): FormSchema {
  return _form('health-supplementary', [
    _stp('نوع بیمه', [_sec('طرح', [
      _it('radio', 'نوع بیمه', { items: _opt(['خانوادگی','انفرادی']) }),
      _it('number', 'تعداد اعضای خانواده', { placeholder: 'مثلاً ۴' }),
      _it('select', 'رده‌ی سنی سرپرست', { items: _opt(['زیر ۳۰ سال','۳۰ تا ۵۰ سال','۵۰ تا ۶۰ سال','بالای ۶۰ سال']) }),
    ])]),
    _stp('پوشش‌ها', [_sec('پوشش‌های درمانی', [
      _it('chips_select', 'پوشش‌های موردنظر', { items: _opt(['بستری و جراحی','پاراکلینیک','زایمان','دندان‌پزشکی','عینک و سمعک','آمبولانس']) }),
      _it('radio', 'سابقه‌ی بیماری خاص در خانواده', { items: _opt(['بله','خیر']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام سرپرست'), _it('national_code', 'کد ملی سرپرست'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

export function preset_travel(): FormSchema {
  return _form('travel', [
    _stp('سفر', [_sec('اطلاعات سفر', [
      _it('select', 'مقصد', { items: _opt(['شینگن / اروپا','آسیا','آمریکا','سراسر جهان']) }),
      _it('datepicker', 'تاریخ شروع سفر'),
      _it('range', 'مدت سفر', { options: { min: 1, max: 90, unit: 'روز' } }),
      _it('number', 'تعداد مسافران', { placeholder: 'مثلاً ۲' }),
    ])]),
    _stp('پوشش', [_sec('پوشش‌ها', [
      _it('select', 'سقف پوشش', { items: _opt(['۳۰٬۰۰۰ یورو','۵۰٬۰۰۰ یورو','۱۰۰٬۰۰۰ یورو']) }),
      _it('chips_select', 'پوشش‌های اضافه', { required: false, items: _opt(['کرونا','ورزش‌های پرخطر','از دست رفتن بار','تأخیر پرواز']) }),
    ])]),
    _stp('مسافر', [_sec('مشخصات', [
      _it('text', 'نام مسافر'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

// Generic (custom) fire flow for properties that don't fit the offer-based اصناف/مسکونی plans below.
// Ownership gates the building-value field: a tenant only insures contents, so ارزش بنا is hidden via show_if.
export function preset_fire(): FormSchema {
  return _form('fire', [
    _stp('ملک', [_sec('مشخصات ملک', [
      _it('radio', 'نوع ملک', { id: 'fire_use', items: _opt(['مسکونی','تجاری','صنعتی']) }),
      _it('radio', 'وضعیت مالکیت', { id: 'fire_own', hint: 'مستاجر فقط اثاثیه و لوازم را بیمه می‌کند؛ بیمه‌ی بنا با مالک است', items: _opt(['مالک','مستاجر']) }),
      _it('money', 'ارزش بنا', { id: 'fire_bldg', conditions: { show_if: "fire_own == 'مالک'" } }),
      _it('money', 'ارزش اثاثیه و دارایی'),
      _it('text', 'آدرس ملک'),
    ])]),
    _stp('پوشش‌ها', [_sec('خطرات تحت پوشش', [
      _it('chips_select', 'پوشش‌های اضافه', { required: false, items: _opt(['زلزله و آتشفشان','سیل و طغیان آب','طوفان و گردباد','سرقت با شکست حرز','ترکیدگی لوله آب','نوسانات جریان برق','مسئولیت در برابر اشخاص ثالث']) }),
      _it('radio', 'مدت بیمه‌نامه', { items: _opt(['یک‌ساله','بلندمدت']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

// Business fire RFQ, grounded in the "others offline calc" fire tabs (آتش سوزی اصناف سامان / طرح مراقب کار).
// The job group (گروه شغلی ۱–۴ اصناف، ۱–۳ مراقب کار) is derived from the صنف by each insurer's mapping table,
// so it is not asked. The 1–20× multiplier applies only to طرح اصناف; مراقب کار tiers carry fixed bundled covers.
export function preset_firebiz(): FormSchema {
  return _form('fire-business', [
    _stp('کسب‌وکار', [_sec('محل کسب', [
      _it('select', 'صنف / فعالیت شغلی', { placeholder: 'انتخاب صنف', hint: 'گروه شغلی و نرخ پایه به‌صورت خودکار از روی صنف تعیین می‌شود', items: _opt(['دفتر خدماتی / اداری','بنگاه معاملات ملکی','دفتر خدمات مسافرتی و گردشگری','آژانس کرایه اتومبیل','مطب پزشک','دندان‌پزشکی','داروخانه','آزمایشگاه تشخیص طبی','مهد کودک / آموزشگاه','باشگاه ورزشی','آرایشگاه','کافی‌شاپ','رستوران / اغذیه‌فروشی','قنادی / شیرینی‌فروشی','نانوایی','سوپرمارکت / خواروبار','میوه‌فروشی','فروشگاه پوشاک / بوتیک','فروشگاه پارچه و منسوجات','خرازی','خیاطی','فروشگاه لوازم خانگی','فروشگاه کامپیوتر و موبایل','کتاب‌فروشی و نوشت‌افزار','بلورفروشی','فروشگاه مصالح ساختمانی','فروشگاه لوازم یدکی اتومبیل','تعمیرگاه اتومبیل','عینک‌سازی','خشکشویی','هتل / مهمان‌پذیر','تالار پذیرایی','سایر']) }),
      _it('text', 'آدرس محل کسب'),
    ])]),
    _stp('تعهدات و پوشش‌ها', [_sec('سرمایه و خطرات', [
      _it('range', 'ضریب افزایش تعهدات', { options: { min: 1, max: 20, unit: 'برابر' }, hint: 'ویژه طرح اصناف: حق بیمه و سرمایه از ۱ تا حداکثر ۲۰ برابر حداقل تعهدات؛ در طرح‌های مراقب کار تعهدات ثابت و بسته‌ای است' }),
      _it('chips_select', 'پوشش‌های موردنیاز', { required: false, hint: 'طرح‌های مراقب کار همه‌ی این پوشش‌ها را یک‌جا دارند؛ طرح اصناف فقط پوشش پایه آتش‌سوزی، صاعقه و انفجار است', items: _opt(['سرقت با شکست حرز','زلزله و آتشفشان','سیل و طغیان آب','طوفان و گردباد','شکست شیشه سکوریت','پول در گاوصندوق','وقفه در فعالیت (زیان مالی)','مسئولیت در قبال همسایگان','هزینه پاکسازی','غرامت فوت، نقص عضو و هزینه پزشکی','هزینه تامین محل کسب موقت']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

// Residential fire RFQ, grounded in the آتش سوزی مسکونی سینا / خانه ایمن دی tabs. All active plans are
// fixed-capital packages (tier = the offer), so no capital/multiplier question: the old 3–100× slider
// belonged to Saman's خانه امن which the sheet marks غیرفعال. The six extra perils are bundled in every
// plan, so only ownership and theft — the two real plan differentiators — are asked.
export function preset_firehome(): FormSchema {
  return _form('fire-residential', [
    _stp('ملک و پوشش', [_sec('واحد مسکونی', [
      _it('radio', 'وضعیت مالکیت', { id: 'home_own', hint: 'برای مستاجر فقط اثاثیه و لوازم منزل بیمه می‌شود؛ بیمه‌ی ساختمان با مالک است', items: _opt(['مالک','مستاجر']) }),
      _it('radio', 'پوشش سرقت', { id: 'home_theft', hint: 'زلزله، ترکیدگی لوله آب، سیل، طوفان، ذوب برف و نوسانات برق در همه‌ی طرح‌ها به‌صورت پیش‌فرض پوشش داده می‌شود', items: _opt(['با خطر سرقت','بدون خطر سرقت']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'), _it('text', 'آدرس ملک'),
    ])]),
  ])
}

// Medical liability RFQ, grounded in the "others offline calc" rate sheet (tabs معلم/دی/پارسیان/کوثر/ایران/سینا).
// The job-group and education-level fields branch on پزشکان/پیراپزشکان via show_if:
// physicians rate in 4 canonical groups with رزیدنت/فلوشیپ tiers, paramedics in 5 groups with دانشجو/سایر only.
export function preset_medliability(): FormSchema {
  return _form('medical-liability', [
    _stp('اطلاعات شغلی', [_sec('تخصص و سطح علمی', [
      _it('radio', 'گروه', { id: 'med_group', items: _opt(['پزشکان','پیراپزشکان']) }),
      _it('select', 'گروه‌بندی شغلی پزشکان', { id: 'doc_class', placeholder: 'انتخاب گروه', conditions: { show_if: "med_group == 'پزشکان'" }, items: _opt([
        'جراحان زنان و زایمان، جراحان عمومی، بیهوشی، ارتوپدی',
        'جراحان قلب، مغز و اعصاب، چشم، ترمیمی و پلاستیک، ارولوژی',
        'جراحان فک و صورت، گوش و حلق و بینی، دندان و لثه، پوست، اطفال',
        'پزشکان متخصص غیرجراح، دندانپزشکان، پزشکان عمومی، آندوسکوپی، رادیولوژی، میکروبیولوژی، داروسازی',
      ]) }),
      _it('select', 'گروه‌بندی شغلی پیراپزشکان', { id: 'para_class', placeholder: 'انتخاب گروه', conditions: { show_if: "med_group == 'پیراپزشکان'" }, items: _opt([
        'ماماهای دارای مطب مستقل',
        'ماماهای شاغل در بیمارستان، دندانپزشکان تجربی و بهداشت‌کاران دهان و دندان',
        'کارشناسان و تکنسین‌های بیهوشی، فیزیوتراپی و پرستاران CCU/ICU، دیالیز و اورژانس',
        'پرستاران و بهیاران سایر بخش‌ها و تکنسین‌های اتاق عمل',
        'تکنسین‌های رادیولوژی، سی‌تی‌اسکن و MRI، آزمایشگاه، داروخانه و کمک‌بهیاران',
      ]) }),
      _it('radio', 'سطح علمی', { id: 'doc_level', conditions: { show_if: "med_group == 'پزشکان'" }, hint: 'رزیدنت و دانشجو در برخی شرکت‌ها (معلم، دی، سینا) مشمول نرخ بالاتر است؛ پارسیان و کوثر برای فلوشیپ نرخ جداگانه دارند', items: _opt(['دانشجو','رزیدنت','فلوشیپ','سایر']) }),
      _it('radio', 'سطح علمی', { id: 'para_level', conditions: { show_if: "med_group == 'پیراپزشکان'" }, hint: 'در برخی شرکت‌ها (مانند کوثر) سطح علمی پیراپزشکان تأثیری در نرخ ندارد', items: _opt(['دانشجو','سایر']) }),
      _it('text', 'شماره نظام پزشکی', { id: 'med_code', hint: 'بارگذاری تصویر کارت نظام پزشکی برای صدور الزامی است' }),
    ])]),
    _stp('تعهدات و پوشش‌ها', [_sec('تعهدات', [
      _it('select', 'سقف تعهد (تعداد دیه کامل)', { id: 'diya_count', hint: 'سقف برای کل مدت بیمه‌نامه است و با تعدد دیات یا چند پرونده در یک سال مصرف می‌شود؛ برای گروه‌های جراحی پرریسک دو دیه یا بیشتر توصیه می‌شود', items: _opt(['یک دیه','دو دیه','سه دیه','چهار دیه']) }),
      _it('select', 'افزایش ریالی سرمایه (مازاد بر تعهد)', { id: 'capital_increase', required: false, hint: 'جبران رشد سالانه نرخ دیه تا زمان صدور حکم — جدا از سقف تعهد؛ ویژه بیمه ایران', items: _opt(['بدون پوشش','تا ۵۰٪','تا ۷۰٪','تا ۱۰۰٪']) }),
      _it('chips_select', 'پوشش‌های تکمیلی', { id: 'covers', required: false, hint: 'هر پوشش فقط توسط برخی شرکت‌ها ارائه می‌شود و در فهرست پیشنهادها مشخص خواهد شد', items: _opt(['تعدد دیات و دیات غیرمسری','افزایش ریالی دیه (تا یک سال)','افزایش مرور زمان ادعای خسارت از ۴ به ۶ سال','اعمال مجاز سرپایی و زیبایی','خسارت ناشی از جنگ','مسئول فنی داروخانه','قائم‌مقام مسئول فنی داروخانه']) }),
    ]), _sec('تخفیف عدم خسارت', [
      _it('select', 'سابقه عدم خسارت', { id: 'ncd_years', hint: 'تخفیف بسته به شرکت از ۵٪ تا ۶۰٪ است؛ در بیمه معلم نرخ‌ها ثابت است و تخفیف اعمال نمی‌شود', items: _opt(['بدون سابقه','یک سال','دو سال','سه سال','چهار سال','پنج سال و بیشتر']) }),
      _it('radio', 'گواهی عدم خسارت مهرشده از شرکت قبلی دارید؟', { id: 'ncd_cert', conditions: { show_if: "ncd_years != 'بدون سابقه'" }, hint: 'بدون گواهی مهرشده، اعمال تخفیف عدم خسارت ممکن نیست', items: _opt(['بله','خیر']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

// Building board liability RFQ, grounded in the هیات مدیره tabs (سامان/پارسیان/سینا/دی).
// Usage categories follow the insurers' rating classes (مسکونی، اداری و پزشکان، تجاری). متراژ and نما
// are پارسیان-only rating factors, so they stay optional. The elevator is a priced line item in both
// سامان (per count) and پارسیان (count/type/capacity), so it is a radio with a conditional count
// instead of a chip. NCD is a year-tier select (پارسیان: ۵٪ per year up to 4 years), not a yes/no.
export function preset_boardliability(): FormSchema {
  return _form('building-board-liability', [
    _stp('مشخصات ساختمان', [_sec('ساختمان', [
      _it('radio', 'نوع کاربری', { items: _opt(['مسکونی / ویلایی','اداری و پزشکان','تجاری']) }),
      _it('number', 'تعداد واحد', { placeholder: 'مثلاً ۱۰' }),
      _it('number', 'تعداد طبقات', { placeholder: 'مثلاً ۵' }),
      _it('radio', 'قدمت ساختمان', { items: _opt(['تا ۲۰ سال','بیش از ۲۰ سال']) }),
      _it('number', 'متراژ کل بنا (مترمربع)', { required: false, placeholder: 'مثلاً ۱۰۰۰', hint: 'برای استعلام دقیق‌تر برخی شرکت‌ها (پارسیان)' }),
      _it('select', 'نوع نمای ساختمان', { required: false, placeholder: 'انتخاب نما', hint: 'در نمای ترکیبی، نمای با ریسک بالاتر مبنای نرخ است', items: _opt(['سنگ','شیشه','کامپوزیت','سیمان و آجر']) }),
    ])]),
    _stp('مشاعات و امکانات', [_sec('امکانات و ایمنی', [
      _it('radio', 'آسانسور', { id: 'board_lift', items: _opt(['دارد','ندارد']) }),
      _it('number', 'تعداد آسانسور', { conditions: { show_if: "board_lift == 'دارد'" }, placeholder: 'مثلاً ۲' }),
      _it('chips_select', 'سایر امکانات ساختمان', { required: false, items: _opt(['پارکینگ','پله برقی','استخر، سونا و جکوزی','سالن ورزشی','سالن اجتماعات','محوطه بازی / شهربازی','رستوران','کارواش','سالن سینما و تئاتر']) }),
      _it('chips_select', 'امکانات ایمنی', { required: false, hint: 'هر مورد مشمول تخفیف حق بیمه می‌شود', items: _opt(['نگهبان ۲۴ ساعته','دوربین مداربسته','سیستم اعلان و اطفاء حریق','بیمه‌نامه معتبر آتش‌سوزی']) }),
      _it('number', 'تعداد کارکنان ساختمان', { required: false, placeholder: 'مثلاً ۲', hint: 'سرایدار، نظافتچی و سایر کارکنان مشاعات' }),
    ])]),
    _stp('پوشش‌ها', [_sec('پوشش‌های اضافی', [
      _it('chips_select', 'پوشش‌های اضافی', { required: false, hint: 'هر پوشش فقط توسط برخی شرکت‌ها ارائه می‌شود و در فهرست پیشنهادها مشخص خواهد شد', items: _opt(['پرداخت خسارت بدون رای دادگاه','حذف فرانشیز هزینه‌های پزشکی','افزایش ریالی دیه','تعدد دیات و دیات غیرمسری','غرامت فوت و نقص عضو بیمه‌گذار','هزینه پزشکی بدون اعمال تعرفه','مستمری کارکنان (تبصره ۱ ماده ۶۶ تامین اجتماعی)','نقاشی، تعمیرات و نصب داربست']) }),
      _it('select', 'سابقه عدم خسارت', { hint: 'در پارسیان هر سال عدم خسارت ۵٪ تخفیف تا سقف ۲۰٪ دارد', items: _opt(['بدون سابقه','یک سال','دو سال','سه سال','چهار سال و بیشتر']) }),
    ])]),
    _stp('مدیر ساختمان', [_sec('مشخصات بیمه‌گذار', [
      _it('text', 'نام و نام خانوادگی مدیر'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'), _it('text', 'آدرس ساختمان'),
    ])]),
  ])
}

export function preset_accident(): FormSchema {
  return _form('personal-accident', [
    _stp('نوع طرح', [_sec('طرح', [
      _it('radio', 'نوع بیمه', { items: _opt(['انفرادی','خانواده']) }),
      _it('radio', 'تعداد اعضای خانواده', { required: false, hint: 'فقط برای بیمه خانواده', items: _opt(['۱ تا ۴ نفر','۵ تا ۸ نفر']) }),
    ])]),
    _stp('گروه خطر شغلی', [_sec('شغل', [
      _it('select', 'گروه شغلی', { placeholder: 'انتخاب گروه خطر', items: _opt([
        'طبقه ۱: محصل، دانشجو، کارمند و مشاغل دفتری',
        'طبقه ۲: مشاغل خدماتی، کادر درمان، فروشندگی و رسانه',
        'طبقه ۳: مسافرت خارجی، کار با ابزار سبک، سینما و تئاتر',
        'طبقه ۴: کار با ماشین‌آلات سنگین و صنعتی',
        'طبقه ۵: کار با برق، مواد شیمیایی، ارتفاع و اسلحه',
      ]) }),
      _it('radio', 'مدت بیمه', { items: _opt(['۱۲ ماهه','۶ ماهه','۳ ماهه']) }),
    ])]),
    _stp('تعهدات', [_sec('سرمایه', [
      _it('select', 'سرمایه فوت و نقص عضو', { hint: 'هزینه پزشکی معادل ۱۰٪ سرمایه فوت است', items: _opt(['۳۰۰ میلیون ریال','۵۰۰ میلیون ریال','۷۰۰ میلیون ریال','۱ میلیارد ریال','۲ میلیارد ریال','۳ میلیارد ریال','۴ میلیارد ریال','۵ میلیارد ریال']) }),
    ])]),
    _stp('بیمه‌شده', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('datepicker', 'تاریخ تولد'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

// Vet liability RFQ, grounded in the دامپزشکان tabs (سینا/سامان). The two insurers cover different
// practice domains — سامان only درمان حیوانات خانگی شناسنامه‌دار, سینا only دام و طیور — so حوزه فعالیت
// is the routing question. گروه تخصصی and سطح مدرک encoded the same qualification tier twice and are
// merged into one field. The تعهد مالی question is gone: each insurer has exactly one limit
// (سامان ۱ میلیارد، سینا ۵ میلیارد ریال), so the limit is an offer differentiator, not an input.
export function preset_vetliability(): FormSchema {
  return _form('vet-liability', [
    _stp('حرفه و سابقه', [_sec('اطلاعات حرفه‌ای', [
      _it('radio', 'حوزه فعالیت', { id: 'vet_domain', hint: 'شرکت‌های بیمه حوزه‌های متفاوتی را پوشش می‌دهند؛ پیشنهادها بر همین اساس فیلتر می‌شود', items: _opt(['حیوانات خانگی (مطب / کلینیک)','دام و طیور','هر دو']) }),
      _it('select', 'سطح مدرک و تخصص', { placeholder: 'انتخاب سطح', hint: 'برای مدرک کاردانی اضافه نرخ اعمال می‌شود', items: _opt(['کاردان دامپزشکی','دامپزشک عمومی (دکترای حرفه‌ای)','جراح متخصص']) }),
      _it('radio', 'گواهی سازمان دامپزشکی', { hint: 'داشتن گواهی سازمان در نرخ برخی شرکت‌ها مؤثر است', items: _opt(['دارد','ندارد']) }),
      _it('text', 'شماره نظام دامپزشکی', { hint: 'صدور فقط برای دارندگان مدرک معتبر؛ دامپزشکان تجربی امکان خرید ندارند و بارگذاری مدرک برای صدور الزامی است' }),
    ]), _sec('تخفیف عدم خسارت', [
      _it('select', 'سابقه عدم خسارت', { id: 'vet_ncd', items: _opt(['بدون سابقه','یک سال','دو سال','سه سال و بیشتر']) }),
      _it('radio', 'گواهی عدم خسارت از شرکت قبلی دارید؟', { conditions: { show_if: "vet_ncd != 'بدون سابقه'" }, hint: 'گواهی با ضریب خسارت کمتر از ۶۵٪ الزامی است و باید در سامانه صدور بارگذاری شود', items: _opt(['بله','خیر']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

// Offer-list differentiators per branch (product_id → insurer offers). These are deliberately
// NOT asked in the RFQ wizard above: the RFQ collects only risk data, the backend fans out to
// these insurers/tiers, and the user compares premiums in the offer list before the RFS
// (issuance) step. Rates come from the "others offline calc" sheet.
export interface OfferOption {
  insurer: string
  plan?: string
  note?: string
}

export const OFFERS: Record<string, OfferOption[]> = {
  'fire-business': [
    { insurer: 'سامان', plan: 'طرح اصناف', note: 'پوشش پایه با حق بیمه ثابت بر اساس گروه شغلی صنف؛ افزایش تعهدات با ضریب ۱ تا ۲۰ برابر' },
    { insurer: 'سامان', plan: 'مراقب کار — برنزی', note: 'بسته کامل ۱۱ پوشش؛ ارزش ساختمان ۶ میلیارد ریال' },
    { insurer: 'سامان', plan: 'مراقب کار — نقره‌ای', note: 'بسته کامل ۱۱ پوشش؛ ارزش ساختمان ۱۲ میلیارد ریال' },
    { insurer: 'سامان', plan: 'مراقب کار — طلایی', note: 'بسته کامل ۱۱ پوشش؛ ارزش ساختمان ۲۰ میلیارد ریال' },
  ],
  'fire-residential': [
    { insurer: 'سامان', plan: 'جامع منازل — برنزی' },
    { insurer: 'سامان', plan: 'جامع منازل — نقره‌ای' },
    { insurer: 'سامان', plan: 'جامع منازل — طلایی' },
    { insurer: 'سینا', plan: 'بیمه بازار — نقره‌ای', note: 'نسخه مالک و مستاجر، با و بدون خطر سرقت' },
    { insurer: 'سینا', plan: 'بیمه بازار — طلایی', note: 'نسخه مالک و مستاجر، با و بدون خطر سرقت' },
    { insurer: 'دی', plan: 'خانه ایمن', note: 'استعلام آنلاین از سامانه دیدار؛ فقط پوشش آتش‌سوزی ساختمان (ویژه مالک)' },
  ],
  'medical-liability': [
    { insurer: 'معلم', note: 'نرخ ثابت، بدون تخفیف عدم خسارت؛ رزیدنت/دانشجو و پوشش دو دیه هر کدام ۲۰٪ افزایش نرخ' },
    { insurer: 'دی', note: 'حداکثر دو دیه؛ تخفیف عدم خسارت ۵ تا ۲۰٪' },
    { insurer: 'پارسیان', note: 'نرخ جداگانه فلوشیپ؛ پوشش تعدد دیات و افزایش ریالی دیه؛ صدور با نماینده خارجی و فرم پیشنهاد الزامی' },
    { insurer: 'کوثر', note: 'پزشکان فقط با یک دیه؛ پیراپزشکان یک یا دو دیه و سطح علمی بی‌تأثیر' },
    { insurer: 'ایران', note: 'سقف تعهد بر مبنای دیه ماه حرام (تا سه دیه)؛ ۱۰٪ تخفیف نقدی و تخفیف عدم خسارت تا ۶۰٪؛ پوشش‌های اختیاری: جنگ، زیبایی، مسئول فنی داروخانه، افزایش سرمایه' },
    { insurer: 'سینا', note: 'یک تا چهار دیه؛ نرخ جداگانه رزیدنت و دانشجو' },
  ],
  'building-board-liability': [
    { insurer: 'سامان', note: 'مسکونی و تجاری-اداری؛ اضافه نرخ استخر و سونا ۳۰٪، محوطه بازی و سالن ورزشی هر کدام ۵٪' },
    { insurer: 'پارسیان', note: 'نرخ بر اساس کاربری، نما، تعداد واحد و طبقات؛ ۱۰٪ تخفیف نقدی و تخفیف عدم خسارت تا ۲۰٪؛ تعهد مالی بالای ۲ میلیارد ریال مستلزم بازدید' },
    { insurer: 'سینا', note: 'مسکونی، شهرک ویلایی، تجاری، اداری و پزشکان؛ تخفیف مدیریتی، نگهبان و دوربین؛ پوشش نقاشی، تعمیرات و نصب داربست' },
    { insurer: 'دی', note: 'استعلام آنلاین از سامانه دیدار؛ فقط ساختمان مسکونی' },
  ],
  'personal-accident': [
    { insurer: 'کوثر', plan: 'حوادث انفرادی' },
    { insurer: 'سینا', plan: 'حوادث خانواده — طرح ۱/۲/۳' },
    { insurer: 'آسیا', plan: 'طرح لبخند' },
  ],
  'vet-liability': [
    { insurer: 'سینا', note: 'دام و طیور؛ تعهد مالی ۵ میلیارد ریال؛ فرانشیز ۵٪ در ذبح و ۲۰٪ در تلف؛ اضافه نرخ مدرک کاردانی' },
    { insurer: 'سامان', note: 'حیوانات خانگی شناسنامه‌دار (سگ، گربه، پرندگان زینتی و…)؛ تعهد مالی ۱ میلیارد ریال؛ دام و طیور خارج از پوشش' },
  ],
}

export const PRESETS = [
  { key: 'thirdparty',      ic: '🚗', label: 'شخص ثالث',              fn: preset_thirdparty },
  { key: 'goldlife',        ic: '🪙', label: 'عمر بر پایه طلا',       fn: preset_goldlife },
  { key: 'paramed',         ic: '🩺', label: 'پیراپزشکی',             fn: preset_paramed },
  { key: 'body',            ic: '🛡️', label: 'بدنه',                  fn: preset_body },
  { key: 'health',          ic: '🏥', label: 'درمان تکمیلی',          fn: preset_health },
  { key: 'travel',          ic: '✈️', label: 'مسافرتی',               fn: preset_travel },
  { key: 'firehome',        ic: '🏠', label: 'آتش‌سوزی مسکونی',       fn: preset_firehome },
  { key: 'firebiz',         ic: '🏪', label: 'آتش‌سوزی تجاری',        fn: preset_firebiz },
  { key: 'fire',            ic: '🔥', label: 'آتش‌سوزی سایر املاک',   fn: preset_fire },
  { key: 'medliability',    ic: '⚕️', label: 'مسئولیت پزشکی',         fn: preset_medliability },
  { key: 'boardliability',  ic: '🏢', label: 'مسئولیت هیئت مدیره',    fn: preset_boardliability },
  { key: 'accident',        ic: '🤕', label: 'حوادث انفرادی',         fn: preset_accident },
  { key: 'vetliability',    ic: '🐾', label: 'مسئولیت دامپزشکی',     fn: preset_vetliability },
]
