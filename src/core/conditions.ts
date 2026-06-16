// Evaluates show_if / disabled_if / required_if expressions.
// Expression format: "field_id == 'value'" or "field_id != 'value'"
// Returns true if the condition is met (or if expression is null/empty).

export function evalCondition(expr: string | null | undefined, values: Record<string, unknown>): boolean {
  if (!expr) return true
  const eqMatch = expr.match(/^(\w+)\s*==\s*'([^']*)'$/)
  if (eqMatch) return String(values[eqMatch[1]] ?? '') === eqMatch[2]
  const neqMatch = expr.match(/^(\w+)\s*!=\s*'([^']*)'$/)
  if (neqMatch) return String(values[neqMatch[1]] ?? '') !== neqMatch[2]
  return true
}

export function itemVisible(conditions: { show_if?: string | null } | undefined, values: Record<string, unknown>) {
  return evalCondition(conditions?.show_if, values)
}

export function itemDisabled(conditions: { disabled_if?: string | null } | undefined, values: Record<string, unknown>) {
  return !evalCondition(conditions?.disabled_if ?? null, values) ? false : conditions?.disabled_if ? !evalCondition(conditions.disabled_if, values) : false
}
