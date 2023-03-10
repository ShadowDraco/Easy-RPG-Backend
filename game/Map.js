const Room = require('./Room')
const randomFromTo = require('./lib/helperFunctions/RandomFromTo')

const roomTypes = ['enemy', 'treasure', 'empty']

class Map {
	constructor() {
		this.rooms = []
		this.rooms[0] = new Room('starter', 0)

		this.choosingNextRoom = true
		this.inFight = false

		this.generateMap(randomFromTo(5, 10))
	}

	generateMap(size) {
		for (let index = 1; index < size; index++) {
			let weightedRandom = randomFromTo(0, 300)
			if (weightedRandom < 200) {
				this.rooms.push(new Room(roomTypes[0], index))
			} else if (weightedRandom > 200 && weightedRandom < 275) {
				this.rooms.push(new Room(roomTypes[1], index))
			} else {
				this.rooms.push(new Room(roomTypes[2], index))
			}
		}
	}

	getPresentableRooms() {
		let roomsToPresent = this.rooms.filter(
			room => !room.cleared && room.type !== 'starter'
		)

		this.presentableRooms = roomsToPresent.slice(0, 2)
	}
}

module.exports = Map

/* 
/// client

user loads game 

server sends the user their current position 

user starts in starting room

- user requests to database async what rooms they can go into

- user selects a room to go into

- user does something in that room that turns room.cleared
-  to true updates the database map.rooms[playerPosition] = updatedRoom

user gets new rooms to select until all rooms are cleared

selectRoom = () => {
	
}

attackEnemy = () => {

	if (allPlayersAttacked) {

		await put('server/attackEnemy', {updatedEnemies, newPlayerHealth, roomCleared? }) {

		}

	}
}

/// server 


playerPosition

getPresentableRooms => {
 map { rooms { 0 1 (2) 3 (4) 5 }}
\   |   /
 |  |  |

	 roomsToPresent = getPresentableRooms = () => {
		this.rooms.filter(room => !room.cleared}

	})
	return roomsToPresent
 }
}

router.get('/attack-enemy') => {
	await PlayerModel.findOneAndUpdate(request.user, {
			health = newPlayerHealth
			map.rooms[playerPosition].enemies = newEnemies
		}, {new: true})

		res.send(updatedPlayer.map.rooms[playerPosition])
}


*/
