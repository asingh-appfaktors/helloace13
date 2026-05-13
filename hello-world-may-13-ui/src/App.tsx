import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GreetingDisplay } from './components/GreetingDisplay'

const theme = createTheme({
  palette: {
    primary: { main: '#20e811' },
    secondary: { main: '#0FA4AF' },
    background: { default: '#AFDDE5' },
    text: { primary: '#001E21', secondary: '#024950' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <GreetingDisplay />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
