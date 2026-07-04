// Multi-select input rendered as toggleable chip tags; each chip shows a dismiss × when selected.
import { FieldShell } from './FieldShell'
import type { OptionItem } from '../types'
import { fa } from '../../i18n/fa'

interface ChipsSelectProps {
  title: string
  hint?: string
  showHint?: boolean
  required?: boolean
  isError?: boolean
  isDisabled?: boolean
  isHover?: boolean
  errorMessage?: string
  stateClass?: string
  items?: OptionItem[]
  value?: (string | number)[]
  onChange?: (v: (string | number)[]) => void
  focusIndex?: number
  interactive?: boolean
}

export function ChipsSelect({
  title, hint, showHint, required, isError, isDisabled, isHover,
  errorMessage, stateClass, items = [], value = [], onChange,
  focusIndex, interactive = true,
}: ChipsSelectProps) {
  const toggle = (v: string | number) => {
    if (!interactive) return
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v]
    onChange?.(next)
  }

  return (
    <FieldShell
      title={title} required={required} hint={hint} showHint={showHint}
      isError={isError} isDisabled={isDisabled} isHover={isHover}
      errorMessage={errorMessage} stateClass={stateClass}
    >
      <div className="chips">
        {items.map((o, i) => {
          const sel = value.includes(o.value)
          return (
            <span
              key={o.value}
              className={`chip${sel ? ' sel' : ''}${focusIndex === i ? ' foc' : ''}`}
              onClick={() => toggle(o.value)}
              tabIndex={interactive ? 0 : -1}
            >
              {o.label}
              {sel && <span className="x">×</span>}
            </span>
          )
        })}
      </div>
      <div className="chips-meta">min: {fa(1)} · max: {fa(3)} · selected: {fa(value.length)}</div>
    </FieldShell>
  )
}
