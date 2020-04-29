import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
const router = express.Router()
const app = express()
app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Welcome to My Sample Server')
})
//! Database connection
const MONGO_URI = 'mongodb://localhost/expensetracker'
mongoose.set('useFindAndModify', true)
mongoose.connect(MONGO_URI || process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(db => console.log('Connected to  Mongo Database '))
app.listen(5000, () => {
  console.log(`Server started at ${5000}`)
})
