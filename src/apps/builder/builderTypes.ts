// Internal types and constants for the form builder: BuilderField, BuilderBlock, BuilderState, action union, and label/option maps.
import type { ItemType } from '../../core/types'

export interface BuilderField {
  id: string
  type: ItemType
  label: string
  required: boolean
  options?: string[]
  rangeMin?: number
  rangeMax?: number
  rangeUnit?: string
  placeholder?: string
  hint?: string
}

export type BuilderBlock =
  | { kind: 'section'; id: string; title: string; items: BuilderField[] }
  | { kind: 'field'; id: string; field: BuilderField }

export interface BuilderStep {
  id: string
  title: string
  blocks: BuilderBlock[]
}

export interface BuilderState {
  current: number
  steps: BuilderStep[]
}

export type BuilderAction =
  | { type: 'SET_STEP'; index: number }
  | { type: 'ADD_STEP'; title: string }
  | { type: 'EDIT_STEP'; index: number; title: string }
  | { type: 'DEL_STEP'; index: number }
  | { type: 'ADD_SECTION'; title: string }
  | { type: 'RENAME_SECTION'; id: string; title: string }
  | { type: 'DEL_SECTION'; id: string }
  | { type: 'ADD_FIELD_TO_SECTION'; sectionId: string; field: BuilderField }
  | { type: 'ADD_LOOSE_FIELD'; field: BuilderField }
  | { type: 'EDIT_FIELD'; src: string; id: string; field: BuilderField }
  | { type: 'DEL_FIELD'; src: string; id: string }
  | { type: 'DROP_FIELD'; dragSrc: string; dragId: string; dropSec: string | null; before: string | null }
  | { type: 'DROP_SECTION'; dragId: string; before: string | null }
  | { type: 'LOAD_STATE'; state: BuilderState }
  | { type: 'CLEAR' }

export const FB_TYPES: [ItemType, string][] = [
  ['text','متن'],['number','عدد'],['money','مبلغ'],['national_code','کد ملی'],
  ['phone_number','موبایل'],['license_plate','پلاک'],['select','انتخابی'],
  ['chips_select','چیپ'],['radio','رادیویی'],['datepicker','تاریخ'],['range','بازه'],
]
export const FB_HAS_OPTS = (t: string) => ['select','chips_select','radio'].includes(t)
export const FB_LBL: Record<string, string> = {
  text:'نام',number:'سن',money:'مبلغ سرمایه',national_code:'کد ملی',phone_number:'شماره موبایل',
  license_plate:'پلاک خودرو',select:'نسبت بیمه‌شده',chips_select:'پوشش‌های اضافه',
  radio:'سؤال بله/خیر',datepicker:'تاریخ شروع',range:'مدت بیمه‌نامه',
}
export const FB_OPTS: Record<string, string[]> = {
  select:['خودم','همسر','فرزند'],
  chips_select:['بدنه','شخص ثالث','حوادث راننده'],
  radio:['بله','خیر'],
}
