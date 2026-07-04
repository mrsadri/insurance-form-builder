// Theme editor: live controls for brand color, corner radius, button size, font, and light/dark mode with CSS token export.
import { SchemaPanel } from '../explorer/SchemaPanel'
import { generateTokensCSS, type ThemeValues } from '../../hooks/useTheme'
import { fa } from '../../i18n/fa'

const SWATCHES = ['#008FFF','#0F766E','#2563EB','#7C3AED','#DB2777','#E0573B','#16A34A','#475569']
const FONTS = [
  { v: "'Vazirmatn'", t: 'Vazirmatn' },
  { v: "'IBM Plex Sans Arabic'", t: 'IBM Plex Sans Arabic' },
  { v: "'Noto Sans Arabic'", t: 'Noto Sans Arabic' },
]

interface SettingsProps {
  theme: ThemeValues
  setTheme: (updates: Partial<ThemeValues>) => void
  reset: () => void
}

export function Settings({ theme, setTheme, reset }: SettingsProps) {
  const tokensCSS = generateTokensCSS(theme)

  return (
    <>
      <div className="stage">
        <div className="stage-head">
          <div className="eyebrow"><span className="k">:root</span> <span>{'{ design tokens }'}</span></div>
          <h2>تنظیمات اصلی</h2>
          <p className="desc">تم را زنده تنظیم کن؛ همه‌ی کامپوننت‌ها و خود رابط از همین توکن‌ها استفاده می‌کنند.</p>
        </div>
        <div className="howto">
          روی هر گزینه کلیک یا اسلایدر را بکش تا تغییر زنده روی کل رابط اعمال شود.
          توکن‌های ساخته‌شده در پنل کناری برای هندآف به فرانت آماده‌اند.
        </div>

        <div className="set-grid">
          <div className="panel set-card">
            <h4>حالت نمایش</h4><p>روشن یا تیره برای کل رابط.</p>
            <div className="seg">
              {(['light','dark'] as const).map(m => (
                <button key={m} className={theme.mode === m ? 'on' : ''} onClick={() => setTheme({ mode: m })}>
                  {m === 'light' ? 'روشن' : 'تیره'}
                </button>
              ))}
            </div>
          </div>

          <div className="panel set-card">
            <h4>رنگ اصلی</h4><p>روی همه‌ی کامپوننت‌ها اعمال می‌شود.</p>
            <div className="swatches">
              {SWATCHES.map(c => (
                <span
                  key={c}
                  className={`sw${theme.brand.toLowerCase() === c.toLowerCase() ? ' on' : ''}`}
                  style={{ background: c }}
                  onClick={() => setTheme({ brand: c })}
                />
              ))}
              <label className="sw-custom" title="رنگ دلخواه" style={{ display: 'grid', placeItems: 'center', color: 'var(--ink-faint)' }}>
                +
                <input
                  type="color"
                  value={theme.brand}
                  style={{ position: 'absolute', opacity: 0, width: 30, height: 30, cursor: 'pointer' }}
                  onChange={e => setTheme({ brand: e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="panel set-card">
            <h4>میزان انحنا</h4><p>گردیِ گوشه‌ی کارت‌ها، اینپوت‌ها و دکمه‌ها.</p>
            <div className="range-row">
              <input
                type="range" min={0} max={22} value={theme.radius}
                onChange={e => setTheme({ radius: +e.target.value })}
              />
              <span className="v">{fa(theme.radius)}px</span>
            </div>
          </div>

          <div className="panel set-card">
            <h4>سایز دکمه‌ها</h4><p>پدینگ و سایز متنِ دکمه‌ها.</p>
            <div className="seg">
              {(['sm','md','lg'] as const).map(s => (
                <button key={s} className={theme.btn === s ? 'on' : ''} onClick={() => setTheme({ btn: s })}>
                  {s === 'sm' ? 'کوچک' : s === 'md' ? 'متوسط' : 'بزرگ'}
                </button>
              ))}
            </div>
            <div className="set-preview">
              <button className="btn btn-primary">مرحله بعد</button>
              <button className="btn btn-ghost">مرحله قبل</button>
            </div>
          </div>

          <div className="panel set-card">
            <h4>فونت</h4><p>فونت پایه‌ی رابط و کامپوننت‌ها.</p>
            <select
              className="set-select"
              value={theme.font}
              onChange={e => setTheme({ font: e.target.value })}
            >
              {FONTS.map(f => <option key={f.v} value={f.v}>{f.t}</option>)}
            </select>
          </div>

          <div className="panel set-card">
            <h4>اندازه‌ی متن پایه</h4><p>مقیاس کلی تایپوگرافی.</p>
            <div className="range-row">
              <input
                type="range" min={12} max={17} value={theme.fs}
                onChange={e => setTheme({ fs: +e.target.value })}
              />
              <span className="v">{fa(theme.fs)}px</span>
            </div>
            <button className="reset-btn" onClick={reset}>بازنشانی به پیش‌فرض</button>
          </div>
        </div>
      </div>

      <SchemaPanel
        title="theme · tokens"
        jsonText={tokensCSS}
        note='این توکن‌ها همان <b>design tokens</b> هستند که موقع هندآف به فرانت می‌دهی؛ کل رابط از این متغیرها استفاده می‌کند.'
      />
    </>
  )
}
