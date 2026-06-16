import { TextField } from './TextField'
import { SelectField } from './SelectField'
import { ChipsSelect } from './ChipsSelect'
import { RadioGroup } from './RadioGroup'
import { RangeSlider } from './RangeSlider'
import { DatePicker } from './DatePicker'
import { LicensePlate } from './LicensePlate'
import type { FormItem, PlateValue, JalaliDate } from '../types'

interface UiState {
  open?: boolean
  viewY?: number
  viewM?: number
}

interface FormFieldProps {
  item: FormItem
  value?: unknown
  uiState?: UiState
  isError?: boolean
  onChange?: (v: unknown) => void
  onToggleOpen?: () => void
  onCloseOpen?: () => void
}

export function FormField({ item, value, isError, onChange, onToggleOpen, uiState }: FormFieldProps) {
  const common = {
    title: item.title,
    hint: item.hint,
    showHint: true,
    required: item.required,
    placeholder: item.placeholder,
    isError,
    errorMessage: item.validations?.regex_hint || (isError ? 'این فیلد الزامی است.' : undefined),
  }

  switch (item.type) {
    case 'text':
    case 'number':
    case 'money':
    case 'national_code':
    case 'phone_number':
      return (
        <TextField
          {...common}
          inputType={item.type as 'text' | 'money'}
          value={(value as string) || ''}
          onChange={v => onChange?.(v)}
        />
      )
    case 'select':
      return (
        <SelectField
          {...common}
          items={item.items}
          value={(value as string | number) ?? null}
          onSelect={v => onChange?.(v)}
        />
      )
    case 'chips_select':
      return (
        <ChipsSelect
          {...common}
          items={item.items}
          value={(value as (string | number)[]) || []}
          onChange={v => onChange?.(v)}
        />
      )
    case 'radio':
      return (
        <RadioGroup
          {...common}
          items={item.items}
          value={(value as string | number) ?? null}
          onChange={v => onChange?.(v)}
        />
      )
    case 'range': {
      const opts = item.options || {}
      return (
        <RangeSlider
          {...common}
          min={opts.min ?? 1} max={opts.max ?? 10} unit={opts.unit || ''}
          value={(value as number) ?? (opts.min ?? 1)}
          onChange={v => onChange?.(v)}
        />
      )
    }
    case 'datepicker':
      return (
        <DatePicker
          {...common}
          value={(value as JalaliDate) ?? null}
          onChange={v => onChange?.(v)}
        />
      )
    case 'license_plate':
      return (
        <LicensePlate
          {...common}
          value={(value as PlateValue) || {}}
          onChange={v => onChange?.(v)}
        />
      )
    default:
      return <div className="field__msg">نوع پشتیبانی‌نشده: {item.type}</div>
  }
}
