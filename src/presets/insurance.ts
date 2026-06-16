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

export const PRESETS = [
  { key: 'thirdparty', ic: '🚗', label: 'شخص ثالث', fn: preset_thirdparty },
  { key: 'goldlife',   ic: '🪙', label: 'عمر بر پایه طلا', fn: preset_goldlife },
  { key: 'paramed',   ic: '🩺', label: 'پیراپزشکی', fn: preset_paramed },
  { key: 'body',      ic: '🛡️', label: 'بدنه', fn: preset_body },
  { key: 'health',    ic: '🏥', label: 'درمان تکمیلی', fn: preset_health },
  { key: 'travel',    ic: '✈️', label: 'مسافرتی', fn: preset_travel },
  { key: 'fire',      ic: '🔥', label: 'آتش‌سوزی', fn: preset_fire },
]
