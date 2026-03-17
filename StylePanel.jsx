import { PanelSection, Field, ColorInput, TextInput, SelectInput, Textarea } from './BlockPanel'

const FONTS = [
  { value: '', label: 'Default' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Helvetica Neue', sans-serif", label: 'Helvetica' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: "'Times New Roman', serif", label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet' },
]
const ALIGNS = [
  { value: 'left', label: '← Left' },
  { value: 'center', label: '↔ Center' },
  { value: 'right', label: '→ Right' },
]
const WEIGHTS = [
  { value: '300', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
]
const HEADING_LEVELS = ['h1','h2','h3','h4','h5','h6'].map(v => ({ value: v, label: v.toUpperCase() }))
const FLEX_DIRS = [{ value: 'row', label: '→ Row' }, { value: 'column', label: '↓ Column' }]
const JUSTIFY = [
  { value: 'flex-start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'flex-end', label: 'End' },
  { value: 'space-between', label: 'Space Between' },
  { value: 'space-around', label: 'Space Around' },
]
const ALIGN_ITEMS = [
  { value: 'stretch', label: 'Stretch' },
  { value: 'flex-start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'flex-end', label: 'End' },
]

export default function StylePanel({ block, onUpdateBlock, onUpdateStyle, onDelete, onMoveUp, onMoveDown, onAddBlock, t }) {
  const s = block.styles || {}

  const commonTextStyles = (
    <>
      <Field label={t.fontColor}><ColorInput value={s.fontColor || '#111111'} onChange={v => onUpdateStyle('fontColor', v)} /></Field>
      <Field label={t.fontSize}><TextInput value={s.fontSize || ''} placeholder="16px" onChange={v => onUpdateStyle('fontSize', v)} /></Field>
      <Field label={t.fontWeight}><SelectInput value={s.fontWeight || 'normal'} onChange={v => onUpdateStyle('fontWeight', v)} options={WEIGHTS} /></Field>
      <Field label={t.fontFamily}><SelectInput value={s.fontFamily || ''} onChange={v => onUpdateStyle('fontFamily', v)} options={FONTS} /></Field>
      <Field label={t.textAlign}><SelectInput value={s.textAlign || 'left'} onChange={v => onUpdateStyle('textAlign', v)} options={ALIGNS} /></Field>
    </>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#b8962e', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
          {block.type}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <HBtn onClick={onMoveUp} title={t.moveUp}>↑</HBtn>
          <HBtn onClick={onMoveDown} title={t.moveDown}>↓</HBtn>
          <HBtn onClick={onDelete} title={t.delete} danger>✕</HBtn>
        </div>
      </div>

      {/* HEADING */}
      {block.type === 'heading' && (
        <PanelSection title={t.blockSettings}>
          <Field label={t.content}><TextInput value={block.content || ''} onChange={v => onUpdateBlock({ content: v })} placeholder="Heading text" /></Field>
          <Field label={t.level}><SelectInput value={block.level || 'h2'} onChange={v => onUpdateBlock({ level: v })} options={HEADING_LEVELS} /></Field>
          {commonTextStyles}
        </PanelSection>
      )}

      {/* TEXT */}
      {block.type === 'text' && (
        <PanelSection title={t.blockSettings}>
          <Field label={t.content}><Textarea value={block.content || ''} onChange={v => onUpdateBlock({ content: v })} placeholder="Text content..." rows={5} /></Field>
          {commonTextStyles}
        </PanelSection>
      )}

      {/* IMAGE */}
      {block.type === 'image' && (
        <PanelSection title={t.blockSettings}>
          <Field label="URL"><TextInput value={block.src || ''} onChange={v => onUpdateBlock({ src: v })} placeholder="https://..." /></Field>
          <Field label="Alt Text"><TextInput value={block.alt || ''} onChange={v => onUpdateBlock({ alt: v })} placeholder="Description" /></Field>
          <Field label={t.width}><TextInput value={s.width || '100%'} onChange={v => onUpdateStyle('width', v)} placeholder="100%" /></Field>
          <Field label={t.height}><TextInput value={s.height || 'auto'} onChange={v => onUpdateStyle('height', v)} placeholder="auto" /></Field>
          <Field label={t.borderRadius}><TextInput value={s.borderRadius || '0px'} onChange={v => onUpdateStyle('borderRadius', v)} placeholder="0px" /></Field>
        </PanelSection>
      )}

      {/* BUTTON */}
      {block.type === 'button' && (
        <PanelSection title={t.blockSettings}>
          <Field label={t.label}><TextInput value={block.label || ''} onChange={v => onUpdateBlock({ label: v })} placeholder="Button text" /></Field>
          <Field label={t.url}><TextInput value={block.url || ''} onChange={v => onUpdateBlock({ url: v })} placeholder="https://..." /></Field>
          <Field label={t.bgColor}><ColorInput value={s.bgColor || '#111111'} onChange={v => onUpdateStyle('bgColor', v)} /></Field>
          <Field label={t.fontColor}><ColorInput value={s.fontColor || '#ffffff'} onChange={v => onUpdateStyle('fontColor', v)} /></Field>
          <Field label={t.fontSize}><TextInput value={s.fontSize || '14px'} onChange={v => onUpdateStyle('fontSize', v)} placeholder="14px" /></Field>
          <Field label={t.padding}><TextInput value={s.padding || '12px 28px'} onChange={v => onUpdateStyle('padding', v)} placeholder="12px 28px" /></Field>
          <Field label={t.borderRadius}><TextInput value={s.borderRadius || '4px'} onChange={v => onUpdateStyle('borderRadius', v)} placeholder="4px" /></Field>
          <Field label="Border"><TextInput value={s.border || ''} onChange={v => onUpdateStyle('border', v)} placeholder="1px solid #fff" /></Field>
        </PanelSection>
      )}

      {/* VIDEO */}
      {block.type === 'video' && (
        <PanelSection title={t.blockSettings}>
          <Field label="YouTube / Vimeo URL"><TextInput value={block.url || ''} onChange={v => onUpdateBlock({ url: v })} placeholder="https://youtube.com/watch?v=..." /></Field>
          <Field label={t.width}><TextInput value={s.width || '100%'} onChange={v => onUpdateStyle('width', v)} placeholder="100%" /></Field>
        </PanelSection>
      )}

      {/* SPACER */}
      {block.type === 'spacer' && (
        <PanelSection title={t.blockSettings}>
          <Field label={t.height}><TextInput value={s.height || '40px'} onChange={v => onUpdateStyle('height', v)} placeholder="40px" /></Field>
        </PanelSection>
      )}

      {/* DIVIDER */}
      {block.type === 'divider' && (
        <PanelSection title={t.blockSettings}>
          <Field label={t.fontColor}><ColorInput value={s.color || '#e0e0e0'} onChange={v => onUpdateStyle('color', v)} /></Field>
          <Field label="Margin"><TextInput value={s.margin || '20px 0'} onChange={v => onUpdateStyle('margin', v)} placeholder="20px 0" /></Field>
          <Field label={t.width}><TextInput value={s.width || '100%'} onChange={v => onUpdateStyle('width', v)} placeholder="100%" /></Field>
        </PanelSection>
      )}

      {/* CONTAINER */}
      {block.type === 'container' && (
        <>
          <PanelSection title={t.blockSettings}>
            <Field label={t.flexDirection}><SelectInput value={s.flexDirection || 'row'} onChange={v => onUpdateStyle('flexDirection', v)} options={FLEX_DIRS} /></Field>
            <Field label={t.gap}><TextInput value={s.gap || '24px'} onChange={v => onUpdateStyle('gap', v)} placeholder="24px" /></Field>
            <Field label={t.alignItems}><SelectInput value={s.alignItems || 'stretch'} onChange={v => onUpdateStyle('alignItems', v)} options={ALIGN_ITEMS} /></Field>
            <Field label={t.justifyContent}><SelectInput value={s.justifyContent || 'flex-start'} onChange={v => onUpdateStyle('justifyContent', v)} options={JUSTIFY} /></Field>
            <Field label={t.padding}><TextInput value={s.padding || ''} onChange={v => onUpdateStyle('padding', v)} placeholder="0px" /></Field>
            <Field label={t.bgColor}><ColorInput value={s.bgColor || ''} onChange={v => onUpdateStyle('bgColor', v)} /></Field>
            <Field label={t.stackOnMobile}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={s.stackOnMobile !== false}
                  onChange={e => onUpdateStyle('stackOnMobile', e.target.checked)}
                  style={{ accentColor: '#b8962e' }} />
                <span style={{ color: '#aaa', fontSize: 12 }}>{t.stackOnMobile}</span>
              </label>
            </Field>
          </PanelSection>
          <PanelSection title={t.addBlock}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {['heading','text','image','button','spacer','divider'].map(type => (
                <button key={type} onClick={() => onAddBlock(type, block.id)}
                  style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', padding: '8px', cursor: 'pointer', fontSize: 11, borderRadius: 4, fontFamily: 'inherit', transition: 'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#b8962e'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >{type}</button>
              ))}
            </div>
          </PanelSection>
        </>
      )}
    </div>
  )
}

function HBtn({ children, onClick, title, danger }) {
  return (
    <button onClick={onClick} title={title} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: danger ? '#ef4444' : '#777', fontSize: 12, cursor: 'pointer', padding: '4px 8px', borderRadius: 3, transition: 'all .15s', fontFamily: 'inherit' }}
      onMouseEnter={e => { e.target.style.borderColor = danger ? '#ef4444' : '#b8962e'; e.target.style.color = danger ? '#fca5a5' : '#b8962e' }}
      onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = danger ? '#ef4444' : '#777' }}
    >{children}</button>
  )
}
