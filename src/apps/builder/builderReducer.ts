import type { BuilderState, BuilderAction, BuilderBlock } from './builderTypes'
import { FB_LBL, FB_OPTS, FB_HAS_OPTS } from './builderTypes'
import type { ItemType } from '../../core/types'
import type { FormSchema } from '../../core/types'

let _uid = 0
export const uid = (p = 'id') => p + (++_uid)

export function makeField(type: ItemType, cfg: Partial<{ label: string; required: boolean; options: string[] }> = {}) {
  const f: import('./builderTypes').BuilderField = {
    id: uid('f'), type, label: cfg.label || FB_LBL[type] || 'فیلد', required: !!cfg.required,
  }
  if (FB_HAS_OPTS(type)) f.options = cfg.options?.length ? cfg.options : (FB_OPTS[type] || [])
  return f
}

export function makeSection(title: string, items: import('./builderTypes').BuilderField[] = []) {
  return { kind: 'section' as const, id: uid('s'), title: title || 'سکشن جدید', items }
}

export function makeStep(title: string) {
  return { id: uid('st'), title: title || 'استپ جدید', blocks: [makeSection('مشخصات', [makeField('text')])] }
}

export const INITIAL_STATE: BuilderState = {
  current: 0,
  steps: [
    { id: uid('st'), title: 'مشخصات', blocks: [makeSection('مشخصات بیمه‌شده', [makeField('text'), makeField('national_code'), makeField('datepicker')])] },
    { id: uid('st'), title: 'پوشش‌ها', blocks: [makeSection('پوشش‌های اصلی', [makeField('chips_select'), makeField('range')])] },
  ],
}

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  const step = state.steps[state.current]

  switch (action.type) {
    case 'SET_STEP': return { ...state, current: Math.min(action.index, state.steps.length - 1) }
    case 'ADD_STEP': {
      const steps = [...state.steps, makeStep(action.title)]
      return { ...state, steps, current: steps.length - 1 }
    }
    case 'EDIT_STEP': {
      const steps = state.steps.map((s, i) => i === action.index ? { ...s, title: action.title } : s)
      return { ...state, steps }
    }
    case 'DEL_STEP': {
      if (state.steps.length <= 1) return state
      const steps = state.steps.filter((_, i) => i !== action.index)
      return { ...state, steps, current: Math.min(state.current, steps.length - 1) }
    }
    case 'ADD_SECTION': {
      const blocks = [...step.blocks, makeSection(action.title)]
      return replaceStep(state, { ...step, blocks })
    }
    case 'RENAME_SECTION': {
      const blocks = step.blocks.map(b => b.kind === 'section' && b.id === action.id ? { ...b, title: action.title } : b)
      return replaceStep(state, { ...step, blocks })
    }
    case 'DEL_SECTION': {
      const blocks = step.blocks.filter(b => b.id !== action.id)
      return replaceStep(state, { ...step, blocks })
    }
    case 'ADD_FIELD_TO_SECTION': {
      const blocks = step.blocks.map(b =>
        b.kind === 'section' && b.id === action.sectionId ? { ...b, items: [...b.items, action.field] } : b
      )
      return replaceStep(state, { ...step, blocks })
    }
    case 'ADD_LOOSE_FIELD': {
      const blocks = [...step.blocks, { kind: 'field' as const, id: uid('lb'), field: action.field }]
      return replaceStep(state, { ...step, blocks })
    }
    case 'EDIT_FIELD': {
      const blocks = step.blocks.map(b => {
        if (b.kind === 'section' && action.src.startsWith('sec:' + b.id)) {
          return { ...b, items: b.items.map(f => f.id === action.id ? { ...action.field, id: f.id } : f) }
        }
        if (b.kind === 'field' && b.id === action.src.slice('loose:'.length)) {
          return { ...b, field: { ...action.field, id: b.field.id } }
        }
        return b
      })
      return replaceStep(state, { ...step, blocks })
    }
    case 'DEL_FIELD': {
      const blocks = step.blocks.flatMap(b => {
        if (b.kind === 'section' && action.src.startsWith('sec:' + b.id)) {
          return [{ ...b, items: b.items.filter(f => f.id !== action.id) }]
        }
        if (b.kind === 'field' && b.id === action.src.slice('loose:'.length)) return []
        return [b]
      })
      return replaceStep(state, { ...step, blocks })
    }
    case 'DROP_FIELD': {
      const { dragSrc, dragId, dropSec, before } = action
      let draggedField: import('./builderTypes').BuilderField | null = null
      let blocks = step.blocks.flatMap<BuilderBlock>(b => {
        if (b.kind === 'section' && dragSrc.startsWith('sec:' + b.id)) {
          const f = b.items.find(f => f.id === dragId)
          if (f) { draggedField = f; return [{ ...b, items: b.items.filter(i => i.id !== dragId) }] }
        }
        if (b.kind === 'field' && b.id === dragSrc.slice('loose:'.length)) {
          draggedField = b.field; return []
        }
        return [b]
      })
      if (!draggedField) return state
      if (dropSec) {
        blocks = blocks.map(b => {
          if (b.kind !== 'section' || b.id !== dropSec) return b
          const items = [...b.items]
          const idx = before ? items.findIndex(f => f.id === before) : items.length
          items.splice(idx < 0 ? items.length : idx, 0, draggedField!)
          return { ...b, items }
        })
      } else {
        const newBlock: BuilderBlock = { kind: 'field', id: uid('lb'), field: draggedField }
        const idx = before ? blocks.findIndex(b => b.id === before) : blocks.length
        blocks.splice(idx < 0 ? blocks.length : idx, 0, newBlock)
      }
      return replaceStep(state, { ...step, blocks })
    }
    case 'DROP_SECTION': {
      const { dragId, before } = action
      const idx = step.blocks.findIndex(b => b.id === dragId)
      if (idx < 0) return state
      const sec = step.blocks[idx]
      const blocks = step.blocks.filter(b => b.id !== dragId)
      const target = before ? blocks.findIndex(b => b.id === before) : blocks.length
      blocks.splice(target < 0 ? blocks.length : target, 0, sec)
      return replaceStep(state, { ...step, blocks })
    }
    case 'LOAD_STATE': return { ...action.state, current: 0 }
    case 'CLEAR': return {
      current: 0,
      steps: [{ id: uid('st'), title: 'استپ ۱', blocks: [makeSection('سکشن جدید', [])] }],
    }
    default: return state
  }
}

