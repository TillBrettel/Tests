const BLOCK_TYPES = [
  { type: 'heading', icon: 'H', label: 'Heading' },
  { type: 'text', icon: '¶', label: 'Text' },
  { type: 'image', icon: '🖼', label: 'Image' },
  { type: 'button', icon: '⬜', label: 'Button' },
  { type: 'video', icon: '▶', label: 'Video' },
  { type: 'container', icon: '▣', label: 'Container' },
  { type: 'spacer', icon: '↕', label: 'Spacer' },
  { type: 'divider', icon: '─', label: 'Divider' },
]

export default function BlockPanel({ section, onAddBlock, onUpdateSectionStyle, t }) {
  const ss = section.styles || {}
  return (
    <div style={s.root}>
      <PanelSection title={t.addBlock}>
        <div style={s.blockGrid}>
          {BLOCK_TYPES.map(b => (
            <button key={b.type} onClick={() => onAddBlock(b.type)} style={s.blockBtn}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#b8962e'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <span style={s.blockIcon}>{b.icon}</span>
              <span style={s.blockLabel}>{t[b.type] || b.label}</span>
            </button>
          ))}
        </div>
      </PanelSection>

      <PanelSection title={t.sectionSettings}>
        <Field label={t.bgColor}>
          <ColorInput value={ss.bgColor || '#ffffff'} onChange={v => onUpdateSectionStyle('bgColor', v)} />
        </Field>
        <Field label={t.bgImage}>
          <TextInput value={ss.bgImage || ''} placeholder="https://..." onChange={v => onUpdateSectionStyle('bgImage', v)} />
        </Field>
        <Field label={t.padding}>
          <TextInput value={ss.padding || '60px 40px'} placeholder="60px 40px" onChange={v => onUpdateSectionStyle('padding', v)} />
        </Field>
        <Field label="Min Height">
          <TextInput value={ss.minHeight || ''} placeholder="e.g. 100vh" onChange={v => onUpdateSectionStyle('minHeight', v)} />
        </Field>
      </PanelSection>
    </div>
  )
}

export function PanelSection({ title, children }) {
  return (
    <div style={s.panelSec}>
      <div style={s.panelTitle}>{title}</div>
      <div style={s.panelBody}>{children}</div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div style={s.field}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

export function ColorInput({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input type="color" value={value || '#ffffff'} onChange={e => onChange(e.target.value)}
        style={{ width: 32, height: 28, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
        style={s.input} placeholder="#ffffff" />
    </div>
  )
}

export function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} style={s.input}
    onFocus={e => e.target.style.borderColor = '#b8962e'}
    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
  />
}

export function SelectInput({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...s.input, cursor: 'pointer' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} rows={rows} style={{ ...s.input, resize: 'vertical', lineHeight: 1.5 }}
    onFocus={e => e.target.style.borderColor = '#b8962e'}
    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
  />
}

const s = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' },
  blockGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 },
  blockBtn: { background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc', padding: '10px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'border-color .2s', borderRadius: 4, fontFamily: 'inherit' },
  blockIcon: { fontSize: 16, color: '#b8962e' },
  blockLabel: { fontSize: 11, color: '#aaa' },
  panelSec: { borderBottom: '1px solid rgba(255,255,255,0.06)' },
  panelTitle: { color: '#888', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 14px 8px', background: 'rgba(255,255,255,0.02)' },
  panelBody: { padding: '10px 14px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  fieldLabel: { color: '#777', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ddd', padding: '7px 10px', fontSize: 12, outline: 'none', width: '100%', fontFamily: 'inherit', borderRadius: 3, transition: 'border-color .2s' },
}
