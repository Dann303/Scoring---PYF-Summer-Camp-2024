const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())

app.post('/points', (req, res) => {
    const teamNumberChanged = req.body.team
    const newPoints = req.body.points

    io.emit('updateBoard', { teamNumberChanged, newPoints })        
    
    res.status(200).send()
})    

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})



