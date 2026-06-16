import type { ReactNode } from 'react'
import { createElement as h } from 'react'
import { TextField } from '../../core/renderer/TextField'
import { SelectField } from '../../core/renderer/SelectField'
import { ChipsSelect } from '../../core/renderer/ChipsSelect'
import { RadioGroup } from '../../core/renderer/RadioGroup'
import { RangeSlider } from '../../core/renderer/RangeSlider'
import { DatePicker } from '../../core/renderer/DatePicker'
import { LicensePlate } from '../../core/renderer/LicensePlate'
import { Stepper } from '../../wizard/Stepper'
import { WizardFooter } from '../../wizard/WizardFooter'
import { todayJalali } from '../../core/jalali'
import type { JalaliDate } from '../../core/types'

export type ControlKey =
  | 'inputType' | 'radioLayout' | 'rangeUnit' | 'stepCurrent'
  | 'selectOptions' | 'chipsOptions' | 'radioOptions'
  | 'label' | 'placeholder' | 'hint' | 'errorMessage'
  | 'showHint' | 'required' | 'disabled' | 'error' | 'filled'

export interface ExplorerProps {
  label: string
  placeholder: string
  hint: string
  showHint: boolean
  required: boolean
  disabled: boolean
  error: boolean
  errorMessage: string
  filled: boolean
  inputType: 'text' | 'number' | 'money' | 'national_code' | 'phone_number'
  radioLayout: 'col' | 'row'
  rangeUnit: string
  stepCurrent: number
  selectOptions: string[]
  chipsOptions: string[]
  radioOptions: string[]
}

export interface LiveState {
  selectOpen: boolean
  selectVal: string | null
  calOpen: boolean
  calY: number; calM: number; calD: number
  calViewY: number; calViewM: number
  chips: Set<number>
  radio: number
  range: number
  footerLoading: boolean
}

export const defaultLiveState = (): LiveState => {
  const today = todayJalali()
  return {
    selectOpen: false, selectVal: null,
    calOpen: false,
    calY: today.jy, calM: today.jm, calD: today.jd,
    calViewY: today.jy, calViewM: today.jm,
    chips: new Set([0, 2]), radio: 0, range: 4, footerLoading: false,
  }
}

export interface SchemaLine { t: string; k?: string; c?: boolean }
export interface ComponentDef {
  name: string; group: string; api: string; desc: string
  controls: ControlKey[]
  states: { k: string; t: string }[]
  schema: SchemaLine[]
  note: string
  renderState(sk: string, props: ExplorerProps, live: LiveState, setLive: (l: LiveState) => void): ReactNode
}

const FIELD_STATES = [
  { k: 'default', t: 'Default' }, { k: 'hover', t: 'Hover' }, { k: 'focus', t: 'Focus' },
  { k: 'filled', t: 'Filled' }, { k: 'disabled', t: 'Disabled' }, { k: 'error', t: 'Error' },
]

const filledValues: Record<string, string> = {
  text: 'علی رضایی', number: '۱۴۰۵', money: '۱۰۰٬۰۰۰٬۰۰۰',
  national_code: '۰۰۱۲۳۴۵۶۷۸', phone_number: '۰۹۱۲۱۲۳۴۵۶۷',
}

function baseField(sk: string, p: ExplorerProps) {
  const isLive = sk === 'live'
  return {
    title: p.label,
    placeholder: p.placeholder,
    hint: p.hint,
    showHint: p.showHint,
    required: p.required,
    isDisabled: sk === 'disabled' || (isLive && p.disabled),
    isError: sk === 'error' || (isLive && p.error),
    errorMessage: p.errorMessage,
    stateClass: sk !== 'live' ? sk : undefined,
    interactive: isLive,
  }
}

