require('dotenv').config()
const express = require('express')
const Note = require('./models/note')

const app = express()

app.use(express.static('build'))
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    /* 目前不知道中间件如何输出response值，下述都是undefined,
       目前看中间件是在下文app.post等运行前执行，
       也即中间件函数在路由事件处理程序被调用前执行
    console.log('Response:', response.PORT)
    console.log('Response:', response.body)
    */
    next()
}
app.use(requestLogger)

/*
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }
]
*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {

    Note.findById(request.params.id).then(note=>{
        response.json(note)
    })
    /*
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    console.log(note, typeof (note))
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
    */
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(note => note.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        //id: generateId(),
        date: new Date(),
        content: body.content,
        important: body.important || false
    })

    console.log('save before')
    note.save().then(savedNote => {
        response.json(savedNote)
    })
    console.log('save after')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
