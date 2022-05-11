import { Router } from 'express'

export default (router: Router): void => {
  router.get('/create-session', async (req, res) => {
    return res.send({ ok: 'ok' })
  })
}
