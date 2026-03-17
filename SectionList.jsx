export default function SectionList({
  sections, selectedSectionId, selectedBlockId,
  onSelectSection, onSelectBlock,
  onAddSection, onDeleteSection, onMoveUp, onMoveDown, onDuplicate, t
}) {
  return (
    <div style={s.root}>
      <div style={s.header}>
        <span style={s.title}>{t.sections}</span>
        <button onClick={onAddSection} style={s.addBtn} title={t.addSection}>+</button>
      </div>
      <div style={s.list}>
        {sections.length === 0 && (
          <div style={s.empty}>
            <p style={{ color: '#555', fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
              No sections yet.<br/>Click + to add one.
            </p>
          </div>
        )}
        {sections.map((section, idx) => (
          <SectionItem
            key={section.id}
            section={section}
            index={idx}
            isSelected={section.id === selectedSectionId}
            selectedBlockId={selectedBlockId}
            onSelect={() => onSelectSection(section.id)}
            onSelectBlock={(bId) => onSelectBlock(section.id, bId)}
            onDelete={() => onDeleteSection(section.id)}
            onMoveUp={() => onMoveUp(section.id)}
            onMoveDown={() => onMoveDown(section.id)}
            onDuplicate={() => onDuplicate(section.id)}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}

function SectionItem({ section, index, isSelected, selectedBlockId, onSelect, onSelectBlock, onDelete, onMoveUp, onMoveDown, onDuplicate, t }) {
  return (
    <div style={{ ...s.section, ...(isSelected ? s.sectionActive : {}) }}>
      <div style={s.sectionHeader} onClick={onSelect}>
        <span style={s.sectionNum}>{index + 1}</span>
        <span style={s.sectionName}>Section {index + 1}</span>
        <div style={s.actions} onClick={e => e.stopPropagation()}>
          <ABtn onClick={onMoveUp} title={t.moveUp}>↑</ABtn>
          <ABtn onClick={onMoveDown} title={t.moveDown}>↓</ABtn>
          <ABtn onClick={onDuplicate} title={t.duplicate}>⧉</ABtn>
          <ABtn onClick={onDelete} title={t.delete} danger>✕</ABtn>
        </div>
      </div>
      {isSelected && section.blocks.length > 0 && (
        <div style={s.blocks}>
          {section.blocks.map(block => (
            <BlockItem key={block.id} block={block} isSelected={block.id === selectedBlockId}
              onSelect={() => onSelectBlock(block.id)} t={t} depth={0} />
          ))}
        </div>
      )}
    </div>
  )
}

function BlockItem({ block, isSelected, onSelect, t, depth }) {
  const icon = { heading: 'H', text: '¶', image: '🖼', button: '⬜', video: '▶', container: '▣', spacer: '↕', divider: '─' }[block.type] || '□'
  return (
    <>
      <div style={{ ...s.block, ...(isSelected ? s.blockActive : {}), paddingLeft: 12 + depth * 12 }}
        onClick={onSelect}>
        <span style={s.blockIcon}>{icon}</span>
        <span style={s.blockName}>{block.type}</span>
      </div>
      {block.type === 'container' && (block.blocks || []).map(child => (
        <BlockItem key={child.id} block={child} isSelected={child.id === isSelected}
          onSelect={() => onSelect(child.id)} t={t} depth={depth + 1} />
      ))}
    </>
  )
}

function ABtn({ children, onClick, title, danger }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: 'none', border: 'none',
      color: danger ? '#ef4444' : '#666',
      fontSize: 12, cursor: 'pointer', padding: '2px 4px',
      lineHeight: 1, transition: 'color .15s',
    }}
      onMouseEnter={e => e.target.style.color = danger ? '#fca5a5' : '#b8962e'}
      onMouseLeave={e => e.target.style.color = danger ? '#ef4444' : '#666'}
    >{children}</button>
  )
}

const s = {
  root: { display: 'flex', flexDirection: 'column', height: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  title: { color: '#888', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  addBtn: { background: '#b8962e', color: '#000', border: 'none', width: 22, height: 22, borderRadius: '50%', fontSize: 16, cursor: 'pointer', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  list: { flex: 1, overflowY: 'auto', padding: '8px 0' },
  empty: { padding: '40px 16px' },
  section: { borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' },
  sectionActive: { background: 'rgba(184,150,46,0.08)' },
  sectionHeader: { display: 'flex', alignItems: 'center', padding: '8px 10px', gap: 8 },
  sectionNum: { background: 'rgba(184,150,46,0.2)', color: '#b8962e', fontSize: 10, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionName: { color: '#ccc', fontSize: 12, flex: 1 },
  actions: { display: 'flex', gap: 2 },
  blocks: { paddingBottom: 6 },
  block: { display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px', cursor: 'pointer' },
  blockActive: { background: 'rgba(184,150,46,0.12)' },
  blockIcon: { color: '#666', fontSize: 11, width: 14, textAlign: 'center', flexShrink: 0 },
  blockName: { color: '#888', fontSize: 11, textTransform: 'capitalize' },
}
