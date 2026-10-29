function svgData(bg, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
    <rect width="640" height="400" fill="${bg}"/>
    <rect x="0" y="250" width="640" height="150" fill="#2a2a2a"/>
    <rect x="0" y="318" width="640" height="14" fill="#f5d76e"/>
    <circle cx="180" cy="210" r="38" fill="#555"/>
    <text x="320" y="80" text-anchor="middle" fill="#fff" font-size="22" font-family="Arial">${label}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const PLACEHOLDER_IMAGES = {
  pothole: svgData('#6b5344', 'Pothole'),
  crack: svgData('#7a7468', 'Road Crack'),
  flood: svgData('#3d5a73', 'Waterlogging'),
  broken: svgData('#5c4a3a', 'Broken Surface'),
  manhole: svgData('#4a5560', 'Damaged Manhole'),
  complete: svgData('#3d6b4f', 'Repair Complete'),
}

export function fileToDataUrl(file, maxBytes) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected.'))
      return
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please upload a JPG, PNG, GIF, or WebP image.'))
      return
    }
    if (file.size > maxBytes) {
      reject(new Error('Image must be 450 KB or smaller.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read that image.'))
    reader.readAsDataURL(file)
  })
}
