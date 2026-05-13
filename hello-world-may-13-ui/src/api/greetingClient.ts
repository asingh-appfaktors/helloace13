/// <reference types="vite/client" />
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function getGreetingMessage(): Promise<string> {
  const res = await fetch(`${API_BASE}/greeting`)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  const data = await res.json() as { message: string }
  return data.message
}
