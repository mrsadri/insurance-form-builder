// Fixed right-side panel: syntax-highlighted schema or JSON with active-key highlighting and a copy button.
import type { SchemaLine } from './explorerDefs'

function jsonHighlight(json: string) {
  return json.split('\n').map((line, i) => {
    const t = line
      .replace(/</g, '&lt;')
      .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="k">$1</span>$2')
      .replace(/(:\s*)("(?:[^"\\]|\\.)*")/g, '$1<span class="s">$2</span>')
    return `<span class="ln">${t || '&nbsp;'}</span>`
  }).join('')
}

function schemaHighlight(lines: SchemaLine[], activeKeys: Set<string>) {
  return lines.map(l => {
    const hl = l.k && activeKeys.has(l.k)
    let t = l.c
      ? `<span class="c">${l.t.replace(/</g, '&lt;')}</span>`
      : l.t.replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="k">$1</span>$2')
             .replace(/(:\s*)("(?:[^"\\]|\\.)*")/g, '$1<span class="s">$2</span>')
    return `<span class="ln${hl ? ' hl' : ''}">${t || '&nbsp;'}</span>`
  }).join('')
}

interface SchemaPanelProps {
  title: string
  schemaLines?: SchemaLine[]
  jsonText?: string
  note?: string
  activeKeys?: Set<string>
}

export function SchemaPanel({ title, schemaLines, jsonText, note, activeKeys = new Set() }: SchemaPanelProps) {
  const copyText = (text: string) => {
    try { navigator.clipboard.writeText(text) } catch {
      const ta = document.createElement('textarea')
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.focus(); ta.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      ta.remove()
    }
  }

  const rawText = schemaLines
    ? schemaLines.map(l => l.t).join('\n')
    : jsonText || ''

  const html = schemaLines
    ? schemaHighlight(schemaLines, activeKeys)
    : jsonText
      ? jsonHighlight(jsonText)
      : '<span class="ln"><span class="c">// فرمی بارگذاری نشده</span></span>'

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    copyText(rawText)
    const btn = e.currentTarget
    const old = btn.textContent
    btn.textContent = 'کپی شد ✓'
    setTimeout(() => { btn.textContent = old }, 1200)
  }

  return (
    <aside className="schema-panel">
      <div className="sp-head">
        <span>{title}</span>
        <button className="sp-copy" onClick={handleCopy}>⧉ کپی</button>
      </div>
      <pre
        className="schema-code"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {note && (
        <div className="sp-note" dangerouslySetInnerHTML={{ __html: note }} />
      )}
    </aside>
  )
}
