import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getGreetingMessage } from '../src/api/greetingClient'

describe('getGreetingMessage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('test_returns_greeting_text_when_api_responds_200', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Hello, World!' }),
    }))

    const result = await getGreetingMessage()

    expect(result).toBe('Hello, World!')
  })

  it('test_throws_error_when_api_responds_non_200', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }))

    await expect(getGreetingMessage()).rejects.toThrow('API error: 500')
  })

  it('test_throws_error_when_network_request_fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('NetworkError')))

    await expect(getGreetingMessage()).rejects.toThrow('NetworkError')
  })
})
