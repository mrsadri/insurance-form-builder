// Single-select rendered as a vertical or horizontal list of radio items; supports focus-highlight for gallery states.
import { FieldShell } from './FieldShell'
import type { OptionItem } from '../types'

interface RadioGroupProps {
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
  value?: string | number | null
  onChange?: (v: string | number) => void
  layout?: 'col' | 'row'
  focusIndex?: number
  interactive?: boolean
}

export function RadioGroup({
  title, hint, showHint, required, isError, isDisabled, isHover,
  errorMessage, stateClass, items = [], value, onChange, layout = 'col',
  focusIndex, interactive = true,
}: RadioGroupProps) {
  return (
    <FieldShell
      title={title} required={required} hint={hint} showHint={showHint}
      isError={isError} isDisabled={isDisabled} isHover={isHover}
      errorMessage={errorMessage} stateClass={stateClass}
    >
      <div className={`radio-group${layout === 'row' ? ' row' : ''}`}>
        {items.map((o, i) => (
          <div
            key={o.value}
            className={`radio${String(o.value) === String(value) ? ' sel' : ''}${focusIndex === i ? ' foc' : ''}`}
            onClick={() => interactive && onChange?.(o.value)}
            tabIndex={interactive ? 0 : -1}
          >
            <span className="dot" />
            <span>{o.label}</span>
          </div>
        ))}
      </div>
    </FieldShell>
  )
}
