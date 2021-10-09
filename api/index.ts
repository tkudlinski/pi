import express from 'express'
import random from 'random'
import cors from 'cors'

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('OK!')
})

app.get('/points', (req, res) => {
  const count = req.query?.count ? parseInt(req.query?.count as string) : 1
  res.json({
    points: Array.from({ length: count }, () => [
      random.float(),
      random.float(),
    ]),
  })
})

app.listen(3001, () => {
  console.log('The application is listening on port 3001!')
})
