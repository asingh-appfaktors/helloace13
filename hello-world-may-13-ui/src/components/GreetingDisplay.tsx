import { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import { getGreetingMessage } from '../api/greetingClient'

type Status = 'loading' | 'success' | 'error'

interface State {
  status: Status
  message: string
}

export function GreetingDisplay() {
  const [state, setState] = useState<State>({ status: 'loading', message: '' })

  useEffect(() => {
    getGreetingMessage()
      .then((message) => setState({ status: 'success', message }))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load greeting'
        setState({ status: 'error', message })
      })
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#AFDDE5',
        fontFamily: 'Inter, sans-serif',
        px: 3,
      }}
    >
      {state.status === 'loading' && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#20e811' }} />
          <Typography variant="body1" sx={{ mt: 2, color: '#001E21' }}>
            Loading greeting...
          </Typography>
        </Box>
      )}

      {state.status === 'success' && (
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: '#001E21',
            fontWeight: 600,
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {state.message}
        </Typography>
      )}

      {state.status === 'error' && (
        <Alert
          severity="error"
          sx={{ maxWidth: 480, borderRadius: '8px' }}
        >
          {state.message}
        </Alert>
      )}
    </Box>
  )
}
