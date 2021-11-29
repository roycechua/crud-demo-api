const express = require("express")
const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded())

let id = 0

let data = []

let successMessage = (message, data) => ({
    message,
    data
}) 

let errorMessage = (message) => ({
    message
})

// Fetch all
app.get('/', (req, res) => res.send(data))

// Search for a specific note
app.get('/search', (req, res) => {
    let result = data.filter(d => d.id == req.query.id);
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(404).json(errorMessage("Record not found"));
})

// Add a note object to the list
app.post('/notes', (req, res) => {
    if(req.body.data && req.body.data.note) {
        const newNote = {id: ++id, note: req.body.data.note};
        data.push(newNote)
        return res.status(200).json(successMessage("Add note successful", newNote))
    } 
    
    return res.status(422).send(errorMessage('Unprocessable Entity'))
})

// delete a note object to the list
app.delete('/notes/:id', (req, res) => {
    if(req.params.id) {
        let new_data = data.filter(d => d.id != req.params.id)
        if(new_data.length != data.length) {
            data = new_data;
            return res.status(200).send(successMessage('Delete note success'))
        } 

        return res.status(404).send(errorMessage('Note record was not found'))
    } 
    
    return res.status(422).send(errorMessage('Unprocessable Entity'))
})

app.put('/notes/:id', (req, res) => {
  if(req.params.id && req.body.data) {
    data = [...data.filter(d => d.id != req.params.id), req.body.data ];
    // console.log(data)
    return res.status(200).send(successMessage('Update note success', req.body.data))
  }  

  return res.status(422).send(errorMessage('Unprocessable Entity'))
})

app.listen(3000, () => console.log('Server ready'))