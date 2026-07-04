// Unit tests for Jalali calendar utilities: conversion accuracy and month length correctness.
import { describe, it, expect } from 'vitest'
import { toJalali, toGregorian, jalaliMonthLen, todayJalali } from './jalali'

describe('toJalali', () => {
  it('converts known Gregorian dates to Jalali', () => {
    expect(toJalali(2024, 3, 20)).toEqual({ jy: 1403, jm: 1, jd: 1 })
    expect(toJalali(2024, 1, 1)).toEqual({ jy: 1402, jm: 10, jd: 11 })
    expect(toJalali(1979, 2, 11)).toEqual({ jy: 1357, jm: 11, jd: 22 })
    expect(toJalali(2000, 1, 1)).toEqual({ jy: 1378, jm: 10, jd: 11 })
  })
})

describe('toGregorian', () => {
  it('round-trips back to Gregorian', () => {
    const pairs: [number, number, number][] = [
      [1403, 1, 1],
      [1402, 10, 11],
      [1357, 11, 22],
      [1378, 10, 11],
    ]
    for (const [jy, jm, jd] of pairs) {
      const { gy, gm, gd } = toGregorian(jy, jm, jd)
      expect(toJalali(gy, gm, gd)).toEqual({ jy, jm, jd })
    }
  })
})

describe('jalaliMonthLen', () => {
  it('gives correct month lengths', () => {
    // First 6 months always have 31 days
    for (let m = 1; m <= 6; m++) expect(jalaliMonthLen(1403, m)).toBe(31)
    // Months 7–11 always have 30 days
    for (let m = 7; m <= 11; m++) expect(jalaliMonthLen(1403, m)).toBe(30)
    // Month 12 has 29 or 30 days — verify via year total matching Gregorian days
    const { gy: gy1, gm: gm1, gd: gd1 } = toGregorian(1402, 1, 1)
    const { gy: gy2, gm: gm2, gd: gd2 } = toGregorian(1403, 1, 1)
    const daysInYear = (new Date(gy2, gm2 - 1, gd2).getTime() - new Date(gy1, gm1 - 1, gd1).getTime()) / 86400000
    expect(jalaliMonthLen(1402, 12)).toBe(daysInYear - 336) // 336 = days in months 1-11
  })
})

describe('todayJalali', () => {
  it('returns a valid Jalali date', () => {
    const { jy, jm, jd } = todayJalali()
    expect(jy).toBeGreaterThan(1400)
    expect(jm).toBeGreaterThanOrEqual(1)
    expect(jm).toBeLessThanOrEqual(12)
    expect(jd).toBeGreaterThanOrEqual(1)
    expect(jd).toBeLessThanOrEqual(31)
  })
})
