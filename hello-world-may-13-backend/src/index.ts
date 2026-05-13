import app from './server'

const PORT = Number(process.env.PORT) || 3001

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
