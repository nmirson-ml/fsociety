/**
 * useNanobana — Placeholder hook for Google Imagen (Nanobana Pro) MCP integration.
 *
 * When the Nanobana Pro MCP is enabled, replace the `generate` implementation
 * to call the MCP tool. The hook signature stays the same so all callers
 * auto-upgrade without changes.
 *
 * Usage:
 *   const { generate, imageUrl, loading } = useNanobana()
 *   await generate({ prompt: 'TCP/IP handshake diagram, dark tech style' })
 */

import { useState } from 'react'

interface GenerateOptions {
  prompt: string
  style?: 'technical-diagram' | 'network-topology' | 'attack-flow' | 'infographic'
  aspectRatio?: '16:9' | '4:3' | '1:1'
}

interface UseNanobanaReturn {
  generate: (options: GenerateOptions) => Promise<string | null>
  imageUrl: string | null
  loading: boolean
  error: string | null
}

// ─── Placeholder SVG generator ────────────────────────────────────────────────
// Returns a basic SVG placeholder until Nanobana Pro MCP is available.
function makePlaceholderSvg(prompt: string): string {
  const encoded = encodeURIComponent(prompt.slice(0, 40))
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' style='background:%230d1117'>
    <rect x='1' y='1' width='798' height='448' rx='8' fill='none' stroke='%2330363d' stroke-width='1'/>
    <text x='400' y='200' text-anchor='middle' fill='%2358a6ff' font-family='monospace' font-size='14'>
      [Nanobana Pro MCP not yet connected]
    </text>
    <text x='400' y='230' text-anchor='middle' fill='%238b949e' font-family='monospace' font-size='11'>
      ${encoded}...
    </text>
    <text x='400' y='280' text-anchor='middle' fill='%233fb950' font-family='monospace' font-size='11'>
      Enable Imagen MCP to generate this diagram
    </text>
  </svg>`
}

export function useNanobana(): UseNanobanaReturn {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (options: GenerateOptions): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      // TODO: When Nanobana Pro MCP is enabled, replace this block with:
      // const result = await mcpClient.call('nanobana.generate', {
      //   prompt: options.prompt,
      //   aspect_ratio: options.aspectRatio ?? '16:9',
      // })
      // const url = result.imageUrl
      // setImageUrl(url)
      // return url

      // Placeholder fallback
      await new Promise(resolve => setTimeout(resolve, 300))
      const url = makePlaceholderSvg(options.prompt)
      setImageUrl(url)
      return url
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { generate, imageUrl, loading, error }
}
