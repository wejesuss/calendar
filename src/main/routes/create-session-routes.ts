import { Router } from 'express'

export default (router: Router): void => {
  router.post('/create-session', (req, res) => {
    res.json({ ok: 'ok' })
  })
}
