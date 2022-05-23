import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode >= 400) {
      const error = {
        name: httpResponse.body.name,
        message: httpResponse.body.message
      }

      return res.status(httpResponse.statusCode).json(error)
    }

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