function replaceStep(state: BuilderState, step: BuilderState['steps'][0]): BuilderState {
  return { ...state, steps: state.steps.map((s, i) => i === state.current ? step : s) }
}

// --- Schema conversion (bidirectional round-trip) ---

export function fieldToItem(f: import('./builderTypes').BuilderField) {
  const it: Record<string, unknown> = { type: f.type, title: f.label, id: f.id, required: f.required }
  if (f.options) it.items = f.options.map(o => ({ label: o, value: o }))
  if (f.rangeMin != null || f.rangeMax != null || f.rangeUnit != null) {
    it.options = {} as Record<string, unknown>
    if (f.rangeMin != null) (it.options as Record<string, unknown>).min = f.rangeMin
    if (f.rangeMax != null) (it.options as Record<string, unknown>).max = f.rangeMax
    if (f.rangeUnit != null) (it.options as Record<string, unknown>).unit = f.rangeUnit
  }
  if (f.placeholder) it.placeholder = f.placeholder
  if (f.hint) it.hint = f.hint
  return it
}

export function itemToField(item: Record<string, unknown>): import('./builderTypes').BuilderField {
  const type = item.type as ItemType
  const f: import('./builderTypes').BuilderField = {
    id: (item.id as string) || uid('f'),
    type, label: (item.title as string) || FB_LBL[type] || 'فیلد', required: !!(item.required),
  }
  if (item.items) f.options = (item.items as {label:string}[]).map(o => o.label)
  else if (FB_HAS_OPTS(type)) f.options = FB_OPTS[type] || []
  const opts = item.options as Record<string, unknown> | undefined
  if (opts) { if (opts.min != null) f.rangeMin = opts.min as number; if (opts.max != null) f.rangeMax = opts.max as number; if (opts.unit != null) f.rangeUnit = opts.unit as string }
  if (item.placeholder) f.placeholder = item.placeholder as string
  if (item.hint) f.hint = item.hint as string
  return f
}

export function schemaToBuilderState(sc: FormSchema): BuilderState {
  const steps = (sc.steps || []).map(st => {
    const blocks: BuilderBlock[] = [];
    (st.sections || []).forEach(sec => {
      if (sec.title) {
        blocks.push({ kind: 'section', id: uid('s'), title: sec.title, items: (sec.items || []).map(it => itemToField(it as unknown as Record<string, unknown>)) })
      } else {
        (sec.items || []).forEach(it => blocks.push({ kind: 'field', id: uid('lb'), field: itemToField(it as unknown as Record<string, unknown>) }))
      }
    })
    if (!blocks.length) blocks.push(makeSection('سکشن جدید', []))
    return { id: (st.step_id || uid('st')), title: st.title || 'استپ', blocks }
  })
  return { current: 0, steps: steps.length ? steps : [{ id: uid('st'), title: 'استپ ۱', blocks: [makeSection('سکشن جدید', [])] }] }
}

export function builderStateToSchema(state: BuilderState): FormSchema {
  return {
    product_id: 'individual-event',
    steps: state.steps.map(st => ({
      step_id: st.id,
      title: st.title,
      sections: (() => {
        const out: FormSchema['steps'][0]['sections'] = []
        let loose: FormSchema['steps'][0]['sections'][0] | null = null
        st.blocks.forEach(b => {
          if (b.kind === 'section') {
            if (loose) { out.push(loose); loose = null }
            out.push({ title: b.title, conditions: { show_if: null }, items: b.items.map(f => fieldToItem(f) as unknown as FormSchema['steps'][0]['sections'][0]['items'][0]) })
          } else {
            if (!loose) loose = { title: null, conditions: { show_if: null }, items: [] }
            loose.items.push(fieldToItem(b.field) as unknown as FormSchema['steps'][0]['sections'][0]['items'][0])
          }
        })
        if (loose) out.push(loose)
        return out
      })(),
    })),
  }
}
