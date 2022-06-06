const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const helpers = require("./helpers.js");
const gameLogic = require("./client/src/logic/game.js");
app.use(cors());
app.use(express.static("client/build"));

const server = http.createServer(app);
var _ = require("lodash");

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    },
});

const socketToRoom = {};
const socketToName = {};
const gameStates = {};
const roomToOwner = {};

io.on("connection", (socket) => {
    let name = helpers.generateName();
    socketToName[socket.id] = name;
    console.log(`Connected: ${name} (${socket.id})`);

    socket.on("disconnect", handleDisconnect);
    socket.on("leaveGame", handleDisconnect); //clicking leave game does the same as closing the tab
    socket.on("joinGame", handleJoinGame);
    socket.on("createGame", handleCreateGame);
    socket.on("makeMove", handleMakeMove);

    function handleJoinGame(roomName) {
        console.log(`${socketToName[socket.id]} is trying to join ${roomName}`);
        const room = io.sockets.adapter.rooms.get(roomName);

        let numClients = 0;
        if (room) {
            numClients = room.size;
        }

        if (numClients === 0) {
            console.log("Incorrect code");
            socket.emit("badCode", "Incorrect code 😔");
            return;
        }
        // // No max players for SET
        // } else if (numClients > 1) {
        //     console.log("The game is full");
        //     socket.emit("badCode", "Room is full");
        //     return;
        // }

        socketToRoom[socket.id] = roomName;

        socket.join(roomName);
        socket.emit("gameJoined", {
            code: roomName,
            id: socket.id,
            name: socketToName[socket.id],
            // room is a set, so we must convert it to an array to use map
            players: [...room].map((s) => ({
                id: s,
                name: socketToName[s],
            })),
            gameOwner: roomToOwner[roomName],
        });

        socket.broadcast.to(roomName).emit("playersUpdate", {
            players: [...room].map((s) => ({
                id: s,
                name: socketToName[s],
            })),
            gameOwner: roomToOwner[roomName],
        });
    }

    function handleCreateGame() {
        let roomName = makeid(5);
        socketToRoom[socket.id] = roomName;
        roomToOwner[roomName] = socket.id;
        socket.join(roomName);
        socket.emit("gameJoined", {
            code: roomName,
            id: socket.id,
            name: socketToName[socket.id],
            players: [...io.sockets.adapter.rooms.get(roomName)].map((s) => ({
                id: s,
                name: socketToName[s],
            })),
            gameOwner: roomToOwner[roomName],
        });

        gameStates[roomName] = createGameState();

        console.log(`${socketToName[socket.id]} created ${roomName}`);
    }

    function handleDisconnect() {
        console.log(`${socketToName[socket.id]} disconnected`);
        const roomName = socketToRoom[socket.id];
        delete socketToRoom[socket.id];

        if (!socket.connected) {
            delete socketToName[socket.id];
        }

        socket.leave(roomName);

        if (roomName) {
            if (roomToOwner[roomName] === socket.id) {
                delete roomToOwner[roomName];
            }

            const room = io.sockets.adapter.rooms.get(roomName);
            if (room) {
                const [first] = room;
                if (first) {
                    roomToOwner[roomName] = first;
                    console.log(
                        "new owner of room: " + roomName,
                        socketToName[roomToOwner[roomName]]
                    );
                }
                room.forEach((socketId) => {
                    io.sockets.sockets.get(socketId).emit("playersUpdate", {
                        players: [...room].map((s) => ({
                            id: s,
                            name: socketToName[s],
                        })),
                        gameOwner: roomToOwner[roomName],
                    });
                });
            }
        }

        //delete gameStates[roomName];
    }

    function handleMakeMove(data) {
        const roomName = socketToRoom[socket.id];
        const gameState = gameStates[roomName];
        if (gameState.isWhitesTurn !== socket.isPlayer1) {
            socket.emit("moveError", "...it's not your turn");
            return;
        }
        if (gameState.possibleMovesBoard[data.x][data.y] === "") {
            socket.emit("moveError", "...invalid move");
            return;
        }
        if (placePiece(data.x, data.y, gameState)) {
            if (needToSwitchTurns(gameState)) {
                gameState.isWhitesTurn = !gameState.isWhitesTurn;
                gameState.possibleMovesBoard =
                    getNewPossibleMovesBoard(gameState);
                if (needToSwitchTurns(gameState)) {
                    io.in(roomName).emit("gameEnded", gameState);
                    return;
                }
            }
            io.to(roomName).emit("gameStateUpdate", gameState);
        }
    }
});

server.listen(process.env.PORT || 3001, () => {
    console.log("Server is running on port 3001");
});

function makeid(length) {
    var res = "";
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charsL = chars.length;
    for (var i = 0; i < length; i++) {
        res += chars.charAt(Math.floor(Math.random() * charsL));
    }
    return res;
}

function createGameState() {
    return {
        board: [
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "w", "b", "", "", ""],
            ["", "", "", "b", "w", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
        ],
        possibleMovesBoard: [
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "w", "", "", ""],
            ["", "", "", "", "", "w", "", ""],
            ["", "", "w", "", "", "", "", ""],
            ["", "", "", "w", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
        ],
        isWhitesTurn: true,
    };
}
