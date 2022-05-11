import { Router } from 'express'
import path from 'path'

export default (router: Router): void => {
  router.get('/create-session', async (req, res) => {
    const filePath = path.resolve(__dirname, '../../../../', 'public', 'create-session', 'index.html')

    res.type('.html').sendFile(filePath)
  })
}
