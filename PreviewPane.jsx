function renderBlock(block, selectedBlockId, onSelectBlock, sectionId) {
  const s = block.styles || {}
  const isSelected = block.id === selectedBlockId

  const selectProps = {
    onClick: (e) => { e.stopPropagation(); onSelectBlock(sectionId, block.id) },
    style: {
      outline: isSelected ? '2px solid #b8962e' : '1px solid transparent',
      outlineOffset: 2,
      cursor: 'pointer',
      position: 'relative',
      transition: 'outline .15s',
    },
    onMouseEnter: (e) => { if (!isSelected) e.currentTarget.style.outline = '1px dashed rgba(184,150,46,0.5)' },
    onMouseLeave: (e) => { if (!isSelected) e.currentTarget.style.outline = '1px solid transparent' },
  }

  switch (block.type) {
    case 'heading': {
      const Tag = block.level || 'h2'
      return (
        <Tag key={block.id} {...selectProps} style={{
          ...selectProps.style,
          fontSize: s.fontSize || '2rem',
          color: s.fontColor || '#111',
          fontWeight: s.fontWeight || '600',
          textAlign: s.textAlign || 'left',
          fontFamily: s.fontFamily || 'inherit',
          margin: '0 0 16px',
          lineHeight: 1.15,
          wordBreak: 'break-word',
        }}>{block.content || 'Heading'}</Tag>
      )
    }
    case 'text': {
      return (
        <p key={block.id} {...selectProps} style={{
          ...selectProps.style,
          fontSize: s.fontSize || '16px',
          color: s.fontColor || '#444',
          fontWeight: s.fontWeight || 'normal',
          textAlign: s.textAlign || 'left',
          fontFamily: s.fontFamily || 'inherit',
          lineHeight: 1.7,
          margin: '0 0 16px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>{block.content || 'Text block'}</p>
      )
    }
    case 'image': {
      if (!block.src) return (
        <div key={block.id} {...selectProps} style={{ ...selectProps.style, background: '#222', border: '1px dashed #444', padding: '40px', textAlign: 'center', color: '#666', fontSize: 13, borderRadius: s.borderRadius || 0, marginBottom: 8 }}>
          🖼 No image URL set
        </div>
      )
      return (
        <div key={block.id} {...selectProps} style={{ ...selectProps.style, marginBottom: 8 }}>
          <img src={block.src} alt={block.alt || ''} style={{ width: s.width || '100%', height: s.height || 'auto', borderRadius: s.borderRadius || 0, display: 'block', maxWidth: '100%' }} />
        </div>
      )
    }
    case 'button': {
      return (
        <div key={block.id} {...selectProps} style={{ ...selectProps.style, marginBottom: 8 }}>
          <span style={{
            display: 'inline-block',
            background: s.bgColor || '#111',
            color: s.fontColor || '#fff',
            fontSize: s.fontSize || '14px',
            padding: s.padding || '12px 28px',
            borderRadius: s.borderRadius || '4px',
            border: s.border || 'none',
            cursor: 'default',
            fontFamily: 'inherit',
            textDecoration: 'none',
          }}>{block.label || 'Button'}</span>
        </div>
      )
    }
    case 'video': {
      if (!block.url) return (
        <div key={block.id} {...selectProps} style={{ ...selectProps.style, background: '#111', border: '1px dashed #333', padding: '40px', textAlign: 'center', color: '#555', fontSize: 13 }}>
          ▶ No video URL set
        </div>
      )
      let embedUrl = block.url
      const yt = block.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
      if (yt) embedUrl = `https://www.youtube.com/embed/${yt[1]}`
      const vm = block.url.match(/vimeo\.com\/(\d+)/)
      if (vm) embedUrl = `https://player.vimeo.com/video/${vm[1]}`
      return (
        <div key={block.id} {...selectProps} style={{ ...selectProps.style, position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: 8 }}>
          <iframe src={embedUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} frameBorder="0" allowFullScreen title="video" />
        </div>
      )
    }
    case 'spacer': {
      return (
        <div key={block.id} {...selectProps} style={{ ...selectProps.style, height: s.height || '40px', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
          {<span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', color: 'rgba(184,150,46,0.3)', fontSize: 10, letterSpacing: 2 }}>SPACER</span>}
        </div>
      )
    }
    case 'divider': {
      return (
        <div key={block.id} {...selectProps} style={{ ...selectProps.style, padding: '4px 0' }}>
          <hr style={{ border: 'none', borderTop: `1px solid ${s.color || '#e0e0e0'}`, margin: s.margin || '20px 0', width: s.width || '100%' }} />
        </div>
      )
    }
    case 'container': {
      const cs = block.styles || {}
      return (
        <div key={block.id} {...selectProps} style={{
          ...selectProps.style,
          display: 'flex',
          flexDirection: cs.flexDirection || 'row',
          gap: cs.gap || '24px',
          alignItems: cs.alignItems || 'stretch',
          justifyContent: cs.justifyContent || 'flex-start',
          padding: cs.padding || '0',
          background: cs.bgColor || 'transparent',
          marginBottom: 8,
          flexWrap: 'wrap',
          minHeight: 48,
        }}>
          {(block.blocks || []).length === 0 && (
            <div style={{ flex: 1, border: '1px dashed #333', padding: 20, textAlign: 'center', color: '#555', fontSize: 12, borderRadius: 4 }}>
              Empty container — select it and add blocks
            </div>
          )}
          {(block.blocks || []).map(child => renderBlock(child, selectedBlockId, onSelectBlock, sectionId))}
        </div>
      )
    }
    default: return null
  }
}

export default function PreviewPane({ sections, selectedSectionId, selectedBlockId, mobileView, onSelectSection, onSelectBlock }) {
  const previewWidth = mobileView ? 390 : '100%'

  return (
    <div style={{ width: previewWidth, maxWidth: '100%', background: '#fff', minHeight: 400, boxShadow: mobileView ? '0 8px 48px rgba(0,0,0,0.4)' : 'none', borderRadius: mobileView ? 8 : 0, overflow: 'hidden', transition: 'width .3s' }}>
      {sections.length === 0 && (
        <div style={{ padding: 80, textAlign: 'center', color: '#888', background: '#f9f9f9' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⊞</div>
          <p style={{ fontSize: 15, lineHeight: 1.6 }}>Add a section to start building,<br/>or choose a template.</p>
        </div>
      )}
      {sections.map((section) => {
        const ss = section.styles || {}
        const isSelected = section.id === selectedSectionId
        return (
          <div
            key={section.id}
            onClick={() => onSelectSection(section.id)}
            style={{
              background: ss.bgColor || '#ffffff',
              backgroundImage: ss.bgImage ? `url('${ss.bgImage}')` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: ss.padding || '60px 40px',
              minHeight: ss.minHeight || undefined,
              outline: isSelected ? '2px solid #b8962e' : '2px solid transparent',
              outlineOffset: -2,
              cursor: 'default',
              transition: 'outline .15s',
              position: 'relative',
            }}
          >
            {isSelected && (
              <div style={{ position: 'absolute', top: 6, left: 6, background: '#b8962e', color: '#000', fontSize: 9, padding: '2px 7px', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, borderRadius: 2, pointerEvents: 'none', zIndex: 10 }}>
                Section
              </div>
            )}
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              {(section.blocks || []).map(block => renderBlock(block, selectedBlockId, onSelectBlock, section.id))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
