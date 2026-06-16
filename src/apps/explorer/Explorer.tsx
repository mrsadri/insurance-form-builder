import { useState } from 'react'
import { PropsPanel } from './PropsPanel'
import { Gallery } from './Gallery'
import { SchemaPanel } from './SchemaPanel'
import {
  COMPONENT_DEFS, TYPE_DEFAULTS, defaultLiveState,
  type ExplorerProps, type LiveState,
} from './explorerDefs'

const DEFAULT_PROPS: ExplorerProps = {
  label: 'مبلغ سرمایه‌ی بیمه', placeholder: 'مثلاً ۱۰۰٬۰۰۰٬۰۰۰',
  hint: 'این مقدار پایه‌ی محاسبه‌ی حق بیمه است.', showHint: true,
  required: true, disabled: false, error: false,
  errorMessage: 'حداقل سرمایه‌ی قابل‌بیمه ۱۰٬۰۰۰٬۰۰۰ تومان است.',
  filled: false, inputType: 'money', radioLayout: 'col', rangeUnit: 'سال', stepCurrent: 1,
  selectOptions: ['خودم','همسر','فرزند','پدر / مادر'],
  chipsOptions: ['سرقت درجا','شکست شیشه','حوادث راننده','بلایای طبیعی','نوسانات بازار'],
  radioOptions: ['بله','خیر','نمی‌دانم'],
}

const TYPE_KEYS = Object.keys(COMPONENT_DEFS)

function activeKeys(type: string, props: ExplorerProps): Set<string> {
  const s = new Set<string>()
  if (props.showHint) s.add('hint')
  if (props.required) s.add('required')
  if (props.disabled) s.add('disabled')
  if (props.error) s.add('error')
  if (props.filled) s.add('filled')
  if (props.rangeUnit) s.add('rangeUnit')
  s.add('inputType'); s.add('label'); s.add('placeholder')
  return s
}

export function Explorer() {
  const [type, setType] = useState(TYPE_KEYS[0])
  const def = COMPONENT_DEFS[type]
  const [props, setProps] = useState<ExplorerProps>(DEFAULT_PROPS)
  const [live, setLive] = useState<LiveState>(defaultLiveState)

  const update = (u: Partial<ExplorerProps>) => setProps(p => ({ ...p, ...u }))

  const switchType = (t: string) => {
    setType(t)
    const d = TYPE_DEFAULTS[t]
    if (d) setProps(p => ({ ...p, ...d }))
    setLive(defaultLiveState())
  }

  if (!def) return null

  return (
    <>
      <div className="stage">
        <div className="stage-head">
          <div className="eyebrow"><span className="k">"type":</span> <span>"{type}"</span></div>
          <h2>{def.name}</h2>
          <p className="desc">{def.desc}</p>
        </div>

        {/* Component type navigation */}
        <div className="ex-typenav">
          {TYPE_KEYS.map(k => (
            <button
              key={k}
              className={`ex-typeBtn${k === type ? ' on' : ''}`}
              onClick={() => switchType(k)}
            >
              {COMPONENT_DEFS[k].name}
            </button>
          ))}
        </div>

        <div className="howto">
          از پنل «پراپرتی‌ها» مقادیر و حالت‌ها را تغییر بده. «نمونه‌ی زنده» تعامل‌پذیر است و کارت‌های پایین همه‌ی state‌ها را هم‌زمان نشان می‌دهند.
        </div>
        <PropsPanel controls={def.controls} props={props} onChange={update} />
        <section className="panel live-wrap">
          <div className="panel-strip">
            نمونه‌ی زنده <span className="pill">{def.api}</span>
          </div>
          <div className="live-body">
            {def.renderState('live', props, live, setLive)}
          </div>
        </section>
        <Gallery def={def} props={props} live={live} setLive={setLive} />
      </div>
      <SchemaPanel
        title={`schema · ${type}`}
        schemaLines={def.schema}
        note={def.note}
        activeKeys={activeKeys(type, props)}
      />
    </>
  )
}
