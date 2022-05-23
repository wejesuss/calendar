import { Router } from 'express'
import { makeCreateSessionController } from '../../factories/make-create-session-controller'
import { adaptRoute } from '../../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/create-session', adaptRoute(makeCreateSessionController()))
}
