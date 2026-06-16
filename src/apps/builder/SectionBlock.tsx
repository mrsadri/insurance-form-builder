import { useRef } from 'react'
import { FieldRow } from './FieldRow'
import type { BuilderField } from './builderTypes'

interface SectionBlockProps {
  id: string
  title: string
  items: BuilderField[]
  onTitleChange: (title: string) => void
  onDelete: () => void
  onAddField: () => void
  onEditField: (f: BuilderField) => void
  onDeleteField: (f: BuilderField) => void
  onDragStartField: (e: React.DragEvent, field: BuilderField, src: string) => void
  onDragStartSection: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent, secId: string, beforeId: string | null) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, secId: string, beforeId: string | null) => void
}

function DropZone({ secId, before, onDragOver, onDragLeave, onDrop }: {
  secId: string; before: string | null
  onDragOver: (e: React.DragEvent, secId: string, before: string | null) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, secId: string, before: string | null) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className="fb-drop"
      onDragOver={e => { e.preventDefault(); ref.current?.classList.add('over'); onDragOver(e, secId, before) }}
      onDragLeave={e => { ref.current?.classList.remove('over'); onDragLeave(e) }}
      onDrop={e => { ref.current?.classList.remove('over'); onDrop(e, secId, before) }}
    />
  )
}

export function SectionBlock({
  id, title, items, onTitleChange, onDelete, onAddField,
  onEditField, onDeleteField, onDragStartField, onDragStartSection,
  onDragOver, onDragLeave, onDrop,
}: SectionBlockProps) {
  return (
    <div className="fb-block fb-section">
      <div className="fb-section-head">
        <span className="fb-handle" draggable onDragStart={onDragStartSection}>⠿</span>
        <input
          className="fb-sec-title"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
        />
        <span className="fb-sec-cond">show_if</span>
        <button className="fb-icon-btn" onClick={onAddField}>＋ کامپوننت</button>
        <button className="fb-icon-btn danger" onClick={onDelete}>🗑</button>
      </div>
      <div className="fb-section-body">
        {items.length === 0 && <div className="fb-empty">کامپوننتی نیست — این‌جا بکش یا «＋ کامپوننت»</div>}
        {items.map(f => (
          <div key={f.id}>
            <DropZone secId={id} before={f.id} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} />
            <FieldRow
              field={f} src={`sec:${id}`}
              onEdit={() => onEditField(f)}
              onDelete={() => onDeleteField(f)}
              onDragStart={e => onDragStartField(e, f, `sec:${id}`)}
            />
          </div>
        ))}
        <DropZone secId={id} before={null} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} />
      </div>
    </div>
  )
}
