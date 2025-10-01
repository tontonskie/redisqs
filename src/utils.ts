export function isPlainObject(obj: unknown): obj is Record<string | number | symbol, unknown> {
  if (obj === null || typeof obj != 'object') return false
  const proto = Object.getPrototypeOf(obj)
  return proto === null || proto === Object.prototype
}
