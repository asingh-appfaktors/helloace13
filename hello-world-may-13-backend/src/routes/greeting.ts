import { Router, Request, Response } from 'express'
import { GreetingResponse } from '../types/greeting'

const router = Router()

router.get('/greeting', (_req: Request, res: Response) => {
  const body: GreetingResponse = { message: 'Hello, World!' }
  res.json(body)
})

export default router
