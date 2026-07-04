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

export function preset_fire(): FormSchema {
  return _form('fire', [
    _stp('ملک', [_sec('مشخصات ملک', [
      _it('radio', 'نوع ملک', { items: _opt(['مسکونی','تجاری','صنعتی']) }),
      _it('money', 'ارزش بنا'),
      _it('money', 'ارزش اثاثیه و دارایی'),
      _it('text', 'آدرس ملک'),
    ])]),
    _stp('پوشش‌ها', [_sec('خطرات تحت پوشش', [
      _it('chips_select', 'پوشش‌های اضافه', { required: false, items: _opt(['زلزله','سیل','سرقت','ترکیدگی لوله','مسئولیت در برابر اشخاص ثالث']) }),
      _it('radio', 'مدت بیمه‌نامه', { items: _opt(['یک‌ساله','بلندمدت']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام مالک'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

export function preset_firebiz(): FormSchema {
  return _form('fire-business', [
    _stp('کسب‌وکار', [_sec('محل کسب', [
      _it('select', 'گروه شغلی', { hint: 'گروه شغلی بر اساس صنف تعیین می‌شود', items: _opt(['گروه شغلی اول','گروه شغلی دوم','گروه شغلی سوم','گروه شغلی چهارم']) }),
      _it('select', 'صنف / فعالیت شغلی', { placeholder: 'انتخاب صنف', items: _opt(['بلورفروشی','دفتر خدماتی / اداری','مطب پزشک','کافی‌شاپ','داروخانه','آرایشگاه','فروشگاه لوازم خانگی','رستوران / اغذیه‌فروشی','سوپرمارکت','خرازی','فروشگاه پوشاک','قنادی','خیاطی','فروشگاه کاغذ','سایر']) }),
      _it('text', 'آدرس محل کسب'),
    ])]),
    _stp('تعهدات و پوشش‌ها', [_sec('سرمایه و خطرات', [
      _it('range', 'ضریب افزایش تعهدات', { options: { min: 1, max: 20, unit: 'برابر' }, hint: 'حق بیمه متناسب با ضریب، از ۱ تا حداکثر ۲۰ برابر حداقل تعهدات افزایش می‌یابد' }),
      _it('chips_select', 'پوشش‌های اضافه', { required: false, items: _opt(['سرقت با شکست حرز','زلزله و آتشفشان','سیل و طغیان آب','طوفان و گردباد','شکست شیشه سکوریت','پول در گاوصندوق','وقفه در فعالیت (زیان مالی)','مسئولیت در قبال همسایگان','هزینه پاکسازی']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'),
    ])]),
  ])
}

export function preset_firehome(): FormSchema {
  return _form('fire-residential', [
    _stp('ملک', [_sec('واحد مسکونی', [
      _it('radio', 'وضعیت مالکیت', { items: _opt(['مالک','مستاجر']) }),
      _it('range', 'ضریب سرمایه', { options: { min: 3, max: 100, unit: 'برابر' }, hint: 'تعهدات پایه در ضریب انتخابی ضرب می‌شود' }),
    ])]),
    _stp('خطرات تحت پوشش', [_sec('پوشش‌ها', [
      _it('radio', 'پوشش سرقت', { items: _opt(['با خطر سرقت','بدون خطر سرقت']) }),
      _it('chips_select', 'خطرات اضافه', { required: false, items: _opt(['زلزله و آتشفشان','ترکیدگی لوله آب','سیل و طغیان','طوفان و گردباد','ضایعات ذوب برف و آب باران','نوسانات جریان برق']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'), _it('text', 'آدرس ملک'),
    ])]),
  ])
}

export function preset_medliability(): FormSchema {
  return _form('medical-liability', [
    _stp('اطلاعات شغلی', [_sec('تخصص و سطح علمی', [
      _it('radio', 'گروه', { items: _opt(['پزشکان','پیراپزشکان']) }),
      _it('select', 'گروه‌بندی شغلی', { placeholder: 'انتخاب گروه', items: _opt([
        'جراحان زنان و زایمان، جراحان عمومی، بیهوشی، ارتوپدی',
        'جراحان قلب، مغز و اعصاب، چشم، ترمیمی و پلاستیک، ارولوژی',
        'جراحان فک و صورت، گوش و حلق و بینی، دندان و لثه، پوست، اطفال',
        'پزشکان متخصص غیر جراح، دندانپزشکان و پزشکان عمومی',
        'ماماهای دارای مطب مستقل',
        'ماماهای شاغل در بیمارستان و بهداشت‌کاران دهان و دندان',
        'کارشناسان بیهوشی، فیزیوتراپی و پرستاران CCU/ICU و اورژانس',
        'پرستاران و بهیاران سایر بخش‌ها و تکنسین‌های اتاق عمل',
        'تکنسین‌های رادیولوژی، آزمایشگاه، داروخانه و کمک‌بهیاران',
      ]) }),
      _it('radio', 'سطح علمی', { items: _opt(['دانشجو','رزیدنت','فلوشیپ','سایر']) }),
      _it('text', 'شماره نظام پزشکی', { hint: 'بارگذاری مدرک نظام پزشکی برای صدور الزامی است' }),
    ])]),
    _stp('پوشش و تخفیف', [_sec('تعهدات', [
      _it('select', 'تعداد دیه', { items: _opt(['یک دیه','دو دیه','سه دیه','چهار دیه']) }),
      _it('select', 'سابقه عدم خسارت', { hint: 'اعمال تخفیف مستلزم گواهی عدم خسارت مهرشده از شرکت قبلی است', items: _opt(['بدون سابقه','یک سال','دو سال','سه سال','چهار سال و بیشتر']) }),
      _it('chips_select', 'پوشش‌های تکمیلی', { required: false, items: _opt(['تعدد دیات و دیات غیرمسری','افزایش ریالی دیه','خسارت ناشی از جنگ','اعمال مجاز سرپایی و زیبایی','مسئول فنی داروخانه','افزایش مرور زمان ادعای خسارت']) }),
    ])]),
    _stp('بیمه‌گذار', [_sec('مشخصات', [
      _it('text', 'نام و نام خانوادگی'), _it('national_code', 'کد ملی'), _it('phone_number', 'شماره موبایل'),
      _it('radio', 'گواهی عدم خسارت مهرشده دارید؟', { items: _opt(['بله','خیر']) }),
    ])]),
  ])
}

export function preset_boardliability(): FormSchema {
  return _form('building-board-liability', [
    _stp('مشخصات ساختمان', [_sec('ساختمان', [
      _it('radio', 'نوع کاربری', { items: _opt(['مسکونی','اداری','تجاری']) }),
      _it('number', 'تعداد واحد', { placeholder: 'مثلاً ۱۰' }),
      _it('number', 'تعداد طبقات', { placeholder: 'مثلاً ۵' }),
      _it('radio', 'قدمت ساختمان', { items: _opt(['تا ۲۰ سال','بیش از ۲۰ سال']) }),
      _it('number', 'تعداد کارکنان ساختمان', { required: false, placeholder: 'مثلاً ۲' }),
    ])]),
    _stp('امکانات مشاعات', [_sec('امکانات و ایمنی', [
      _it('chips_select', 'امکانات ساختمان', { required: false, items: _opt(['آسانسور','پله برقی','استخر، سونا و جکوزی','سالن ورزشی','محوطه بازی','پارکینگ','سالن اجتماعات']) }),
      _it('chips_select', 'امکانات ایمنی', { required: false, hint: 'برخی موارد مشمول تخفیف حق بیمه می‌شوند', items: _opt(['نگهبان ۲۴ ساعته','دوربین مداربسته','سیستم اعلان و اطفاء حریق','بیمه‌نامه معتبر آتش‌سوزی']) }),
    ])]),
    _stp('پوشش‌ها', [_sec('پوشش‌های اضافی', [
      _it('chips_select', 'پوشش‌های اضافی', { required: false, items: _opt(['پرداخت خسارت بدون رای دادگاه','حذف فرانشیز هزینه‌های پزشکی','افزایش ریالی دیه','تعدد دیات و دیات غیرمسری','غرامت فوت و نقص عضو بیمه‌گذار','هزینه پزشکی بدون اعمال تعرفه']) }),
      _it('radio', 'سابقه عدم خسارت', { items: _opt(['دارد','ندارد']) }),
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

export function preset_vetliability(): FormSchema {
  return _form('vet-liability', [
    _stp('حرفه', [_sec('اطلاعات حرفه‌ای', [
      _it('select', 'گروه تخصصی', { items: _opt(['دامپزشک عمومی','جراح متخصص','کاردان دامپزشکی']) }),
      _it('select', 'سطح مدرک دامپزشکی', { items: _opt(['کاردانی','کارشناسی','دکترای حرفه‌ای','متخصص']) }),
      _it('radio', 'گواهی سازمان دامپزشکی', { items: _opt(['دارد','ندارد']) }),
      _it('text', 'شماره نظام دامپزشکی'),
    ])]),
    _stp('تعهدات', [_sec('سقف تعهد', [
      _it('select', 'تعهد مالی در طول مدت بیمه', { items: _opt(['۱ میلیارد ریال','۵ میلیارد ریال']) }),
      _it('select', 'سابقه عدم خسارت', { items: _opt(['بدون سابقه','یک سال','دو سال','سه سال و بیشتر']) }),
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
    { insurer: 'سامان', plan: 'طرح اصناف' },
    { insurer: 'سامان', plan: 'مراقب کار — برنزی' },
    { insurer: 'سامان', plan: 'مراقب کار — نقره‌ای' },
    { insurer: 'سامان', plan: 'مراقب کار — طلایی' },
  ],
  'fire-residential': [
    { insurer: 'سامان', plan: 'خانه امن' },
    { insurer: 'سامان', plan: 'جامع منازل — برنزی' },
    { insurer: 'سامان', plan: 'جامع منازل — نقره‌ای' },
    { insurer: 'سامان', plan: 'جامع منازل — طلایی' },
    { insurer: 'سینا', plan: 'بیمه بازار — نقره‌ای' },
    { insurer: 'سینا', plan: 'بیمه بازار — طلایی' },
    { insurer: 'دی', plan: 'خانه ایمن', note: 'استعلام آنلاین از سامانه دیدار' },
  ],
  'medical-liability': [
    { insurer: 'معلم', note: 'قیمت ثابت؛ تخفیف عدم خسارت اعمال نمی‌شود' },
    { insurer: 'دی' },
    { insurer: 'پارسیان', note: 'صدور با نماینده خارجی؛ فرم پیشنهاد الزامی' },
    { insurer: 'کوثر', note: 'پزشکان فقط با یک دیه صادر می‌شود' },
    { insurer: 'ایران' },
    { insurer: 'سینا' },
  ],
  'building-board-liability': [
    { insurer: 'سامان' },
    { insurer: 'پارسیان' },
    { insurer: 'سینا' },
    { insurer: 'دی', note: 'استعلام آنلاین از سامانه دیدار' },
  ],
  'personal-accident': [
    { insurer: 'کوثر', plan: 'حوادث انفرادی' },
    { insurer: 'سینا', plan: 'حوادث خانواده — طرح ۱/۲/۳' },
    { insurer: 'آسیا', plan: 'طرح لبخند' },
  ],
  'vet-liability': [
    { insurer: 'سینا' },
    { insurer: 'سامان' },
  ],
}

export const PRESETS = [
  { key: 'thirdparty',      ic: '🚗', label: 'شخص ثالث',              fn: preset_thirdparty },
  { key: 'goldlife',        ic: '🪙', label: 'عمر بر پایه طلا',       fn: preset_goldlife },
  { key: 'paramed',         ic: '🩺', label: 'پیراپزشکی',             fn: preset_paramed },
  { key: 'body',            ic: '🛡️', label: 'بدنه',                  fn: preset_body },
  { key: 'health',          ic: '🏥', label: 'درمان تکمیلی',          fn: preset_health },
  { key: 'travel',          ic: '✈️', label: 'مسافرتی',               fn: preset_travel },
  { key: 'fire',            ic: '🔥', label: 'آتش‌سوزی',              fn: preset_fire },
  { key: 'firebiz',         ic: '🏪', label: 'آتش‌سوزی تجاری',        fn: preset_firebiz },
  { key: 'firehome',        ic: '🏠', label: 'آتش‌سوزی مسکونی',       fn: preset_firehome },
  { key: 'medliability',    ic: '⚕️', label: 'مسئولیت پزشکی',         fn: preset_medliability },
  { key: 'boardliability',  ic: '🏢', label: 'مسئولیت هیئت مدیره',    fn: preset_boardliability },
  { key: 'accident',        ic: '🤕', label: 'حوادث انفرادی',         fn: preset_accident },
  { key: 'vetliability',    ic: '🐾', label: 'مسئولیت دامپزشکی',     fn: preset_vetliability },
]
