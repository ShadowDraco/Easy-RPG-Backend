const express = require('express')
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const PlayerRoute = require('./route-handlers/player-routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

let port = process.env.PORT
if (port == null || port == '') {
	port = 8000
}

const verifyUser = require('./auth/authorize.js')

// socket io stuff //////////////////////////////

const server = require('http').Server(app)
const io = require('socket.io')(server, {
	cors: {
		origin: [
			'http://127.0.0.1:5173',
			'http://localhost:5173',
			'https://easy-rpg.herokuapp.com',
			'https://easy-rpg.netlify.app/',
			'https://20a2-2603-8001-4700-20d4-854f-571c-a7ce-79a6.ngrok.io',
		],
	},
})

// when a socket connects to the server
io.on('connection', socket => {
	console.log('client connected: ', socket.id)

	socket.on('join-room', partyName => {
		try {
			socket.join(partyName)
			console.log('success!')
		} catch (error) {
			console.log('error joining room', partyName)
		}

		socket.on('receive-message', (from, message) => {
			console.log('receiving message', from, message)
		})
	})

	socket.on('send-message', (partyName, playerName, message) => {
		console.log(partyName, playerName, message)
		console.log('sending message to party', partyName)
		io.to(partyName).emit('receive-message', playerName, message)
	})

	socket.on('disconnect', reason => {
		console.log(reason)
	})
})

// all routes after will have the requesting socket
app.use((request, response, next) => {
	request.io = io
	return next()
})

// socket io stuff //////////////////////////////

mongoose
	.connect(process.env.DATABASE_URL)
	.then(console.log('Database connected'))

// This will run the "verify" code on every route automatically
// If the user is valid, we'll have them in request.user in every route!
// If not, it'll throw an error for us
// all routes after will have the verified user

app.get('/', (request, response) => {
	response.status(200).send("You've enter the dungeon")
	console.log('Dungeon running')
})

app.use(verifyUser)

app.use('/player', PlayerRoute)

app.use('*', (request, response) => {
	response.status(404).send('You entered the wrong corridor!')
})

app.use((error, request, response, next) => {
	response.status(500).send(`We miss placed the dungeon... ${error}`)
})

// fix me?
server.listen(port, console.log(`Begin dungeon crawling on port: ${port}`))
