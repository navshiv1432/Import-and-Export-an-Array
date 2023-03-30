const express = require("express");
const { open } = require("sqlite");
const app = express();
app.use(express.json());
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
const sqlite3 = require("sqlite3");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayersQuerey = `
        SELECT *
        FROM cricket_team
    
    `;
  const playersArray = await db.all(getPlayersQuerey);
  response.send(playersArray);
});

//Add player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO
      cricket_team (playerName,jerseyNumber,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
         ${role}
      );`;

  const dbResponse = await db.run(addplayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//get player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send("Returns a player based on a player ID");
});

//update player
app.put("/books/:bookId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playeDetails;
  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
      player_id='${player_id}',
      player_name=${player_name},
      jersey_number=${jersey_number},
      role=${role}
    WHERE
      player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//Delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
