import type { ComponentDef, ExplorerProps, LiveState } from './explorerDefs'

interface GalleryProps {
  def: ComponentDef
  props: ExplorerProps
  live: LiveState
  setLive: (l: LiveState) => void
}

export function Gallery({ def, props, live, setLive }: GalleryProps) {
  return (
    <>
      <div className="gallery-head">
        <h3>حالت‌ها</h3>
        <span>هر کارت یک state ثابت است و با تغییر پراپرتی‌ها به‌روز می‌شود.</span>
      </div>
      <div className="gallery">
        {def.states.map(st => (
          <div key={st.k} className="state-card">
            <span className={`state-tag s-${st.k}`}>
              <span className="sd" />{st.t}
            </span>
            {def.renderState(st.k, props, live, setLive)}
          </div>
        ))}
      </div>
    </>
  )
}
