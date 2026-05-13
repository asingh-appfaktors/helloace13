import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { GreetingDisplay } from '../src/components/GreetingDisplay'
import * as greetingClient from '../src/api/greetingClient'

vi.mock('../src/api/greetingClient')

const mockedGetGreetingMessage = vi.mocked(greetingClient.getGreetingMessage)

describe('GreetingDisplay', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('test_renders_greeting_message_when_api_returns_success', async () => {
    mockedGetGreetingMessage.mockResolvedValue('Hello, World!')

    render(<GreetingDisplay />)

    await waitFor(() => {
      expect(screen.getByText('Hello, World!')).toBeInTheDocument()
    })
  })

  it('test_renders_loading_state_when_request_is_pending', () => {
    mockedGetGreetingMessage.mockReturnValue(new Promise(() => {}))

    render(<GreetingDisplay />)

    expect(screen.getByText('Loading greeting...')).toBeInTheDocument()
  })

  it('test_renders_error_message_when_api_throws', async () => {
    mockedGetGreetingMessage.mockRejectedValue(new Error('Network error'))

    render(<GreetingDisplay />)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('test_calls_greeting_api_once_on_mount', async () => {
    mockedGetGreetingMessage.mockResolvedValue('Hi!')

    render(<GreetingDisplay />)

    await waitFor(() => {
      expect(mockedGetGreetingMessage).toHaveBeenCalledTimes(1)
    })
  })
})
