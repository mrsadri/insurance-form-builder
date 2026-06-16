import { useState } from 'react'
import { Explorer } from './apps/explorer/Explorer'
import { Builder } from './apps/builder/Builder'
import { Preview } from './apps/preview/Preview'
import { Settings } from './apps/settings/Settings'
import { useTheme, DEFAULT_THEME, type ThemeValues } from './hooks/useTheme'
import { usePersist } from './hooks/usePersist'
import type { FormSchema } from './core/types'

type View = 'explorer' | 'builder' | 'preview' | 'settings'

const NAV: { id: View; ic: string; label: string }[] = [
  { id: 'explorer', ic: '⊞', label: 'کاوشگر' },
  { id: 'builder',  ic: '⊕', label: 'فرم‌ساز' },
  { id: 'preview',  ic: '▶', label: 'پیش‌نمایش' },
  { id: 'settings', ic: '⊙', label: 'تنظیمات' },
]

export function App() {
  const [themeVals, setThemeVals] = usePersist<ThemeValues>('rfq-theme', DEFAULT_THEME)
  useTheme(themeVals)

  const [view, setView] = useState<View>('explorer')
  const [previewSchema, setPreviewSchema] = useState<FormSchema | null>(null)

  const updateTheme = (updates: Partial<ThemeValues>) =>
    setThemeVals(prev => ({ ...prev, ...updates }))
  const resetTheme = () => setThemeVals(DEFAULT_THEME)

  const sendToPreview = (schema: FormSchema) => {
    setPreviewSchema(schema)
    setView('preview')
  }

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-logo">RFQ</div>
        {NAV.map(n => (
          <button
            key={n.id}
            className={`nav-btn${view === n.id ? ' on' : ''}`}
            onClick={() => setView(n.id)}
            title={n.label}
          >
            <span className="nav-ic">{n.ic}</span>
            <span className="nav-lbl">{n.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {view === 'explorer' && <Explorer />}
        {view === 'builder'  && <Builder onSendToPreview={sendToPreview} />}
        {view === 'preview'  && <Preview initialSchema={previewSchema} />}
        {view === 'settings' && <Settings theme={themeVals} setTheme={updateTheme} reset={resetTheme} />}
      </main>
    </div>
  )
}
