# Model

Player - tracks the player id and display name
PlayerPrefs - Tracks the preferences for a player (this can update often)


## Game 
Game Object

Fields: 
_id
type='game', 
players - array of playerids

## MAP
_id
type='map'
owner (game or session)

## Annotations
_id
type
subtype


## Startup Steps
- Determine the current player id
-- Query the playerdb for that player's information. That will include a list of games that the player is part of
- Connect to each game that a player belongs to

Databases

### Player Database
Not replicated. Users query it.

### Game Registry Database


## Working Offline
- Data needs to be replicated. Simplest is to just have a single database but then I dont want to replicate the world. Maybe we have a database per Game and when the user joins a game then the game information is replicated. How do I deal with characters then? What is the top level database that gets replicated? 

What Makes sense to work on offline?
- My Characters
- Create a game and then fill it with maps
- Move a character

What doesnt make sense to work offline?
- Joining a game

Most crazy... 
- Database per player for characters
- Database per game (including sessions)
- Database per gamesystem (like pathfinder)

- No global user database
- Each game points to players. Each player points to games they are part of. THis way a player can get the list of games to sync and from the list of games they can get the list of players to include. GMS can have characters. Characters can be in a players db, game or session. 
- Each game will list the gamesystem and download that database. Wh
