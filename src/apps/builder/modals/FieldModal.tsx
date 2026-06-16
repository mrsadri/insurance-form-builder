import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import type { BuilderField } from '../builderTypes'
import { FB_TYPES, FB_HAS_OPTS, FB_LBL, FB_OPTS } from '../builderTypes'
import { makeField } from '../builderReducer'

interface FieldModalProps {
  open: boolean
  mode: 'add' | 'edit'
  initial?: BuilderField
  onSave: (field: BuilderField) => void
  onClose: () => void
}

export function FieldModal({ open, mode, initial, onSave, onClose }: FieldModalProps) {
  const [type, setType] = useState<BuilderField['type']>(initial?.type || 'text')
  const [label, setLabel] = useState(initial?.label || '')
  const [opts, setOpts] = useState((initial?.options || []).join('، '))
  const [required, setRequired] = useState(!!initial?.required)

  const isEdit = mode === 'edit'

  const handleTypeChange = (t: BuilderField['type']) => {
    setType(t)
    if (!isEdit && !label.trim()) setLabel(FB_LBL[t] || '')
    if (FB_HAS_OPTS(t) && !opts.trim()) setOpts((FB_OPTS[t] || []).join('، '))
  }

  const handleSave = () => {
    const lbl = label.trim() || FB_LBL[type] || 'فیلد'
    const options = FB_HAS_OPTS(type)
      ? opts.split(/[،,]/).map(s => s.trim()).filter(Boolean)
      : undefined
    const field = isEdit && initial
      ? { ...initial, type, label: lbl, required, options }
      : makeField(type, { label: lbl, required, options })
    onSave(field)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fb-pop-overlay">
          <Dialog.Content className="fb-card" aria-describedby={undefined}>
            <Dialog.Title asChild>
              <h4>{isEdit ? 'ویرایش کامپوننت' : 'افزودن کامپوننت'}</h4>
            </Dialog.Title>

            <div className="fb-row">
              <label>نوع کامپوننت</label>
              <select value={type} onChange={e => handleTypeChange(e.target.value as BuilderField['type'])}>
                {FB_TYPES.map(([v, t]) => <option key={v} value={v}>{t} — {v}</option>)}
              </select>
            </div>

            <div className="fb-row">
              <label>عنوان (title)</label>
              <input
                type="text" value={label} placeholder="عنوان فیلد"
                autoFocus
                onChange={e => setLabel(e.target.value)}
              />
            </div>

            {FB_HAS_OPTS(type) && (
              <div className="fb-row">
                <label>گزینه‌ها (با «،» جدا کنید)</label>
                <input type="text" value={opts} onChange={e => setOpts(e.target.value)} />
              </div>
            )}

            <div className="fb-row inline">
              <label>اجباری (required)</label>
              <div
                className={`toggle${required ? ' on' : ''}`}
                role="switch"
                tabIndex={0}
                aria-checked={required}
                onClick={() => setRequired(r => !r)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setRequired(r => !r)}
              >
                <span /><span className="switch" />
              </div>
            </div>

            <div className="fb-actions">
              <button className="btn btn-ghost" onClick={onClose}>انصراف</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {isEdit ? 'ذخیره' : 'افزودن'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
