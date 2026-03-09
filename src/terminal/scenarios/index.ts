import { scenario00 } from './scenario-00-basics'
import type { Scenario } from '@/types'

// Lazy imports for scenarios added in Phase 3 — wrapped to avoid import errors
// if files haven't been created yet
let _s01: Scenario | undefined
let _s02: Scenario | undefined
let _s03: Scenario | undefined
let _s04: Scenario | undefined
let _s05: Scenario | undefined
let _s06: Scenario | undefined

async function loadAdvancedScenarios() {
  try { _s01 = (await import('./scenario-01-dns-recon')).scenario01 } catch {}
  try { _s02 = (await import('./scenario-02-web-app')).scenario02 } catch {}
  try { _s03 = (await import('./scenario-03-persistence')).scenario03 } catch {}
  try { _s04 = (await import('./scenario-04-lateral')).scenario04 } catch {}
  try { _s05 = (await import('./scenario-05-soc')).scenario05 } catch {}
  try { _s06 = (await import('./scenario-06-terminal-basics')).scenario06 } catch {}
}

// Fire and forget — by the time the user navigates to a lab the imports will be ready
loadAdvancedScenarios()

/** Static registry — keyed by scenario id */
const BASE_REGISTRY: Record<string, Scenario> = {
  'scenario-00': scenario00,
}

function getRegistry(): Record<string, Scenario> {
  const reg = { ...BASE_REGISTRY }
  if (_s01) reg['scenario-01'] = _s01
  if (_s02) reg['scenario-02'] = _s02
  if (_s03) reg['scenario-03'] = _s03
  if (_s04) reg['scenario-04'] = _s04
  if (_s05) reg['scenario-05'] = _s05
  if (_s06) reg['scenario-06'] = _s06
  return reg
}

/**
 * Returns a fresh deep clone of the scenario so mutations in the terminal
 * never corrupt the static base definition.
 */
export function getScenario(id: string): Scenario | null {
  const registry = getRegistry()
  const base = registry[id]
  if (!base) return null
  // structuredClone strips functions (semanticCheck), so we manually rebuild
  const clone = structuredClone(base)
  // Re-attach semanticCheck functions (structuredClone drops them)
  base.objectives.forEach((obj, i) => {
    if (obj.semanticCheck) {
      clone.objectives[i].semanticCheck = obj.semanticCheck
    }
  })
  return clone
}

export function getAllScenarios(): Scenario[] {
  return Object.values(getRegistry())
}
