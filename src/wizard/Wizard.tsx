// Stateful multi-step form wizard: renders the current step's sections, validates required fields, and advances through steps.
import { useState } from 'react'
import { Stepper } from './Stepper'
import { WizardFooter } from './WizardFooter'
import { OfferList } from './OfferList'
import { FormField } from '../core/renderer/FormField'
import type { FormSchema, PlateValue, JalaliDate } from '../core/types'

type FieldValue = string | number | (string | number)[] | PlateValue | JalaliDate | null

interface WizardProps {
  schema: FormSchema
}

export function Wizard({ schema }: WizardProps) {
  const [current, setCurrent] = useState(0)
  const [values, setValues] = useState<Record<string, FieldValue>>({})
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [done, setDone] = useState(false)

  const steps = schema.steps
  const step = steps[current]

  const isFilled = (id: string, type: string): boolean => {
    const v = values[id]
    if (type === 'chips_select') return Array.isArray(v) && v.length > 0
    if (type === 'range') return true
    if (type === 'datepicker') return !!v
    if (type === 'license_plate') {
      const pv = v as PlateValue
      return !!(pv?.p2 && pv?.letter && pv?.p3 && pv?.prov)
    }
    return v != null && String(v).trim() !== ''
  }

  const validate = () => {
    const errs = new Set<string>()
    step.sections.forEach(sec => sec.items.forEach(item => {
      if (item.required && !isFilled(item.id, item.type)) errs.add(item.id)
    }))
    setErrors(errs)
    return errs.size === 0
  }

  const handleNext = () => {
    if (!validate()) return
    setErrors(new Set())
    if (current < steps.length - 1) setCurrent(c => c + 1)
    else setDone(true)
  }

  const handleBack = () => { if (current > 0) { setCurrent(c => c - 1); setErrors(new Set()) } }

  return (
    <section className="panel pv-card">
      {done && (
        <>
          <div className="howto" style={{ marginBottom: 18 }}>فرم با موفقیت ثبت شد ✓ (نمونه‌ی نمایشی)</div>
          <OfferList productId={schema.product_id} />
        </>
      )}
      <div style={{ marginBottom: 22 }}>
        <Stepper steps={steps} current={current} onStepClick={setCurrent} fullWidth />
      </div>
      <div className="pv-sections">
        {step.sections.map((sec, si) => (
          <div key={si} className="section" style={{ maxWidth: 'none' }}>
            {sec.title && <div className="section-head">{sec.title}</div>}
            <div className="section-body">
              {sec.items.length === 0
                ? <div className="pv-empty">بدون فیلد</div>
                : sec.items.map(item => (
                  <FormField
                    key={item.id}
                    item={item}
                    value={values[item.id]}
                    isError={errors.has(item.id)}
                    onChange={v => {
                      setValues(prev => ({ ...prev, [item.id]: v as FieldValue }))
                      setErrors(prev => { const n = new Set(prev); n.delete(item.id); return n })
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <WizardFooter
          isFirst={current === 0}
          isLast={current === steps.length - 1}
          onBack={handleBack}
          onNext={handleNext}
          fullWidth
        />
      </div>
    </section>
  )
}
