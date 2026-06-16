import { FieldShell } from './FieldShell'

export type InputType = 'text' | 'number' | 'money' | 'national_code' | 'phone_number'

interface TextFieldProps {
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
  inputType?: InputType
  value?: string
  onChange?: (v: string) => void
  interactive?: boolean
}

export function TextField({
  title, placeholder, hint, showHint, required, isError, isDisabled,
  isHover, isFocus, errorMessage, stateClass, inputType = 'text',
  value = '', onChange, interactive = true,
}: TextFieldProps) {
  const inputEl = (
    <input
      className="input"
      placeholder={placeholder}
      value={value}
      disabled={isDisabled}
      tabIndex={interactive ? undefined : -1}
      readOnly={!interactive}
      onChange={e => onChange?.(e.target.value)}
    />
  )

  const control = inputType === 'money'
    ? <div className="input-affix"><span className="affix">تومان</span>{inputEl}</div>
    : inputEl

  return (
    <FieldShell
      title={title} required={required} hint={hint} showHint={showHint}
      isError={isError} isDisabled={isDisabled} isHover={isHover} isFocus={isFocus}
      errorMessage={errorMessage} stateClass={stateClass}
    >
      {control}
    </FieldShell>
  )
}
