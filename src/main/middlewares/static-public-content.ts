import express from 'express'
import path from 'path'

const folderPath = path.resolve(__dirname, '../../../', 'public')

export const staticPublic = express.static(folderPath,
  {
    setHeaders:
    (res, reqFilePath) => res.type(path.extname(reqFilePath))
  }
)
