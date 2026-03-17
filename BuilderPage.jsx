import { useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { useAuth } from '@/context/AuthContext'
import { useT } from '@/lib/i18n'
import { TEMPLATES, createEmptySection, createBlock } from '@/lib/templates'
import { exportAsHTML, exportAsZip } from '@/lib/exportHTML'
import { supabase } from '@/lib/supabase'
import SectionList from '@/components/editor/SectionList'
import BlockPanel from '@/components/editor/BlockPanel'
import StylePanel from '@/components/editor/StylePanel'
import PreviewPane from '@/components/preview/PreviewPane'
import ProjectsModal from '@/components/editor/ProjectsModal'
import toast from 'react-hot-toast'

const LANGS = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'it', label: 'IT' },
]

export default function BuilderPage({ lang, setLang }) {
  const t = useT(lang)
  const { user, signOut } = useAuth()

  const [sections, setSections] = useState([])
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [selectedBlockPath, setSelectedBlockPath] = useState(null) // [sectionId, blockId, parentId?]
  const [projectName, setProjectName] = useState(t.untitled)
  const [projectId, setProjectId] = useState(null)
  const [showProjects, setShowProjects] = useState(false)
  const [mobileView, setMobileView] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [saving, setSaving] = useState(false)

  // ── SECTION HELPERS ──
  const addSection = () => {
    const s = createEmptySection()
    setSections(prev => [...prev, s])
    setSelectedSectionId(s.id)
    setSelectedBlockId(null)
  }

  const deleteSection = (id) => {
    setSections(prev => prev.filter(s => s.id !== id))
    if (selectedSectionId === id) { setSelectedSectionId(null); setSelectedBlockId(null) }
  }

  const moveSectionUp = (id) => {
    setSections(prev => {
      const i = prev.findIndex(s => s.id === id)
      if (i <= 0) return prev
      const next = [...prev]
      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
      return next
    })
  }

  const moveSectionDown = (id) => {
    setSections(prev => {
      const i = prev.findIndex(s => s.id === id)
      if (i >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
      return next
    })
  }

  const duplicateSection = (id) => {
    setSections(prev => {
      const i = prev.findIndex(s => s.id === id)
      const copy = JSON.parse(JSON.stringify(prev[i]))
      copy.id = uuid()
      const next = [...prev]
      next.splice(i + 1, 0, copy)
      return next
    })
  }

  const updateSectionStyle = (sectionId, key, value) => {
    setSections(prev => prev.map(s => s.id === sectionId
      ? { ...s, styles: { ...s.styles, [key]: value } }
      : s
    ))
  }

  // ── BLOCK HELPERS ──
  const addBlock = (sectionId, type, parentBlockId = null) => {
    const block = createBlock(type)
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s
      if (!parentBlockId) {
        return { ...s, blocks: [...s.blocks, block] }
      }
      // Add to container
      const addToContainer = (blocks) => blocks.map(b => {
        if (b.id === parentBlockId && b.type === 'container') {
          return { ...b, blocks: [...(b.blocks || []), block] }
        }
        if (b.blocks) return { ...b, blocks: addToContainer(b.blocks) }
        return b
      })
      return { ...s, blocks: addToContainer(s.blocks) }
    }))
    setSelectedBlockId(block.id)
    setSelectedSectionId(sectionId)
  }

  const updateBlock = useCallback((sectionId, blockId, updates) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s
      const updateInBlocks = (blocks) => blocks.map(b => {
        if (b.id === blockId) return { ...b, ...updates }
        if (b.blocks) return { ...b, blocks: updateInBlocks(b.blocks) }
        return b
      })
      return { ...s, blocks: updateInBlocks(s.blocks) }
    }))
  }, [])

  const updateBlockStyle = useCallback((sectionId, blockId, key, value) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s
      const update = (blocks) => blocks.map(b => {
        if (b.id === blockId) return { ...b, styles: { ...b.styles, [key]: value } }
        if (b.blocks) return { ...b, blocks: update(b.blocks) }
        return b
      })
      return { ...s, blocks: update(s.blocks) }
    }))
  }, [])

  const deleteBlock = (sectionId, blockId) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s
      const del = (blocks) => blocks.filter(b => {
        if (b.id === blockId) return false
        if (b.blocks) b.blocks = del(b.blocks)
        return true
      })
      return { ...s, blocks: del([...s.blocks]) }
    }))
    if (selectedBlockId === blockId) setSelectedBlockId(null)
  }

  const moveBlockUp = (sectionId, blockId) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s
      const move = (blocks) => {
        const i = blocks.findIndex(b => b.id === blockId)
        if (i > 0) { const n = [...blocks]; [n[i-1],n[i]]=[n[i],n[i-1]]; return n }
        return blocks.map(b => b.blocks ? {...b,blocks:move(b.blocks)} : b)
      }
      return { ...s, blocks: move(s.blocks) }
    }))
  }

  const moveBlockDown = (sectionId, blockId) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s
      const move = (blocks) => {
        const i = blocks.findIndex(b => b.id === blockId)
        if (i >= 0 && i < blocks.length-1) { const n=[...blocks]; [n[i],n[i+1]]=[n[i+1],n[i]]; return n }
        return blocks.map(b => b.blocks ? {...b,blocks:move(b.blocks)} : b)
      }
      return { ...s, blocks: move(s.blocks) }
    }))
  }

  // ── SELECTED OBJECTS ──
  const selectedSection = sections.find(s => s.id === selectedSectionId)
  const findBlock = (blocks, id) => {
    for (const b of blocks) {
      if (b.id === id) return b
      if (b.blocks) { const found = findBlock(b.blocks, id); if (found) return found }
    }
    return null
  }
  const selectedBlock = selectedSection && selectedBlockId
    ? findBlock(selectedSection.blocks, selectedBlockId)
    : null

  // ── TEMPLATE LOADER ──
  const loadTemplate = (name) => {
    const tpl = TEMPLATES[name]
    if (!tpl) return
    const fresh = JSON.parse(JSON.stringify(tpl.sections)).map(s => ({ ...s, id: uuid(), blocks: s.blocks.map(b => ({...b, id: uuid()})) }))
    setSections(fresh)
    setSelectedSectionId(null)
    setSelectedBlockId(null)
    setShowTemplates(false)
    toast.success('Template loaded!')
  }

  // ── SAVE PROJECT ──
  const saveProject = async () => {
    setSaving(true)
    const data = { name: projectName, sections: JSON.stringify(sections), user_id: user.id, updated_at: new Date().toISOString() }
    let result
    if (projectId) {
      result = await supabase.from('projects').update(data).eq('id', projectId)
    } else {
      result = await supabase.from('projects').insert({ ...data, created_at: new Date().toISOString() }).select().single()
      if (result.data) setProjectId(result.data.id)
    }
    setSaving(false)
    if (result.error) { toast.error('Save failed: ' + result.error.message) }
    else { toast.success(t.projectSaved) }
  }

  // ── NEW PROJECT ──
  const newProject = () => {
    setSections([])
    setProjectName(t.untitled)
    setProjectId(null)
    setSelectedSectionId(null)
    setSelectedBlockId(null)
    toast.success('New project created')
  }

  // ── LOAD PROJECT ──
  const loadProject = (project) => {
    try {
      setSections(JSON.parse(project.sections))
      setProjectName(project.name)
      setProjectId(project.id)
      setSelectedSectionId(null)
      setSelectedBlockId(null)
      setShowProjects(false)
      toast.success(t.projectLoaded)
    } catch { toast.error('Failed to load project') }
  }

  return (
    <div style={layout.root}>
      {/* ── TOP BAR ── */}
      <div style={layout.topbar}>
        <div style={layout.tbLeft}>
          <span style={layout.brand}>PD</span>
          <input value={projectName} onChange={e => setProjectName(e.target.value)}
            style={layout.nameInput} placeholder={t.untitled} />
        </div>
        <div style={layout.tbCenter}>
          <TbBtn onClick={() => setShowTemplates(true)} title={t.selectTemplate}>⊞ {t.template}</TbBtn>
          <TbBtn onClick={() => setShowProjects(true)}>📁 {t.myProjects}</TbBtn>
          <TbBtn onClick={saveProject} disabled={saving} highlight>{saving ? '...' : `💾 ${t.save}`}</TbBtn>
          <TbBtn onClick={() => exportAsHTML(sections, projectName)}>⬇ HTML</TbBtn>
          <TbBtn onClick={() => exportAsZip(sections, projectName)}>⬇ ZIP</TbBtn>
        </div>
        <div style={layout.tbRight}>
          <TbBtn onClick={() => setMobileView(v => !v)}>
            {mobileView ? '🖥' : '📱'}
          </TbBtn>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)}
              style={{ ...layout.langBtn, ...(lang === l.code ? layout.langActive : {}) }}>
              {l.label}
            </button>
          ))}
          <TbBtn onClick={async () => { await signOut(); toast.success('Logged out') }}>
            {t.logout}
          </TbBtn>
        </div>
      </div>

      <div style={layout.body}>
        {/* ── LEFT: SECTION LIST ── */}
        <div style={layout.left}>
          <SectionList
            sections={sections}
            selectedSectionId={selectedSectionId}
            selectedBlockId={selectedBlockId}
            onSelectSection={(id) => { setSelectedSectionId(id); setSelectedBlockId(null) }}
            onSelectBlock={(sId, bId) => { setSelectedSectionId(sId); setSelectedBlockId(bId) }}
            onAddSection={addSection}
            onDeleteSection={deleteSection}
            onMoveUp={moveSectionUp}
            onMoveDown={moveSectionDown}
            onDuplicate={duplicateSection}
            t={t}
          />
        </div>

        {/* ── CENTER: PREVIEW ── */}
        <div style={layout.center}>
          <PreviewPane
            sections={sections}
            selectedSectionId={selectedSectionId}
            selectedBlockId={selectedBlockId}
            mobileView={mobileView}
            onSelectSection={setSelectedSectionId}
            onSelectBlock={(sId, bId) => { setSelectedSectionId(sId); setSelectedBlockId(bId) }}
          />
        </div>

        {/* ── RIGHT: STYLE / BLOCK PANEL ── */}
        <div style={layout.right}>
          {selectedBlock ? (
            <StylePanel
              key={selectedBlock.id}
              block={selectedBlock}
              section={selectedSection}
              onUpdateBlock={(updates) => updateBlock(selectedSectionId, selectedBlockId, updates)}
              onUpdateStyle={(k, v) => updateBlockStyle(selectedSectionId, selectedBlockId, k, v)}
              onDelete={() => deleteBlock(selectedSectionId, selectedBlockId)}
              onMoveUp={() => moveBlockUp(selectedSectionId, selectedBlockId)}
              onMoveDown={() => moveBlockDown(selectedSectionId, selectedBlockId)}
              onAddBlock={(type, parentId) => addBlock(selectedSectionId, type, parentId)}
              t={t}
            />
          ) : selectedSection ? (
            <BlockPanel
              section={selectedSection}
              onAddBlock={(type) => addBlock(selectedSectionId, type)}
              onUpdateSectionStyle={(k, v) => updateSectionStyle(selectedSectionId, k, v)}
              t={t}
            />
          ) : (
            <div style={layout.emptyPanel}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>←</div>
              <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6, textAlign: 'center' }}>
                Select a section or<br/>add a new one to start
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── TEMPLATES MODAL ── */}
      {showTemplates && (
        <Modal title={t.selectTemplate} onClose={() => setShowTemplates(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {Object.keys(TEMPLATES).map(name => (
              <button key={name} onClick={() => loadTemplate(name)} style={modalStyles.tplBtn}>
                <div style={modalStyles.tplIcon}>{name[0].toUpperCase()}</div>
                <span style={{ textTransform: 'capitalize', fontSize: 13 }}>{t[name] || name}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* ── PROJECTS MODAL ── */}
      {showProjects && (
        <ProjectsModal
          userId={user.id}
          onLoad={loadProject}
          onNew={newProject}
          onClose={() => setShowProjects(false)}
          t={t}
        />
      )}
    </div>
  )
}

function TbBtn({ children, onClick, highlight, disabled, title }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} style={{
      background: highlight ? '#b8962e' : 'rgba(255,255,255,0.07)',
      color: highlight ? '#000' : '#ccc',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '6px 14px',
      fontSize: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      fontFamily: 'inherit',
      letterSpacing: 0.5,
      transition: 'all .2s',
      borderRadius: 3,
      whiteSpace: 'nowrap',
    }}>{children}</button>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#1a1a1a', border: '1px solid rgba(184,150,46,0.25)', padding: '28px', width: '100%', maxWidth: 480, maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const layout = {
  root: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f0f0f', fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: 'hidden' },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 12, flexShrink: 0, flexWrap: 'wrap' },
  tbLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  tbCenter: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tbRight: { display: 'flex', alignItems: 'center', gap: 6 },
  brand: { background: 'linear-gradient(135deg,#b8962e,#8a6e20)', color: '#000', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, borderRadius: '50%', flexShrink: 0 },
  nameInput: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '5px 10px', fontSize: 13, outline: 'none', borderRadius: 3, minWidth: 140, fontFamily: 'inherit' },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  left: { width: 220, background: '#141414', borderRight: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  center: { flex: 1, overflow: 'auto', background: '#1a1a1a', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px' },
  right: { width: 280, background: '#141414', borderLeft: '1px solid rgba(255,255,255,0.07)', overflow: 'auto', flexShrink: 0 },
  emptyPanel: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, color: '#555' },
  langBtn: { background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#777', padding: '4px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 },
  langActive: { borderColor: '#b8962e', color: '#b8962e' },
}

const modalStyles = {
  tplBtn: { background: '#222', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc', padding: '20px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transition: 'border-color .2s', borderRadius: 4, fontFamily: 'inherit' },
  tplIcon: { width: 40, height: 40, background: 'rgba(184,150,46,0.15)', border: '1px solid rgba(184,150,46,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#b8962e' },
}
