// Preview view: paste or load a FormSchema JSON and render it as a fully interactive multi-step wizard.
import { useState } from 'react'
import { Wizard } from '../../wizard/Wizard'
import { SchemaPanel } from '../explorer/SchemaPanel'
import { PRESETS } from '../../presets/insurance'
import type { FormSchema } from '../../core/types'

function jsonHighlight(json: string) {
  return json.split('\n').map(line => {
    const t = line
      .replace(/</g, '&lt;')
      .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="k">$1</span>$2')
      .replace(/(:\s*)("(?:[^"\\]|\\.)*")/g, '$1<span class="s">$2</span>')
    return `<span class="ln">${t || '&nbsp;'}</span>`
  }).join('')
}

interface PreviewProps {
  initialSchema?: FormSchema | null
}

export function Preview({ initialSchema }: PreviewProps) {
  const [jsonText, setJsonText] = useState(initialSchema ? JSON.stringify(initialSchema, null, 2) : '')
  const [schema, setSchema] = useState<FormSchema | null>(initialSchema ?? null)
  const [parseErr, setParseErr] = useState('')
  const [key, setKey] = useState(0)

  const parse = (text = jsonText) => {
    setParseErr('')
    if (!text.trim()) { setParseErr('کادر خالی است.'); return }
    try {
      const obj = JSON.parse(text) as FormSchema
      // ensure all items have ids
      let uid = 0
      ;(obj.steps || []).forEach(st =>
        (st.sections || []).forEach(sec =>
          (sec.items || []).forEach(it => { if (!it.id) it.id = 'pv' + (++uid) })
        )
      )
      setSchema(obj)
      setKey(k => k + 1)
    } catch (e) {
      setParseErr('JSON نامعتبر: ' + (e as Error).message)
    }
  }

  const loadPreset = (fn: () => FormSchema) => {
    const sc = fn()
    const text = JSON.stringify(sc, null, 2)
    setJsonText(text)
    parse(text)
  }

  return (
    <>
      <div className="stage">
        <div className="stage-head">
          <div className="eyebrow"><span className="k">render</span> <span>{'{ JSON → wizard }'}</span></div>
          <h2>نمایش فرم</h2>
          <p className="desc">خروجی JSON فرم‌ساز را این‌جا paste کن تا ویزارد تعامل‌پذیر ساخته شود.</p>
        </div>
        <div className="howto">
          ۱) از «فرم‌ساز» دکمه‌ی «نمایش در پیش‌نمایش» را بزن یا یکی از «نمونه‌های آماده»ی زیر را انتخاب کن.
          ۲) JSON در کادر قرار می‌گیرد. ۳) «نمایش فرم» را بزن تا ویزارد تعامل‌پذیر ساخته شود.
        </div>

        <div className="pv-presets">
          <span style={{ fontSize: 12, color: 'var(--ink-faint)', alignSelf: 'center' }}>نمونه‌های آماده:</span>
          {PRESETS.map(p => (
            <button key={p.key} className="pv-preset" onClick={() => loadPreset(p.fn)}>
              <span className="ic">{p.ic}</span>{p.label}
            </button>
          ))}
        </div>

        <section className="panel pv-input">
          <textarea
            className="pv-textarea"
            spellCheck={false}
            dir="ltr"
            placeholder='{ "product_id": "...", "steps": [ ... ] }'
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
          />
          <div className="pv-bar">
            <button className="btn btn-primary" onClick={() => parse()}>نمایش فرم</button>
            {parseErr && <span className="pv-err">{parseErr}</span>}
          </div>
        </section>

        {schema
          ? <Wizard key={key} schema={schema} />
          : <div className="pv-empty">هنوز فرمی بارگذاری نشده. JSON را paste کن و «نمایش فرم» را بزن.</div>}
      </div>

      <SchemaPanel
        title="form · loaded JSON"
        jsonText={schema ? JSON.stringify(schema, null, 2) : undefined}
        note={schema
          ? 'این همان JSON بارگذاری‌شده است. مقادیری که در ویزارد وارد می‌کنی روی همین id‌ها ذخیره می‌شوند.'
          : 'JSON را در کادر paste و «نمایش فرم» را بزن.'}
      />
    </>
  )
}
