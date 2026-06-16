import { fa } from '../../i18n/fa'
import type { BuilderStep } from './builderTypes'

interface StepBarProps {
  steps: BuilderStep[]
  current: number
  onSelect: (i: number) => void
  onEdit: (i: number) => void
  onDelete: (i: number) => void
  onAdd: () => void
}

export function StepBar({ steps, current, onSelect, onEdit, onDelete, onAdd }: StepBarProps) {
  return (
    <div className="fb-steps">
      {steps.map((st, i) => (
        <span
          key={st.id}
          className={`fb-step${i === current ? ' on' : ''}`}
          onClick={() => onSelect(i)}
        >
          <span className="num">{fa(i + 1)}</span>
          {st.title}
          <button className="del" onClick={e => { e.stopPropagation(); onEdit(i) }} title="نام">✎</button>
          <button className="del" onClick={e => { e.stopPropagation(); onDelete(i) }} title="حذف">×</button>
        </span>
      ))}
      <button className="fb-add" onClick={onAdd}>＋ استپ</button>
    </div>
  )
}
