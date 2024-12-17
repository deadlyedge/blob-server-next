// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

/**
 * Little delay util.
 * @param ms
 * @returns a custom delay Promise
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * transform number to a string like 'MB, KB...'
 * @param bytes
 * @param decimals
 * @returns {string}
 */
export const formatBytes = (bytes: number, decimals = 1) => {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * make a random string, check if it exist in the database.
 * if it does, add a "_" to the random string.
 * this is just a small project so it does not even happen.
 * @param len of result
 * @returns string
 */
export const getRandomString = (
  len = Number(process.env.DEFAULT_SHORT_PATH_LENGTH) || 10 // Default fallback to 10 if undefined
): string => {
  const pool = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnprstuvwxyz2345678" // xdream

  // Create an array to store the characters
  const randomChars = new Array(len)
  for (let i = 0; i < len; i++) {
    randomChars[i] = pool.charAt(Math.floor(Math.random() * pool.length))
  }
  // Join the array into a string and return
  return randomChars.join("")
}
