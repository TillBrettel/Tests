import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ProjectsModal({ userId, onLoad, onNew, onClose, t }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('projects')
      .select('id, name, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const loadProject = async (id) => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
    if (error) { toast.error('Load failed'); return }
    onLoad(data)
  }

  const deleteProject = async (id) => {
    if (!window.confirm(t.confirmDelete)) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    toast.success(t.projectDeleted)
    fetchProjects()
  }

  const fmt = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <h3 style={s.title}>{t.myProjects}</h3>
          <button onClick={onClose} style={s.closeBtn}>×</button>
        </div>

        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => { onNew(); onClose() }} style={s.newBtn}>
            + {t.newProject}
          </button>
        </div>

        <div style={s.list}>
          {loading && <div style={s.empty}>Loading...</div>}
          {!loading && projects.length === 0 && <div style={s.empty}>{t.noProjects}</div>}
          {projects.map(p => (
            <div key={p.id} style={s.row}>
              <div style={s.rowInfo}>
                <div style={s.rowName}>{p.name || t.untitled}</div>
                <div style={s.rowDate}>{fmt(p.updated_at || p.created_at)}</div>
              </div>
              <div style={s.rowActions}>
                <RowBtn onClick={() => loadProject(p.id)}>{t.loadProject}</RowBtn>
                <RowBtn onClick={() => deleteProject(p.id)} danger>{t.delete}</RowBtn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RowBtn({ children, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      background: 'none',
      border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : 'rgba(184,150,46,0.3)'}`,
      color: danger ? '#ef4444' : '#b8962e',
      padding: '4px 10px', fontSize: 11, cursor: 'pointer', borderRadius: 3,
      fontFamily: 'inherit', transition: 'all .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.1)' : 'rgba(184,150,46,0.1)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >{children}</button>
  )
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' },
  modal: { background: '#1a1a1a', border: '1px solid rgba(184,150,46,0.2)', width: '100%', maxWidth: 520, maxHeight: '80vh', display: 'flex', flexDirection: 'column', borderRadius: 4 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  title: { color: '#fff', fontSize: 15, fontWeight: 600 },
  closeBtn: { background: 'none', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer', lineHeight: 1 },
  newBtn: { background: 'rgba(184,150,46,0.15)', border: '1px solid rgba(184,150,46,0.3)', color: '#b8962e', padding: '8px 18px', fontSize: 12, cursor: 'pointer', borderRadius: 3, fontFamily: 'inherit', width: '100%', transition: 'background .2s' },
  list: { flex: 1, overflowY: 'auto' },
  empty: { padding: '40px 20px', textAlign: 'center', color: '#555', fontSize: 13 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 12 },
  rowInfo: { flex: 1, minWidth: 0 },
  rowName: { color: '#ddd', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowDate: { color: '#555', fontSize: 11, marginTop: 2 },
  rowActions: { display: 'flex', gap: 6, flexShrink: 0 },
}
