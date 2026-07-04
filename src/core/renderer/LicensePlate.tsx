// Iranian vehicle license plate input: two digits + letter (select) + three digits + province code, with letter-based color variants.
import { useState } from 'react'
import { FieldShell } from './FieldShell'
import type { PlateValue } from '../types'

const PLATE_LETTERS = ['ب','ج','د','س','ص','ط','ق','ل','م','ن','و','ه','ی','الف','ع','ژ']

// رنگ پلاک بر اساس حرف وسط (دسته‌بندی رسمی پلاک‌های ایران)
const PLATE_VARIANTS: Record<string, string> = {
  'الف': 'plate--red',    // دولتی
  'ع': 'plate--yellow',   // عمومی
  'ژ': 'plate--blue',     // معلولین و جانبازان
}

interface LicensePlateProps {
  title: string
  hint?: string
  showHint?: boolean
  required?: boolean
  isError?: boolean
  isDisabled?: boolean
  errorMessage?: string
  stateClass?: string
  isFocus?: boolean
  value?: PlateValue
  onChange?: (v: PlateValue) => void
  interactive?: boolean
}

function PlateInput({
  cls, val, ph, maxLen, onCh, isDisabled, interactive,
}: { cls: string; val?: string; ph: string; maxLen: number; onCh?: (v: string) => void; isDisabled?: boolean; interactive?: boolean }) {
  return (
    <input
      className={`plate-in ${cls}`}
      maxLength={maxLen}
      inputMode="numeric"
      placeholder={ph}
      value={val || ''}
      disabled={isDisabled}
      readOnly={!interactive}
      tabIndex={interactive ? undefined : -1}
      onChange={e => onCh?.(e.target.value)}
    />
  )
}

export function LicensePlate({
  title, hint, showHint, required, isError, isDisabled, errorMessage, stateClass,
  isFocus, value = {}, onChange, interactive = true,
}: LicensePlateProps) {
  const [focused, setFocused] = useState(false)
  const update = (k: keyof PlateValue, v: string) => onChange?.({ ...value, [k]: v })
  const variant = (value.letter && PLATE_VARIANTS[value.letter]) || ''

  return (
    <FieldShell
      title={title} required={required} hint={hint} showHint={showHint}
      isError={isError} isDisabled={isDisabled} isFocus={isFocus}
      errorMessage={errorMessage} stateClass={stateClass}
    >
      <div
        className={`plate${variant ? ' ' + variant : ''}${(focused && interactive) || isFocus ? ' is-focus-plate' : ''}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span className="plate-strip">
          <span className="plate-flag">🇮🇷</span>
          <span>I.R.<br />IRAN</span>
        </span>
        <PlateInput cls="p2" val={value.p2} ph="۱۲" maxLen={2} onCh={v => update('p2', v)} isDisabled={isDisabled} interactive={interactive} />
        {interactive
          ? (
            <select
              className="plate-letter"
              value={value.letter || ''}
              disabled={isDisabled}
              onChange={e => update('letter', e.target.value)}
            >
              <option value="">—</option>
              {PLATE_LETTERS.map(l => <option key={l}>{l}</option>)}
            </select>
          )
          : <span className="plate-letter-s">{value.letter || 'ل'}</span>}
        <PlateInput cls="p3" val={value.p3} ph="۳۴۵" maxLen={3} onCh={v => update('p3', v)} isDisabled={isDisabled} interactive={interactive} />
        <span className="plate-prov">
          <span className="plate-prov-label">ایران</span>
          <PlateInput cls="plate-prov-in" val={value.prov} ph="۲۰" maxLen={2} onCh={v => update('prov', v)} isDisabled={isDisabled} interactive={interactive} />
        </span>
      </div>
    </FieldShell>
  )
}
