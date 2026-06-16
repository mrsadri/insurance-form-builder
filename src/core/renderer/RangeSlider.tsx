import { useRef } from 'react'
import { FieldShell } from './FieldShell'
import { fa } from '../../i18n/fa'

interface RangeSliderProps {
  title: string
  hint?: string
  showHint?: boolean
  required?: boolean
  isError?: boolean
  isDisabled?: boolean
  errorMessage?: string
  stateClass?: string
  min?: number
  max?: number
  unit?: string
  value?: number
  onChange?: (v: number) => void
  isDragging?: boolean
  interactive?: boolean
}

export function RangeSlider({
  title, hint, showHint, required, isError, isDisabled, errorMessage, stateClass,
  min = 1, max = 10, unit = '', value, onChange, isDragging, interactive = true,
}: RangeSliderProps) {
  const fillRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  const v = value ?? min
  const pct = ((v - min) / ((max - min) || 1)) * 100

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nv = +e.target.value
    if (fillRef.current) fillRef.current.style.width = ((nv - min) / ((max - min) || 1) * 100) + '%'
    if (thumbRef.current) thumbRef.current.style.insetInlineStart = ((nv - min) / ((max - min) || 1) * 100) + '%'
    if (numRef.current) numRef.current.textContent = fa(nv)
    onChange?.(nv)
  }

  const cls = ['field', stateClass && `is-${stateClass}`, isError && 'is-error', isDisabled && 'is-disabled', isDragging && 'is-dragging'].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      <div className="field__label">
        {title} {required ? <span className="req">*</span> : <span className="opt">(اختیاری)</span>}
      </div>
      <div className="range">
        <div className="range-top">
          <span className="range-val">
            <span ref={numRef}>{fa(v)}</span>
            <span className="unit">{unit}</span>
          </span>
        </div>
        <div className="track-wrap">
          <div className="track">
            <div ref={fillRef} className="fill" style={{ width: pct + '%' }} />
            <div ref={thumbRef} className="thumb" style={{ insetInlineStart: pct + '%' }} />
          </div>
          {interactive && (
            <input
              type="range"
              className="range-native"
              min={min} max={max} value={v}
              disabled={isDisabled}
              onChange={handleInput}
            />
          )}
        </div>
        <div className="range-bounds"><span>{fa(min)}</span><span>{fa(max)}</span></div>
      </div>
      {isError
        ? <div className="field__msg err">{errorMessage}</div>
        : showHint && hint ? <div className="field__msg">{hint}</div> : null}
    </div>
  )
}
