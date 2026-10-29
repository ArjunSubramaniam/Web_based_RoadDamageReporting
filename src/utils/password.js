export async function hashPassword(password) {
  const data = new TextEncoder().encode(`rw:${password}`)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function passwordsMatch(password, hash) {
  return (await hashPassword(password)) === hash
}