export const COMPONENT_DEFS: Record<string, ComponentDef> = {
  textfield: {
    name: 'TextField', group: 'فیلدهای ورودی', api: 'text · number · money · …',
    desc: 'یک کامپوننت برای همه‌ی ورودی‌های تک‌خطی؛ با پراپرتی inputType فرمت و مَسک عوض می‌شود.',
    controls: ['inputType','label','placeholder','hint','showHint','required','disabled','error','errorMessage','filled'],
    states: FIELD_STATES,
    schema: [
      {t:'{'},{t:'  "type": "text",  // number | money | national_code | phone_number',k:'inputType',c:true},
      {t:'  "title": "string",',k:'label'},{t:'  "placeholder": "string",',k:'placeholder'},{t:'  "id": "string",'},
      {t:'  "value": "string",',k:'filled'},{t:'  "required": "boolean",',k:'required'},{t:'  "hint": "string",',k:'hint'},
      {t:'  "conditions": {'},{t:'    "show_if": "string",'},{t:'    "disabled_if": "string",',k:'disabled'},
      {t:'    "required_if": "string"',k:'required'},{t:'  },'},{t:'  "validations": {',k:'error'},
      {t:'    "min": "number",',k:'error'},{t:'    "max": "number",',k:'error'},
      {t:'    "regex": "string",',k:'error'},{t:'    "regex_hint": "string"',k:'error',c:true},{t:'  }'},{t:'}'},
    ],
    note: '<b>national_code</b> و <b>phone_number</b> در اسکیما validations ندارند؛ اعتبارسنجی‌شان داخلی است.',
    renderState(sk, p) {
      const filled = sk === 'filled' || (sk === 'live' && p.filled)
      return h(TextField, { ...baseField(sk, p), inputType: p.inputType, value: filled ? filledValues[p.inputType] : '' })
    },
  },

  license_plate: {
    name: 'LicensePlate (پلاک)', group: 'فیلدهای ورودی', api: 'license_plate',
    desc: 'اینپوت ترکیبی پلاک خودروی ایران: دو رقم + حرف + سه رقم + کد استان، با چیدمان واقعی پلاک.',
    controls: ['label','hint','showHint','required','disabled','error','errorMessage'],
    states: [{k:'default',t:'Default'},{k:'focus',t:'Focus'},{k:'filled',t:'Filled'},{k:'disabled',t:'Disabled'},{k:'error',t:'Error'}],
    schema: [
      {t:'{'},{t:'  "type": "license_plate",'},{t:'  "title": "string",',k:'label'},{t:'  "id": "string",'},
      {t:'  "value": { "p2", "letter", "p3", "prov" },',k:'filled'},
      {t:'  "required": "boolean",',k:'required'},{t:'  "hint": "string",',k:'hint'},
      {t:'  "conditions": { "show_if", "disabled_if", "required_if" }',k:'required'},{t:'}'},
    ],
    note: 'مقدار این فیلد ترکیبی است. اعتبارسنجی باید کامل بودن هر چهار بخش را چک کند.',
    renderState(sk, p) {
      const filled = sk === 'filled'
      return h(LicensePlate, {
        ...baseField(sk, p),
        isFocus: sk === 'focus',
        value: filled ? { p2: '۱۲', letter: 'ل', p3: '۳۴۵', prov: '۶۷' } : {},
      })
    },
  },

  range: {
    name: 'RangeSlider', group: 'فیلدهای ورودی', api: 'range',
    desc: 'اسلایدر تک‌دسته. تنها فیلدی است که placeholder ندارد و به‌جایش unit دارد.',
    controls: ['label','hint','showHint','required','disabled','error','errorMessage','rangeUnit'],
    states: [{k:'default',t:'Default'},{k:'dragging',t:'Dragging'},{k:'disabled',t:'Disabled'},{k:'error',t:'Error'}],
    schema: [
      {t:'{'},{t:'  "type": "range",'},{t:'  "title": "string",',k:'label'},{t:'  "id": "string",'},{t:'  "value": "number",'},
      {t:'  "required": "boolean",',k:'required'},{t:'  "hint": "string",',k:'hint'},{t:'  "conditions": { ... },'},
      {t:'  "options": {'},{t:'    "min": "number",'},{t:'    "max": "number",',c:true},{t:'    "unit": "string"',k:'rangeUnit'},{t:'  },'},
      {t:'  "validations": { "min": "number", "max": "number" }',k:'error'},{t:'}'},
    ],
    note: '<b>options.min/max</b> بازه‌ی اسلایدر است و <b>validations.min/max</b> محدوده‌ی مجازِ خطا.',
    renderState(sk, p, live, setLive) {
      const isLive = sk === 'live'
      return h(RangeSlider, {
        title: p.label, hint: p.hint, showHint: p.showHint, required: p.required,
        isError: sk === 'error' || (isLive && p.error),
        isDisabled: sk === 'disabled' || (isLive && p.disabled),
        isDragging: sk === 'dragging', errorMessage: p.errorMessage,
        stateClass: sk !== 'live' ? sk : undefined,
        min: 1, max: 10, unit: p.rangeUnit,
        value: isLive ? live.range : (sk === 'dragging' ? 7 : 4),
        interactive: isLive,
        onChange: isLive ? (v) => setLive({ ...live, range: v }) : undefined,
      })
    },
  },

  datepicker: {
    name: 'DatePicker', group: 'فیلدهای ورودی', api: 'datepicker',
    desc: 'تریگر ورودی + پاپ‌اور تقویم شمسی. به‌صورت پیش‌فرض روی تاریخ امروز است.',
    controls: ['label','placeholder','hint','showHint','required','disabled','error','errorMessage'],
    states: [{k:'default',t:'Default'},{k:'hover',t:'Hover'},{k:'open',t:'Open'},{k:'filled',t:'Filled (امروز)'},{k:'disabled',t:'Disabled'},{k:'error',t:'Error'}],
    schema: [
      {t:'{'},{t:'  "type": "datepicker",'},{t:'  "title": "string",',k:'label'},{t:'  "placeholder": "string",',k:'placeholder'},
      {t:'  "id": "string",'},{t:'  "value": "Date",',k:'filled'},{t:'  "required": "boolean",',k:'required'},{t:'  "hint": "string",',k:'hint'},
      {t:'  "conditions": { ... },'},{t:'  "options": { "min": "Date", "max": "Date" }'},{t:'}'},
    ],
    note: 'تقویم <b>شمسی</b> و دقیق است. پیش‌فرض روی <b>امروز</b> است.',
    renderState(sk, p) {
      const today = todayJalali()
      const filled = sk === 'filled' || sk === 'open' || sk === 'live'
      return h(DatePicker, {
        ...baseField(sk, p),
        value: filled ? today : null,
        forceOpen: sk === 'open',
        popupStatic: sk === 'open',
      })
    },
  },

  select: {
    name: 'Select', group: 'فیلدهای انتخابی', api: 'select',
    desc: 'انتخاب تک‌گزینه‌ای از منو. هر option می‌تواند با show_if شرطی باشد.',
    controls: ['selectOptions','label','placeholder','hint','showHint','required','disabled','error','errorMessage','filled'],
    states: [{k:'default',t:'Default'},{k:'hover',t:'Hover'},{k:'open',t:'Open'},{k:'filled',t:'Filled'},{k:'disabled',t:'Disabled'},{k:'error',t:'Error'}],
    schema: [
      {t:'{'},{t:'  "type": "select",'},{t:'  "title": "string",',k:'label'},{t:'  "placeholder": "string",',k:'placeholder'},
      {t:'  "id": "string",'},{t:'  "value": "any",',k:'filled'},{t:'  "required": "boolean",',k:'required'},{t:'  "hint": "string",',k:'hint'},
      {t:'  "items": [{ "label", "value", "conditions": { "show_if" } }],'},{t:'  "conditions": { "show_if", "disabled_if", "required_if" }',k:'required'},{t:'}'},
    ],
    note: 'زیرکامپوننت <b>Option</b> حالت‌های default / hover / selected و <b>hidden</b> (برای show_if) دارد.',
    renderState(sk, p, live, setLive) {
      const isLive = sk === 'live'
      const items = p.selectOptions.map(o => ({ label: o, value: o }))
      const filled = sk === 'filled' || (isLive && p.filled)
      return h(SelectField, {
        ...baseField(sk, p),
        items, placeholder: p.placeholder || 'یک گزینه را انتخاب کنید',
        value: isLive ? live.selectVal : (filled ? items[1]?.value || items[0]?.value : null),
        forceOpen: sk === 'open',
        popupStatic: sk === 'open',
        onSelect: isLive ? (v) => setLive({ ...live, selectVal: String(v), selectOpen: false }) : undefined,
      })
    },
  },

  chips_select: {
    name: 'ChipsSelect', group: 'فیلدهای انتخابی', api: 'chips_select',
    desc: 'انتخاب چندگزینه‌ای به‌شکل چیپ. گزینه‌ها قابل‌کانفیگ‌اند و تعداد با options.min/max محدود می‌شود.',
    controls: ['chipsOptions','label','hint','showHint','required','disabled','error','errorMessage'],
    states: [{k:'default',t:'Default'},{k:'selected',t:'Selected'},{k:'focus',t:'Focus'},{k:'disabled',t:'Disabled'},{k:'error',t:'Error'}],
    schema: [
      {t:'{'},{t:'  "type": "chips_select",'},{t:'  "title": "string",',k:'label'},{t:'  "id": "string",'},{t:'  "value": "any",  // array'},
      {t:'  "required": "boolean",',k:'required'},{t:'  "hint": "string",',k:'hint'},{t:'  "items": [{ "label", "value", "show_if" }],'},
      {t:'  "conditions": { ... },'},{t:'  "options": { "min", "max" },  // تعداد انتخاب'},
      {t:'  "validations": { "min", "max", "regex", "regex_hint" }',k:'error'},{t:'}'},
    ],
    note: 'تنها فیلدی که هم <b>options</b> (تعداد انتخاب) و هم <b>validations</b> دارد.',
    renderState(sk, p, live, setLive) {
      const isLive = sk === 'live'
      const items = p.chipsOptions.map(o => ({ label: o, value: o }))
      const value = isLive ? [...live.chips].map(i => p.chipsOptions[i]).filter(Boolean)
        : sk === 'selected' ? [p.chipsOptions[0], p.chipsOptions[2]].filter(Boolean) : []
      return h(ChipsSelect, {
        ...baseField(sk, p), items, value,
        focusIndex: sk === 'focus' ? 1 : undefined,
        onChange: isLive ? (vs) => {
          const s = new Set(vs.map(v => p.chipsOptions.indexOf(String(v))).filter(i => i >= 0))
          setLive({ ...live, chips: s })
        } : undefined,
      })
    },
  },

  radio: {
    name: 'RadioGroup', group: 'فیلدهای انتخابی', api: 'radio',
    desc: 'انتخاب تک‌گزینه‌ای با نمایش همه‌ی گزینه‌ها. گزینه‌ها قابل‌کانفیگ‌اند.',
    controls: ['radioOptions','label','hint','showHint','required','disabled','error','errorMessage','radioLayout'],
    states: [{k:'default',t:'Default'},{k:'selected',t:'Selected'},{k:'focus',t:'Focus'},{k:'disabled',t:'Disabled'},{k:'error',t:'Error'}],
    schema: [
      {t:'{'},{t:'  "type": "radio",'},{t:'  "title": "string",',k:'label'},{t:'  "id": "string",'},{t:'  "value": "any",'},
      {t:'  "required": "boolean",',k:'required'},{t:'  "hint": "string",',k:'hint'},{t:'  "items": [{ "label", "value", "show_if" }],'},
      {t:'  "conditions": { "show_if", "disabled_if", "required_if" }',k:'required'},{t:'}'},
    ],
    note: 'زیرکامپوننت <b>Radio item</b>: default / selected / focus / disabled.',
    renderState(sk, p, live, setLive) {
      const isLive = sk === 'live'
      const items = p.radioOptions.map(o => ({ label: o, value: o }))
      return h(RadioGroup, {
        ...baseField(sk, p), items, layout: p.radioLayout,
        value: isLive ? p.radioOptions[live.radio] : (sk === 'selected' ? items[0]?.value : null),
        focusIndex: sk === 'focus' ? 0 : undefined,
        onChange: isLive ? (v) => setLive({ ...live, radio: p.radioOptions.indexOf(String(v)) }) : undefined,
      })
    },
  },

  section: {
    name: 'Section', group: 'ساختار ویزارد', api: 'section',
    desc: 'گروهی از فیلدها زیر یک عنوان. کل سکشن می‌تواند با show_if شرطی نمایش داده شود.',
    controls: ['label'], states: [{ k: 'default', t: 'Default' }],
    schema: [
      {t:'{'},{t:'  "title": "string",',k:'label'},{t:'  "conditions": { "show_if": "string" | null },'},{t:'  "items": [ /* فیلدها */ ]'},{t:'}'},
    ],
    note: 'وقتی show_if برقرار نباشد کل سکشن رندر نمی‌شود (نه اینکه disable شود).',
    renderState(_sk, p) {
      return h('div', { className: 'section' },
        h('div', { className: 'section-head' }, p.label || 'مشخصات بیمه‌شده', h('span', { className: 'section-cond' }, 'show_if')),
        h('div', { className: 'section-body' },
          h('div', { className: 'field' }, h('div', { className: 'field__label' }, 'نام ', h('span', { className: 'req' }, '*')), h('input', { className: 'input', tabIndex: -1, placeholder: 'نام' })),
          h('div', { className: 'field' }, h('div', { className: 'field__label' }, 'سن'), h('input', { className: 'input', tabIndex: -1, placeholder: 'سن' })),
        ),
      )
    },
  },

  stepper: {
    name: 'Stepper', group: 'ساختار ویزارد', api: 'steps[]',
    desc: 'پیشرفت بین استپ‌ها. تغییر یک استپ قبلی داده‌ی استپ‌های بعدی را ریست می‌کند.',
    controls: ['stepCurrent'], states: [{ k: 'overview', t: 'States' }],
    schema: [
      {t:'steps: [{'},{t:'  "step_id": "string",',c:true},{t:'  "sections": [ ... ]'},{t:'}]'},{t:''},{t:'// تغییر استپ قبلی → ریست استپ‌های بعدی',c:true},
    ],
    note: 'استپ‌ها سه حالت دارند: <b>completed</b> / <b>current</b> / <b>upcoming</b>.',
    renderState(_sk, p, live, setLive) {
      const labels = ['محصول','مشخصات','پوشش‌ها','پرداخت']
      return h(Stepper, {
        steps: labels.map(t => ({ title: t })),
        current: p.stepCurrent,
        onStepClick: (i) => setLive({ ...live }),
      })
    },
  },

  footer: {
    name: 'Wizard Footer', group: 'ساختار ویزارد', api: 'navigation',
    desc: 'دکمه‌های حرکت بین استپ‌ها. هر POST منتظر استپ بعدی است، پس دکمه‌ی بعدی حالت Loading دارد.',
    controls: [], states: [{ k: 'default', t: 'Default' }, { k: 'loading', t: 'Loading' }, { k: 'disabled', t: 'Disabled' }],
    schema: [
      {t:'POST /rfq-wizard/{product_id}/{step}'},{t:'// returns → next step_id',c:true},{t:''},
      {t:'POST /rfq-wizard/{product_id}/complete'},{t:'// آخرین استپ: ارسال همه‌ی مقادیر',c:true},
    ],
    note: '«مرحله بعد» وقتی فرم نامعتبر است <b>Disabled</b> و حین دریافت استپ بعدی <b>Loading</b> می‌شود.',
    renderState(sk, _p, live, setLive) {
      const isLive = sk === 'live'
      const loading = isLive ? live.footerLoading : sk === 'loading'
      const handleNext = isLive ? () => {
        setLive({ ...live, footerLoading: true })
        setTimeout(() => setLive({ ...live, footerLoading: false }), 900)
      } : undefined
      return h(WizardFooter, {
        isFirst: false, isLast: false,
        loading, onBack: () => {}, onNext: handleNext || (() => {}),
      })
    },
  },
}

