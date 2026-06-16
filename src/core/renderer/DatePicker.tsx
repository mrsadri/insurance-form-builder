import { useEffect, useRef, useState } from 'react'
import { FieldShell } from './FieldShell'
import { toGregorian, jalaliMonthLen, J_MONTHS, todayJalali } from '../jalali'
import { fa, formatJalaliDate } from '../../i18n/fa'
import type { JalaliDate } from '../types'

interface DatePickerProps {
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
  value?: JalaliDate | null
  onChange?: (v: JalaliDate) => void
  forceOpen?: boolean
  popupStatic?: boolean
  interactive?: boolean
}

function Calendar({
  viewY, viewM, selected, onDay, onNav, isStatic, interactive,
}: {
  viewY: number; viewM: number; selected?: JalaliDate | null
  onDay?: (d: number) => void; onNav?: (dir: 'prev' | 'next') => void
  isStatic?: boolean; interactive?: boolean
}) {
  const today = todayJalali()
  const len = jalaliMonthLen(viewY, viewM)
  const g = toGregorian(viewY, viewM, 1)
  const offset = (new Date(g.gy, g.gm - 1, g.gd).getDay() + 1) % 7
  const WD = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

  return (
    <div className={`cal${isStatic ? ' static' : ''}`}>
      <div className="cal-head">
        <button onClick={() => interactive && onNav?.('next')}>›</button>
        <span className="m">{J_MONTHS[viewM - 1]} {fa(viewY)}</span>
        <button onClick={() => interactive && onNav?.('prev')}>‹</button>
      </div>
      <div className="cal-grid">
        {WD.map(w => <div key={w} className="wd">{w}</div>)}
        {Array.from({ length: offset }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: len }, (_, i) => {
          const d = i + 1
          const isToday = viewY === today.jy && viewM === today.jm && d === today.jd
          const isSel = selected && selected.jy === viewY && selected.jm === viewM && selected.jd === d
          return (
            <div
              key={d}
              className={`d${isToday ? ' today' : ''}${isSel ? ' sel' : ''}`}
              onClick={() => interactive && onDay?.(d)}
            >
              {fa(d)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DatePicker({
  title, placeholder, hint, showHint, required, isError, isDisabled,
  isHover, isFocus, errorMessage, stateClass, value, onChange,
  forceOpen, popupStatic, interactive = true,
}: DatePickerProps) {
  const today = todayJalali()
  const [open, setOpen] = useState(forceOpen ?? false)
  const [viewY, setViewY] = useState(value?.jy ?? today.jy)
  const [viewM, setViewM] = useState(value?.jm ?? today.jm)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !interactive) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, interactive])

  const isOpen = forceOpen ?? open

  const handleNav = (dir: 'prev' | 'next') => {
    let m = viewM, y = viewY
    if (dir === 'next') { m++; if (m > 12) { m = 1; y++ } }
    else { m--; if (m < 1) { m = 12; y-- } }
    setViewY(y); setViewM(m)
  }

  const handleDay = (d: number) => {
    onChange?.({ jy: viewY, jm: viewM, jd: d })
    setOpen(false)
  }

  const displayValue = value ?? (forceOpen ? today : null)

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
          {displayValue
            ? formatJalaliDate(displayValue.jy, displayValue.jm, displayValue.jd)
            : <span className="ph">{placeholder || 'تاریخ را انتخاب کنید'}</span>}
          <span className="chev">▾</span>
        </button>
        {isOpen && (
          <Calendar
            viewY={viewY} viewM={viewM} selected={value ?? (forceOpen ? today : null)}
            onDay={handleDay} onNav={handleNav}
            isStatic={popupStatic} interactive={interactive}
          />
        )}
      </div>
    </FieldShell>
  )
}
