// Layout wrapper used by every form field: renders the label, required/optional badge, child input, hint, and error message.
interface FieldShellProps {
  title: string
  required?: boolean
  hint?: string
  showHint?: boolean
  isError?: boolean
  isDisabled?: boolean
  isHover?: boolean
  isFocus?: boolean
  errorMessage?: string
  stateClass?: string
  children: React.ReactNode
}

export function FieldShell({
  title, required, hint, showHint = true, isError, isDisabled,
  isHover, isFocus, errorMessage, stateClass, children,
}: FieldShellProps) {
  const classes = [
    'field',
    stateClass && `is-${stateClass}`,
    isError && 'is-error',
    isDisabled && 'is-disabled',
    isHover && !stateClass && 'is-hover',
    isFocus && !stateClass && 'is-focus',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className="field__label">
        {title}{' '}
        {required
          ? <span className="req">*</span>
          : <span className="opt">(اختیاری)</span>}
      </div>
      {children}
      {isError
        ? <div className="field__msg err">{errorMessage || 'این فیلد الزامی است.'}</div>
        : showHint && hint
          ? <div className="field__msg">{hint}</div>
          : null}
    </div>
  )
}
