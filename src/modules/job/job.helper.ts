export const generateCSID = () => {
  const now = new Date()
  const dateOnly = now
    .toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    .replace(/-/g, '')

  const letterOnly = `${now.getHours()}${now.getMinutes()}`
    .padStart(4, '0')
    .split('')
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join('')

  const timeOnly = now
    .toLocaleTimeString('vi-VN', { hour12: false, hour: '2-digit', minute: '2-digit' })
    .replace(/:/g, '')

  return `${dateOnly}-${letterOnly}-${timeOnly}`
}
