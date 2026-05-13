import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/server'

describe('GET /greeting', () => {
  it('test_returns_200_status_when_get_greeting_called', async () => {
    const res = await request(app).get('/greeting')
    expect(res.status).toBe(200)
  })

  it('test_returns_json_with_message_field_when_get_greeting_called', async () => {
    const res = await request(app).get('/greeting')
    expect(res.body).toHaveProperty('message')
  })

  it('test_message_is_non_empty_string_when_greeting_returned', async () => {
    const res = await request(app).get('/greeting')
    expect(typeof res.body.message).toBe('string')
    expect(res.body.message.length).toBeGreaterThan(0)
  })

  it('test_returns_json_content_type_when_get_greeting_called', async () => {
    const res = await request(app).get('/greeting')
    expect(res.headers['content-type']).toMatch(/application\/json/)
  })

  it('test_returns_404_when_unknown_route_requested', async () => {
    const res = await request(app).get('/unknown-route')
    expect(res.status).toBe(404)
  })
})
