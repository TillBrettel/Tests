// Generates clean standalone HTML from builder state

function renderBlockHTML(block) {
  const s = block.styles || {}

  switch (block.type) {
    case 'heading': {
      const tag = block.level || 'h2'
      const style = [
        s.fontSize && `font-size:${s.fontSize}`,
        s.fontColor && `color:${s.fontColor}`,
        s.fontWeight && `font-weight:${s.fontWeight}`,
        s.textAlign && `text-align:${s.textAlign}`,
        s.fontFamily && `font-family:${s.fontFamily}`,
        'margin:0 0 16px',
        'line-height:1.15',
      ].filter(Boolean).join(';')
      return `<${tag} style="${style}">${block.content || ''}</${tag}>`
    }
    case 'text': {
      const style = [
        s.fontSize && `font-size:${s.fontSize}`,
        s.fontColor && `color:${s.fontColor}`,
        s.fontWeight && `font-weight:${s.fontWeight}`,
        s.textAlign && `text-align:${s.textAlign}`,
        s.fontFamily && `font-family:${s.fontFamily}`,
        'margin:0 0 16px',
        'line-height:1.7',
        'white-space:pre-wrap',
      ].filter(Boolean).join(';')
      return `<p style="${style}">${(block.content || '').replace(/\n/g, '<br/>')}</p>`
    }
    case 'image': {
      if (!block.src) return ''
      const style = [
        `width:${s.width || '100%'}`,
        s.height && s.height !== 'auto' && `height:${s.height}`,
        s.borderRadius && `border-radius:${s.borderRadius}`,
        'display:block',
        'max-width:100%',
      ].filter(Boolean).join(';')
      return `<img src="${block.src}" alt="${block.alt || ''}" style="${style}"/>`
    }
    case 'button': {
      const style = [
        s.bgColor && `background:${s.bgColor}`,
        s.fontColor && `color:${s.fontColor}`,
        s.fontSize && `font-size:${s.fontSize}`,
        s.padding && `padding:${s.padding}`,
        s.borderRadius && `border-radius:${s.borderRadius}`,
        s.border && `border:${s.border}`,
        'display:inline-block',
        'text-decoration:none',
        'cursor:pointer',
        'font-family:inherit',
        'transition:opacity .2s',
      ].filter(Boolean).join(';')
      return `<a href="${block.url || '#'}" style="${style}" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">${block.label || 'Button'}</a>`
    }
    case 'video': {
      if (!block.url) return ''
      // Convert YouTube/Vimeo to embed
      let embedUrl = block.url
      const ytMatch = block.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
      if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
      const vmMatch = block.url.match(/vimeo\.com\/(\d+)/)
      if (vmMatch) embedUrl = `https://player.vimeo.com/video/${vmMatch[1]}`
      return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;width:${s.width||'100%'}"><iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe></div>`
    }
    case 'spacer': {
      return `<div style="height:${s.height || '40px'}"></div>`
    }
    case 'divider': {
      const style = [
        `border-color:${s.color || '#e0e0e0'}`,
        `margin:${s.margin || '20px 0'}`,
        s.width && s.width !== '100%' && `width:${s.width}`,
      ].filter(Boolean).join(';')
      return `<hr style="${style} border-style:solid;border-width:1px 0 0;"/>`
    }
    case 'container': {
      const cs = block.styles || {}
      const stackClass = cs.stackOnMobile ? 'stack-mobile' : ''
      const containerStyle = [
        `display:flex`,
        `flex-direction:${cs.flexDirection || 'row'}`,
        `gap:${cs.gap || '24px'}`,
        `align-items:${cs.alignItems || 'stretch'}`,
        `justify-content:${cs.justifyContent || 'flex-start'}`,
        cs.padding && `padding:${cs.padding}`,
        cs.bgColor && `background:${cs.bgColor}`,
      ].filter(Boolean).join(';')
      const inner = (block.blocks || []).map(renderBlockHTML).join('\n')
      return `<div class="${stackClass}" style="${containerStyle}">${inner}</div>`
    }
    default: return ''
  }
}

function renderSectionHTML(section) {
  const s = section.styles || {}
  const sectionStyle = [
    s.bgColor && `background:${s.bgColor}`,
    s.bgImage && `background-image:url('${s.bgImage}');background-size:cover;background-position:center`,
    s.padding && `padding:${s.padding}`,
    s.minHeight && `min-height:${s.minHeight}`,
  ].filter(Boolean).join(';')

  const blocksHTML = (section.blocks || []).map(renderBlockHTML).join('\n')
  return `  <section style="box-sizing:border-box;width:100%;${sectionStyle}">\n    <div style="max-width:1200px;margin:0 auto;">\n${blocksHTML}\n    </div>\n  </section>`
}

export function generateHTML(sections, projectName = 'My Website') {
  const sectionsHTML = (sections || []).map(renderSectionHTML).join('\n\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${projectName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6}
img,iframe,video{max-width:100%;height:auto}
@media(max-width:768px){
  .stack-mobile{flex-direction:column!important}
  h1{font-size:clamp(32px,8vw,72px)!important}
  h2{font-size:clamp(26px,6vw,48px)!important}
  section>div{padding:0 16px}
}
</style>
</head>
<body>
${sectionsHTML}
</body>
</html>`
}

export async function exportAsZip(sections, projectName) {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  zip.file('index.html', generateHTML(sections, projectName))
  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, `${projectName || 'website'}.zip`)
}

export function exportAsHTML(sections, projectName) {
  const html = generateHTML(sections, projectName)
  const blob = new Blob([html], { type: 'text/html' })
  downloadBlob(blob, `${projectName || 'website'}.html`)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
