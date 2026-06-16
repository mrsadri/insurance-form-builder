import { useReducer, useRef, useState } from 'react'
import { StepBar } from './StepBar'
import { SectionBlock } from './SectionBlock'
import { FieldRow } from './FieldRow'
import { TextModal } from './modals/TextModal'
import { FieldModal } from './modals/FieldModal'
import { SchemaPanel } from '../explorer/SchemaPanel'
import { PRESETS } from '../../presets/insurance'
import {
  builderReducer, INITIAL_STATE, uid, makeField,
  builderStateToSchema, schemaToBuilderState,
} from './builderReducer'
import type { BuilderField } from './builderTypes'
import type { FormSchema } from '../../core/types'

interface DragInfo { kind: 'field' | 'section'; id: string; src: string }

type Modal =
  | { kind: 'text'; title: string; initial: string; onOk: (v: string) => void }
  | { kind: 'field'; mode: 'add' | 'edit'; initial?: BuilderField; onSave: (f: BuilderField) => void }

interface BuilderProps {
  onSendToPreview?: (schema: FormSchema) => void
}

export function Builder({ onSendToPreview }: BuilderProps) {
  const [state, dispatch] = useReducer(builderReducer, INITIAL_STATE)
  const [modal, setModal] = useState<Modal | null>(null)
  const dragRef = useRef<DragInfo | null>(null)

  const step = state.steps[state.current]
  const schema = builderStateToSchema(state)
  const schemaJson = JSON.stringify(schema, null, 2)

  const closeModal = () => setModal(null)

  const openText = (title: string, initial: string, onOk: (v: string) => void) =>
    setModal({ kind: 'text', title, initial, onOk })

  const openField = (mode: 'add' | 'edit', initial: BuilderField | undefined, onSave: (f: BuilderField) => void) =>
    setModal({ kind: 'field', mode, initial, onSave })

  const handleDragStart = (e: React.DragEvent, kind: 'field' | 'section', id: string, src: string) => {
    dragRef.current = { kind, id, src }
    e.dataTransfer.effectAllowed = 'move'
    try { e.dataTransfer.setData('text/plain', id) } catch { /* noop */ }
    const vis = (e.target as HTMLElement).closest<HTMLElement>('.fb-field, .fb-section')
    if (vis) setTimeout(() => vis.classList.add('fb-dragging'), 0)
  }

  const handleDragEnd = () => {
    dragRef.current = null
    document.querySelectorAll('.fb-dragging').forEach(el => el.classList.remove('fb-dragging'))
  }

  const handleDrop = (e: React.DragEvent, dropSec: string | null, before: string | null) => {
    e.preventDefault()
    const drag = dragRef.current
    if (!drag) return
    if (drag.kind === 'section' && !dropSec) {
      dispatch({ type: 'DROP_SECTION', dragId: drag.id, before })
    } else if (drag.kind === 'field' || (drag.kind === 'section' && dropSec)) {
      dispatch({ type: 'DROP_FIELD', dragSrc: drag.src, dragId: drag.id, dropSec, before })
    }
    dragRef.current = null
    document.querySelectorAll('.fb-dragging').forEach(el => el.classList.remove('fb-dragging'))
  }

  const handleStepDropOver = (e: React.DragEvent, before: string | null) => { e.preventDefault() }

  return (
    <>
      <div className="stage">
        <div className="stage-head">
          <div className="eyebrow"><span className="k">steps[]</span> <span>{'{ sections → items }'}</span></div>
          <h2>فرم‌ساز</h2>
          <p className="desc">استپ‌ها، سکشن‌ها و کامپوننت‌ها را بساز و با کشیدن جابه‌جا کن.</p>
        </div>
        <div className="howto">
          با «＋ استپ/سکشن/کامپوننت» اضافه کن. با دستگیره‌ی ⠿ کامپوننت‌ها را داخل و بین سکشن‌ها بکش. خروجی JSON در پنل کناری ساخته می‌شود.
        </div>

        {/* Preset loader */}
        <div className="fb-toolbar">
          <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>بارگذاری نمونه:</span>
          {PRESETS.map(p => (
            <button key={p.key} className="pv-preset"
              onClick={() => dispatch({ type: 'LOAD_STATE', state: schemaToBuilderState(p.fn()) })}>
              <span className="ic">{p.ic}</span>{p.label}
            </button>
          ))}
          <button className="pv-preset" onClick={() => dispatch({ type: 'CLEAR' })}>＋ خالی</button>
        </div>

        <StepBar
          steps={state.steps} current={state.current}
          onSelect={i => dispatch({ type: 'SET_STEP', index: i })}
          onEdit={i => openText('نام استپ', state.steps[i].title, v => dispatch({ type: 'EDIT_STEP', index: i, title: v }))}
          onDelete={i => dispatch({ type: 'DEL_STEP', index: i })}
          onAdd={() => openText('عنوان استپ جدید', 'استپ جدید', v => dispatch({ type: 'ADD_STEP', title: v }))}
        />

        <div className="fb-canvas" onDragEnd={handleDragEnd}>
          {step.blocks.map(b => {
            const dropZone = (before: string | null) => (
              <div
                key={`dz-${before || 'end'}`}
                className="fb-drop"
                onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.add('over') }}
                onDragLeave={e => (e.currentTarget as HTMLElement).classList.remove('over')}
                onDrop={e => { (e.currentTarget as HTMLElement).classList.remove('over'); handleDrop(e, null, before) }}
              />
            )

            if (b.kind === 'section') return (
              <div key={b.id}>
                {dropZone(b.id)}
                <SectionBlock
                  id={b.id} title={b.title} items={b.items}
                  onTitleChange={title => dispatch({ type: 'RENAME_SECTION', id: b.id, title })}
                  onDelete={() => dispatch({ type: 'DEL_SECTION', id: b.id })}
                  onAddField={() => openField('add', undefined, f => dispatch({ type: 'ADD_FIELD_TO_SECTION', sectionId: b.id, field: f }))}
                  onEditField={f => openField('edit', f, nf => dispatch({ type: 'EDIT_FIELD', src: `sec:${b.id}`, id: f.id, field: nf }))}
                  onDeleteField={f => dispatch({ type: 'DEL_FIELD', src: `sec:${b.id}`, id: f.id })}
                  onDragStartField={(e, f, src) => handleDragStart(e, 'field', f.id, src)}
                  onDragStartSection={e => handleDragStart(e, 'section', b.id, `block:${b.id}`)}
                  onDragOver={(e, sid, before) => { e.preventDefault() }}
                  onDragLeave={() => {}}
                  onDrop={(e, sid, before) => handleDrop(e, sid, before)}
                />
              </div>
            )

            return (
              <div key={b.id}>
                {dropZone(b.id)}
                <FieldRow
                  field={b.field} src={`loose:${b.id}`} loose
                  onEdit={() => openField('edit', b.field, nf => dispatch({ type: 'EDIT_FIELD', src: `loose:${b.id}`, id: b.field.id, field: nf }))}
                  onDelete={() => dispatch({ type: 'DEL_FIELD', src: `loose:${b.id}`, id: b.field.id })}
                  onDragStart={e => handleDragStart(e, 'field', b.field.id, `loose:${b.id}`)}
                />
              </div>
            )
          })}
          <div
            className="fb-drop"
            onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).classList.add('over') }}
            onDragLeave={e => (e.currentTarget as HTMLElement).classList.remove('over')}
            onDrop={e => { (e.currentTarget as HTMLElement).classList.remove('over'); handleDrop(e, null, null) }}
          />
        </div>

        <div className="fb-bar">
          <button className="fb-add" onClick={() => openText('عنوان سکشن جدید', 'سکشن جدید', v => dispatch({ type: 'ADD_SECTION', title: v }))}>＋ سکشن</button>
          <button className="fb-add" onClick={() => openField('add', undefined, f => dispatch({ type: 'ADD_LOOSE_FIELD', field: f }))}>＋ کامپوننت خارج از سکشن</button>
          {onSendToPreview && (
            <button className="btn btn-primary" style={{ marginInlineStart: 'auto' }} onClick={() => onSendToPreview(schema)}>
              نمایش در پیش‌نمایش ▶
            </button>
          )}
        </div>
      </div>

      <SchemaPanel
        title="form · export (API schema)"
        jsonText={schemaJson}
        note='این دقیقاً همان <b>steps[] → sections[] → items[]</b> است که فرم‌ساز می‌سازد.'
      />

      {modal?.kind === 'text' && (
        <TextModal open title={modal.title} initial={modal.initial} onOk={modal.onOk} onClose={closeModal} />
      )}
      {modal?.kind === 'field' && (
        <FieldModal open mode={modal.mode} initial={modal.initial} onSave={modal.onSave} onClose={closeModal} />
      )}
    </>
  )
}
