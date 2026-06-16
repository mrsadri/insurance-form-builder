import type { BuilderField } from './builderTypes'

interface FieldRowProps {
  field: BuilderField
  src: string
  loose?: boolean
  onEdit: () => void
  onDelete: () => void
  onDragStart: (e: React.DragEvent) => void
}

export function FieldRow({ field, src, loose, onEdit, onDelete, onDragStart }: FieldRowProps) {
  return (
    <div className={`fb-field${loose ? ' loose' : ''}`}>
      <span
        className="fb-handle"
        draggable
        onDragStart={onDragStart}
      >⠿</span>
      <span className="fb-flabel">
        {field.label}
        {field.required && <span className="fb-req"> *</span>}
      </span>
      <span className="fb-ftype">{field.type}</span>
      <button className="fb-icon-btn" onClick={onEdit} title="ویرایش">✎</button>
      <button className="fb-icon-btn danger" onClick={onDelete} title="حذف">🗑</button>
    </div>
  )
}
