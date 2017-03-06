const router = require('express')
  .Router()
const generator = require('./generator')

const title = process.env.SM_TITLE || 'Smart Mario'

router.get('/', (req, res) => {
  res.render('index', {
    title: title,
    running: false
  })
})

router.get('/game', (req, res) => {
  res.render('index', {
    title: title,
    board: generator.generateBoard(req.query.size, req.query.mush),
    running: true
  })
})

module.exports = router