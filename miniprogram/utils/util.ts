/**
 * Format a Date object to a readable string
 * Output format: YYYY-MM-DD HH:mm:ss
 */
export const formatTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  
  // For chat messages, we only need hours and minutes
  return `${formatNumber(hour)}:${formatNumber(minute)}`
}

/**
 * Format a number to a two-digit string (e.g., 9 -> "09")
 */
const formatNumber = (n: number): string => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

/**
 * Generate a unique ID
 */
export const generateUniqueId = (): string => {
  return Date.now().toString() + Math.floor(Math.random() * 10000).toString()
} 