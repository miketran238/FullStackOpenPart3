require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(logger)
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('resBody', (req, res) => {
  return JSON.stringify(res.send)
});
app.use(morgan(':method :url :status - :response-time ms :resBody'))



app.get('/', (req, res) => {
  res.send('<h1>This is a Phone Book application!</h1>')
})

app.get('/info', (req, res) => {
  const timeNow = new Date()
  res.send(`Phonebook has ${persons.length} people <br />
    ${timeNow}`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, get) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 10000000)
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
  .then(savedNote => savedNote.toJSON())
  .then(savedAndFormattedNote => {
    response.json(savedAndFormattedNote)
  }) 
  .catch(error => next(error)) 

})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
console.log(process.env.PORT)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})