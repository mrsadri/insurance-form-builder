import { useEffect, useRef, useState } from 'react'
import { FieldShell } from './FieldShell'
import type { OptionItem } from '../types'

interface SelectFieldProps {
  title: string
  placeholder?: string
  hint?: string
  showHint?: boolean
  required?: boolean
  isError?: boolean
  isDisabled?: boolean
  isHover?: boolean
  isFocus?: boolean
  errorMessage?: string
  stateClass?: string
  items?: OptionItem[]
  value?: string | number | null
  onSelect?: (v: string | number) => void
  // for gallery static display
  forceOpen?: boolean
  popupStatic?: boolean
  interactive?: boolean
}

export function SelectField({
  title, placeholder, hint, showHint, required, isError, isDisabled,
  isHover, isFocus, errorMessage, stateClass, items = [],
  value, onSelect, forceOpen, popupStatic, interactive = true,
}: SelectFieldProps) {
  const [open, setOpen] = useState(forceOpen ?? false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !interactive) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, interactive])

  const cur = items.find(o => String(o.value) === String(value))
  const isOpen = forceOpen ?? open

  return (
    <FieldShell
      title={title} required={required} hint={hint} showHint={showHint}
      isError={isError} isDisabled={isDisabled} isHover={isHover} isFocus={isFocus}
      errorMessage={errorMessage} stateClass={stateClass}
    >
      <div className="pop" ref={ref}>
        <button
          className={`trigger${isOpen ? ' open' : ''}`}
          disabled={isDisabled}
          tabIndex={interactive ? undefined : -1}
          onClick={() => interactive && setOpen(o => !o)}
        >
          {cur ? cur.label : <span className="ph">{placeholder || 'یک گزینه را انتخاب کنید'}</span>}
          <span className="chev">▾</span>
        </button>
        {isOpen && (
          <div className={`menu${popupStatic ? ' static' : ''}`}>
            {items.map((o, i) => (
              <div
                key={o.value}
                className={`menu-item${String(o.value) === String(value) ? ' sel' : ''}${!value && i === 0 ? ' hl' : ''}`}
                onClick={() => { if (interactive) { onSelect?.(o.value); setOpen(false) } }}
              >
                {o.label}<span className="ck">✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </FieldShell>
  )
}
