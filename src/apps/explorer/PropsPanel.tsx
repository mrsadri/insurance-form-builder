import type { ControlKey, ExplorerProps } from './explorerDefs'

interface PropsPanelProps {
  controls: ControlKey[]
  props: ExplorerProps
  onChange: (updates: Partial<ExplorerProps>) => void
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className={`toggle${value ? ' on' : ''}`}
      role="switch"
      aria-checked={value}
      tabIndex={0}
      onClick={() => onChange(!value)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onChange(!value)}
    >
      <span>{label}</span>
      <span className="switch" />
    </div>
  )
}

export function PropsPanel({ controls, props, onChange }: PropsPanelProps) {
  if (!controls.length) {
    return (
      <section className="panel controls">
        <div className="controls-head">پراپرتی‌ها و وضعیت‌ها</div>
        <div className="ctrl"><label style={{ color: 'var(--ink-faint)' }}>این کامپوننت پراپرتی قابل‌تنظیم ندارد.</label></div>
      </section>
    )
  }

  const render = (key: ControlKey) => {
    switch (key) {
      case 'inputType': return (
        <div key={key} className="ctrl">
          <label>نوع ورودی (inputType)</label>
          <select value={props.inputType} onChange={e => onChange({ inputType: e.target.value as ExplorerProps['inputType'] })}>
            {['text','number','money','national_code','phone_number'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      )
      case 'radioLayout': return (
        <div key={key} className="ctrl">
          <label>چینش (layout)</label>
          <select value={props.radioLayout} onChange={e => onChange({ radioLayout: e.target.value as 'col' | 'row' })}>
            <option value="col">عمودی</option><option value="row">افقی</option>
          </select>
        </div>
      )
      case 'rangeUnit': return (
        <div key={key} className="ctrl">
          <label>واحد (unit)</label>
          <input type="text" value={props.rangeUnit} onChange={e => onChange({ rangeUnit: e.target.value })} />
        </div>
      )
      case 'stepCurrent': return (
        <div key={key} className="ctrl">
          <label>استپ فعلی</label>
          <select value={props.stepCurrent} onChange={e => onChange({ stepCurrent: +e.target.value })}>
            {['۱ — محصول','۲ — مشخصات','۳ — پوشش‌ها','۴ — پرداخت'].map((t, i) => <option key={i} value={i}>{t}</option>)}
          </select>
        </div>
      )
      case 'selectOptions': return (
        <div key={key} className="ctrl" style={{ gridColumn: '1/-1' }}>
          <label>گزینه‌ها (با «،» جدا کنید)</label>
          <input type="text" value={props.selectOptions.join('، ')}
            onChange={e => onChange({ selectOptions: e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean) })} />
        </div>
      )
      case 'chipsOptions': return (
        <div key={key} className="ctrl" style={{ gridColumn: '1/-1' }}>
          <label>گزینه‌ها (با «،» جدا کنید)</label>
          <input type="text" value={props.chipsOptions.join('، ')}
            onChange={e => onChange({ chipsOptions: e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean) })} />
        </div>
      )
      case 'radioOptions': return (
        <div key={key} className="ctrl" style={{ gridColumn: '1/-1' }}>
          <label>گزینه‌ها (با «،» جدا کنید)</label>
          <input type="text" value={props.radioOptions.join('، ')}
            onChange={e => onChange({ radioOptions: e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean) })} />
        </div>
      )
      case 'label': return <div key={key} className="ctrl"><label>عنوان (title)</label><input type="text" value={props.label} onChange={e => onChange({ label: e.target.value })} /></div>
      case 'placeholder': return <div key={key} className="ctrl"><label>placeholder</label><input type="text" value={props.placeholder} onChange={e => onChange({ placeholder: e.target.value })} /></div>
      case 'hint': return <div key={key} className="ctrl"><label>متن راهنما (hint)</label><input type="text" value={props.hint} onChange={e => onChange({ hint: e.target.value })} /></div>
      case 'errorMessage': return <div key={key} className="ctrl"><label>پیام خطا</label><input type="text" value={props.errorMessage} onChange={e => onChange({ errorMessage: e.target.value })} /></div>
      case 'showHint': return <Toggle key={key} label="نمایش hint" value={props.showHint} onChange={v => onChange({ showHint: v })} />
      case 'required': return <Toggle key={key} label="اجباری (required)" value={props.required} onChange={v => onChange({ required: v })} />
      case 'disabled': return <Toggle key={key} label="غیرفعال (disabled_if)" value={props.disabled} onChange={v => onChange({ disabled: v })} />
      case 'error': return <Toggle key={key} label="خطا (validations)" value={props.error} onChange={v => onChange({ error: v })} />
      case 'filled': return <Toggle key={key} label="پرشده (value)" value={props.filled} onChange={v => onChange({ filled: v })} />
      default: return null
    }
  }

  return (
    <section className="panel controls">
      <div className="controls-head">پراپرتی‌ها و وضعیت‌ها</div>
      <div className="controls-grid">
        {controls.map(render)}
      </div>
    </section>
  )
}
