// Tests for show_if condition evaluation, including the "hidden until controller is answered" rule for !=.
import { describe, it, expect } from 'vitest'
import { evalCondition, itemVisible } from './conditions'

describe('evalCondition', () => {
  it('returns true for empty/null expressions', () => {
    expect(evalCondition(null, {})).toBe(true)
    expect(evalCondition('', {})).toBe(true)
    expect(evalCondition(undefined, {})).toBe(true)
  })

  it('evaluates == against the field value', () => {
    expect(evalCondition("med_group == 'پزشکان'", { med_group: 'پزشکان' })).toBe(true)
    expect(evalCondition("med_group == 'پزشکان'", { med_group: 'پیراپزشکان' })).toBe(false)
    expect(evalCondition("med_group == 'پزشکان'", {})).toBe(false)
  })

  it('!= stays hidden until the controlling field has a value', () => {
    expect(evalCondition("ncd_years != 'بدون سابقه'", {})).toBe(false)
    expect(evalCondition("ncd_years != 'بدون سابقه'", { ncd_years: 'بدون سابقه' })).toBe(false)
    expect(evalCondition("ncd_years != 'بدون سابقه'", { ncd_years: 'دو سال' })).toBe(true)
  })

  it('itemVisible defaults to visible without conditions', () => {
    expect(itemVisible(undefined, {})).toBe(true)
    expect(itemVisible({ show_if: null }, {})).toBe(true)
  })
})
