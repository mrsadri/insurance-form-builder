// Integration tests: verifies that converting a FormSchema to BuilderState and back is lossless.
import { describe, it, expect } from 'vitest'
import { builderStateToSchema, schemaToBuilderState } from '../apps/builder/builderReducer'
import { PRESETS } from '../presets/insurance'

describe('schema round-trip', () => {
  for (const preset of PRESETS) {
    it(`round-trips ${preset.key}`, () => {
      const original = preset.fn()
      const builderState = schemaToBuilderState(original)
      const rebuilt = builderStateToSchema(builderState)

      // step count preserved
      expect(rebuilt.steps.length).toBe(original.steps.length)

      for (let s = 0; s < original.steps.length; s++) {
        const origStep = original.steps[s]
        const builtStep = rebuilt.steps[s]

        // Count total items per step
        const origItems = origStep.sections.flatMap(sec => sec.items)
        const builtItems = builtStep.sections.flatMap(sec => sec.items)

        expect(builtItems.length).toBe(origItems.length)

        for (let i = 0; i < origItems.length; i++) {
          const o = origItems[i]
          const b = builtItems[i]
          expect(b.type).toBe(o.type)
          expect(b.id).toBe(o.id)
          expect(b.title).toBe(o.title)
          expect(b.required ?? false).toBe(o.required ?? false)
          if (o.items) {
            expect(b.items?.length).toBe(o.items.length)
          }
        }
      }
    })
  }
})

describe('schemaToBuilderState', () => {
  it('handles null-title sections (loose fields)', () => {
    const schema = {
      product_id: 'test',
      steps: [{
        step_id: 's1', title: 'استپ',
        sections: [
          { title: null, items: [{ type: 'text' as const, id: 'f1', title: 'نام' }] },
          { title: 'گروه', items: [{ type: 'number' as const, id: 'f2', title: 'سن' }] },
        ],
      }],
    }
    const state = schemaToBuilderState(schema)
    const rebuilt = builderStateToSchema(state)
    expect(rebuilt.steps[0].sections.flatMap(s => s.items).length).toBe(2)
  })
})
