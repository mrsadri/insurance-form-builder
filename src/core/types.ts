// Shared TypeScript types for the form schema: FormSchema, Step, Section, FormItem, and value shapes.
export type ItemType =
  | 'text' | 'number' | 'money' | 'national_code' | 'phone_number'
  | 'license_plate' | 'select' | 'chips_select' | 'radio'
  | 'datepicker' | 'range'

export interface Conditions {
  show_if?: string | null
  disabled_if?: string | null
  required_if?: string | null
}

export interface Validation {
  min?: number
  max?: number
  regex?: string
  regex_hint?: string
}

export interface OptionItem {
  label: string
  value: string | number
  conditions?: { show_if?: string | null }
}

export interface ItemOptions {
  min?: number
  max?: number
  unit?: string
}

export interface FormItem {
  type: ItemType
  id: string
  title: string
  placeholder?: string
  hint?: string
  required?: boolean
  value?: unknown
  items?: OptionItem[]
  options?: ItemOptions
  conditions?: Conditions
  validations?: Validation
}

export interface Section {
  title: string | null
  conditions?: Pick<Conditions, 'show_if'>
  items: FormItem[]
}

export interface Step {
  step_id: string
  title: string
  sections: Section[]
}

export interface FormSchema {
  product_id: string
  steps: Step[]
}

export interface PlateValue {
  p2?: string
  letter?: string
  p3?: string
  prov?: string
}

export interface JalaliDate {
  jy: number
  jm: number
  jd: number
}
