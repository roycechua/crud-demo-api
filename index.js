const express = require("express")
const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded())

let data = [
    { id: 1, title: "React Native Seminar Today", story: "Today's the workshop", author: "Royce Chua" },
]

let successMessage = (message, data) => ({
    message,
    data
}) 

let errorMessage = (message) => ({
    message
})

// Fetch all
app.get('/', (req, res) => res.send(data))

// Search for a specific post
app.get('/search', (req, res) => {
    let result = data.filter(d => d.id == req.query.id);
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(404).json(errorMessage("Record not found"));
})

// Add a post object to the list
app.post('/posts', (req, res) => {
    if(req.body.data && req.body.data.id && req.body.data.story) {
        data.push(req.body.data)
        return res.status(200).json(successMessage("Add post successful", req.body.data))
    } 
    
    return res.status(422).send(errorMessage('Unprocessable Entity'))
})

// delete a post object to the list
app.delete('/posts/:id', (req, res) => {
    if(req.params.id) {
        let new_data = data.filter(d => d.id != req.params.id)
        if(new_data.length != data.length) {
            data = new_data;
            return res.status(200).send(successMessage('Delete post success'))
        } 

        return res.status(404).send(errorMessage('Post record was not found'))
    } 
    
    return res.status(422).send(errorMessage('Unprocessable Entity'))
})

app.put('/posts/:id', (req, res) => {
  if(req.params.id && req.body.data) {
    data = [...data.filter(d => d.id != req.params.id), req.body.data ];
    // console.log(data)
    return res.status(200).send(successMessage('Update post success', req.body.data))
  }  

  return res.status(422).send(errorMessage('Unprocessable Entity'))
})

app.listen(3000, () => console.log('Server ready'))