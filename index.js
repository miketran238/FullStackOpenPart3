const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('resBody', (req, res) => {
    return JSON.stringify(res.send)
});

app.use(morgan(':method :url :status - :response-time ms :resBody'))
let persons = [
    {
      id: 1,
      name: "Artorias",
      number: "201-9053017"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-55323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
  ]

app.get('/', (req, res) => {
    res.send('<h1>This is a Phone Book application!</h1>')
})

app.get('/info', (req, res) => {
    const timeNow = new Date()
    res.send(`Phonebook has ${persons.length} people <br />
    ${timeNow}`)   
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
    //const morganLog = 
        
    //console.log(morganLog)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if ( person) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }

})

const generateId = () => {
    return Math.floor(Math.random() * 10000000)
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    const existPerson = persons.find(person => person.name === body.name)
    if ( existPerson ){
        response.status(400).json({
            error: `${body.name} is already in the phonebook`
        })
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateId(),
          }
        
          persons = persons.concat(person)
        
          response.json(person)
    }
  })

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
console.log(process.env.PORT)
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})