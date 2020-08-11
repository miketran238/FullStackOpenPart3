const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
    console.log('Please provide the db password as well as the name and number of person to add')
    process.exit(1)
} else if ( process.argv.length > 5 ) {
    console.log('Too many arguments')
    process.exit(1)
}

const password = process.argv[2]


const url =
  `mongodb+srv://miketran238:${password}@cluster0.wtgnl.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length > 3 ) {
    const newName = process.argv[3]
    const newNumber = process.argv[4]
    const person = new Person({
        name: newName,
        number: newNumber
    })
    person.save().then(result => {
    console.log('Person saved!')
    mongoose.connection.close()
    })
}

else {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}