export const TYPE_DEFAULTS: Record<string, Partial<ExplorerProps>> = {
  textfield:     { label: 'مبلغ سرمایه‌ی بیمه', placeholder: 'مثلاً ۱۰۰٬۰۰۰٬۰۰۰', hint: 'این مقدار پایه‌ی محاسبه‌ی حق بیمه است.', errorMessage: 'حداقل سرمایه‌ی قابل‌بیمه ۱۰٬۰۰۰٬۰۰۰ تومان است.' },
  range:         { label: 'مدت بیمه‌نامه', placeholder: '', hint: 'بازه‌ی پوشش را انتخاب کنید.', errorMessage: 'مدت بیمه‌نامه باید بین ۱ تا ۱۰ سال باشد.' },
  datepicker:    { label: 'تاریخ شروع بیمه‌نامه', placeholder: 'تاریخ را انتخاب کنید', hint: 'تاریخ شروع پوشش را انتخاب کنید.', errorMessage: 'تاریخ شروع نمی‌تواند پیش از امروز باشد.' },
  select:        { label: 'نسبت بیمه‌شده', placeholder: 'یک گزینه را انتخاب کنید', hint: 'نسبت بیمه‌شده با بیمه‌گذار را مشخص کنید.', errorMessage: 'انتخاب نسبت بیمه‌شده الزامی است.' },
  chips_select:  { label: 'پوشش‌های اضافه', placeholder: '', hint: 'حداقل یک پوشش را انتخاب کنید.', errorMessage: 'حداقل یک و حداکثر سه پوشش انتخاب کنید.' },
  radio:         { label: 'سابقه‌ی بیماری خاص دارید؟', placeholder: '', hint: 'یکی از گزینه‌ها را انتخاب کنید.', errorMessage: 'پاسخ به سؤال سابقه‌ی بیماری الزامی است.' },
  section:       { label: 'مشخصات بیمه‌شده' },
  license_plate: { label: 'پلاک خودرو', hint: 'شماره پلاک ثبت‌شده را وارد کنید.', errorMessage: 'پلاک خودرو باید کامل وارد شود.' },
}
