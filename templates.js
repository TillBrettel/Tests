import { v4 as uuid } from 'uuid'

export const TEMPLATES = {
  blank: {
    name: 'blank',
    sections: [],
  },
  modern: {
    name: 'modern',
    sections: [
      {
        id: uuid(), type: 'section',
        styles: { bgColor: '#0a0a0a', padding: '80px 60px', minHeight: '100vh' },
        blocks: [
          { id: uuid(), type: 'heading', content: 'Modern Design', level: 'h1', styles: { fontSize: '72px', fontColor: '#ffffff', fontWeight: '300', textAlign: 'center', fontFamily: 'Georgia, serif' } },
          { id: uuid(), type: 'text', content: 'Your tagline goes here. Clear, concise, memorable.', styles: { fontSize: '20px', fontColor: '#aaaaaa', textAlign: 'center', fontFamily: 'system-ui' } },
          { id: uuid(), type: 'button', label: 'Get Started', url: '#', styles: { bgColor: '#b8962e', fontColor: '#000', fontSize: '14px', padding: '14px 36px', borderRadius: '2px' } },
        ],
      },
      {
        id: uuid(), type: 'section',
        styles: { bgColor: '#111111', padding: '80px 60px' },
        blocks: [
          { id: uuid(), type: 'heading', content: 'About Us', level: 'h2', styles: { fontSize: '48px', fontColor: '#ffffff', fontWeight: '300', textAlign: 'left', fontFamily: 'Georgia, serif' } },
          { id: uuid(), type: 'text', content: 'Write your company description here. Tell your story and what makes you unique.', styles: { fontSize: '17px', fontColor: '#cccccc', textAlign: 'left' } },
        ],
      },
    ],
  },
  minimal: {
    name: 'minimal',
    sections: [
      {
        id: uuid(), type: 'section',
        styles: { bgColor: '#ffffff', padding: '120px 80px' },
        blocks: [
          { id: uuid(), type: 'heading', content: 'Less is more.', level: 'h1', styles: { fontSize: '80px', fontColor: '#111111', fontWeight: '700', textAlign: 'left', fontFamily: 'system-ui' } },
          { id: uuid(), type: 'divider', styles: { color: '#e0e0e0', margin: '32px 0' } },
          { id: uuid(), type: 'text', content: 'A clean foundation for your ideas.', styles: { fontSize: '18px', fontColor: '#666666', textAlign: 'left' } },
        ],
      },
    ],
  },
  bold: {
    name: 'bold',
    sections: [
      {
        id: uuid(), type: 'section',
        styles: { bgColor: '#ff3300', padding: '80px 60px', minHeight: '80vh' },
        blocks: [
          { id: uuid(), type: 'heading', content: 'BE BOLD.', level: 'h1', styles: { fontSize: '96px', fontColor: '#ffffff', fontWeight: '800', textAlign: 'center', fontFamily: 'Impact, sans-serif' } },
          { id: uuid(), type: 'text', content: 'Make a statement. Stand out from the crowd.', styles: { fontSize: '22px', fontColor: 'rgba(255,255,255,0.85)', textAlign: 'center' } },
          { id: uuid(), type: 'button', label: 'LEARN MORE', url: '#', styles: { bgColor: '#000000', fontColor: '#ffffff', fontSize: '13px', padding: '16px 48px', borderRadius: '0px' } },
        ],
      },
    ],
  },
  elegant: {
    name: 'elegant',
    sections: [
      {
        id: uuid(), type: 'section',
        styles: { bgColor: '#1a1208', padding: '100px 80px', minHeight: '90vh' },
        blocks: [
          { id: uuid(), type: 'heading', content: 'Elegance Defined', level: 'h1', styles: { fontSize: '68px', fontColor: '#d4aa50', fontWeight: '300', textAlign: 'center', fontFamily: 'Georgia, serif' } },
          { id: uuid(), type: 'divider', styles: { color: 'rgba(184,150,46,0.4)', margin: '28px auto', width: '80px' } },
          { id: uuid(), type: 'text', content: 'Crafted with precision. Designed for distinction.', styles: { fontSize: '18px', fontColor: '#c8bfa8', textAlign: 'center', fontFamily: 'Georgia, serif' } },
          { id: uuid(), type: 'button', label: 'Discover', url: '#', styles: { bgColor: 'transparent', fontColor: '#d4aa50', fontSize: '12px', padding: '14px 40px', borderRadius: '0px', border: '1px solid #d4aa50' } },
        ],
      },
    ],
  },
}

export const createEmptySection = () => ({
  id: uuid(),
  type: 'section',
  styles: { bgColor: '#ffffff', padding: '60px 40px', minHeight: '' },
  blocks: [],
})

export const createBlock = (type) => {
  const id = uuid()
  const base = { id, type }
  switch (type) {
    case 'heading': return { ...base, content: 'New Heading', level: 'h2', styles: { fontSize: '36px', fontColor: '#111111', fontWeight: '600', textAlign: 'left', fontFamily: '' } }
    case 'text': return { ...base, content: 'Your text here...', styles: { fontSize: '16px', fontColor: '#444444', textAlign: 'left', fontFamily: '' } }
    case 'image': return { ...base, src: '', alt: '', styles: { width: '100%', height: 'auto', borderRadius: '0px' } }
    case 'button': return { ...base, label: 'Click Here', url: '#', styles: { bgColor: '#111111', fontColor: '#ffffff', fontSize: '14px', padding: '12px 28px', borderRadius: '4px', border: '' } }
    case 'video': return { ...base, url: '', styles: { width: '100%' } }
    case 'spacer': return { ...base, styles: { height: '40px' } }
    case 'divider': return { ...base, styles: { color: '#e0e0e0', margin: '20px 0', width: '100%' } }
    case 'container': return {
      ...base,
      blocks: [],
      styles: { flexDirection: 'row', gap: '24px', alignItems: 'stretch', justifyContent: 'flex-start', padding: '0px', bgColor: '', stackOnMobile: true }
    }
    default: return base
  }
}
