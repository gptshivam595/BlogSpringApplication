export function getUsernameFromToken(token) {
  if (!token) {
    return ''
  }

  try {
    const payload = token.split('.')[1]
    if (!payload) {
      return ''
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    )
    const parsed = JSON.parse(json)
    return parsed.sub || ''
  } catch {
    return ''
  }
}

export function hasAnyRole(user, allowedRoles = []) {
  const roles = (user?.roles || []).map((role) => role?.name)
  return allowedRoles.some((role) => roles.includes(role))
}
