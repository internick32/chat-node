var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var momgoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = 'mongodb://nodeadmin:Mibruno10@ds345597.mlab.com:45597/mongo-node'

var Message = momgoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res)=> {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res)=> {
    var message = new Message(req.body)
    message.save((err) => {
        if(err)
            sendStatus(500)
            io.emit('message', req.body)
            res.sendStatus(200)
    })  
})
io.on('connection', (socket) => {
    console.log('user connected...')
})

momgoose.connect(dbUrl, (err) => {
    console.log('connection succesfully...')
})

var server = http.listen(3010, ()=>{
    console.log("Im listening on port", server.address().port)
})

