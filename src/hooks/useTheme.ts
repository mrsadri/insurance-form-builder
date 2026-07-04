// Applies ThemeValues as CSS custom properties on :root and exports the current token set as copy-ready CSS.
import { useEffect } from 'react'

export interface ThemeValues {
  mode: 'light' | 'dark'
  brand: string
  radius: number
  btn: 'sm' | 'md' | 'lg'
  font: string
  fs: number
}

export const DEFAULT_THEME: ThemeValues = {
  mode: 'light',
  brand: '#008FFF',
  radius: 12,
  btn: 'md',
  font: "'Vazirmatn'",
  fs: 14,
}

function applyTheme(t: ThemeValues) {
  const r = document.documentElement
  r.dataset.theme = t.mode
  r.style.setProperty('--brand', t.brand)
  r.style.setProperty('--radius', t.radius + 'px')
  r.style.setProperty('--radius-sm', Math.max(0, Math.round(t.radius * 0.7)) + 'px')
  const btnMap = { sm: ['8px 16px', '13px'], md: ['11px 22px', '14px'], lg: ['14px 28px', '15px'] }
  const [pad, fs] = btnMap[t.btn]
  r.style.setProperty('--btn-pad', pad)
  r.style.setProperty('--btn-font', fs)
  r.style.setProperty('--body', t.font + ', system-ui, sans-serif')
  r.style.setProperty('--fs-base', t.fs + 'px')
}

export function useTheme(t: ThemeValues) {
  useEffect(() => { applyTheme(t) }, [t])
}

export function generateTokensCSS(t: ThemeValues) {
  const btnPad = { sm: '8px 16px', md: '11px 22px', lg: '14px 28px' }[t.btn]
  return [
    ':root {',
    `  --brand: ${t.brand};`,
    `  --radius: ${t.radius}px;`,
    `  --radius-sm: ${Math.max(0, Math.round(t.radius * 0.7))}px;`,
    `  --btn-pad: ${btnPad};`,
    `  --body: ${t.font};`,
    `  --fs-base: ${t.fs}px;`,
    '}',
    '',
    `/* data-theme="${t.mode}" */`,
  ].join('\n')
}
