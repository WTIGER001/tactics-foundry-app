# TODO

Legend
[+]     - Nice to have, cool idea or minor feature that if not implmemented no one should know
[++]    - Feature that is obviously missing but not essensial to operation
[+++]   - Important feature for the game to work correctly  
[++++]  - Critical feature, without this not worth showing (next on my list)

## Overall

- [+] Change layout on large monitors to a maximum width and display a cool background
- [+] Get restrictions working correctly
- [++] Progressive Web App

## Login Experirence

- [+] Make the edit button on the player id allow someone to replace the current player. This will have to remove the incorrect databases and sync. 
- [++] Make the 'Join Active Session' button work

## Live Session

### Map
- [+++] Add Circle (Mostly done)
- [+++] Add Rectangle
- [+++] Add Polygon
- [+++] Add Polyline
- [+++] Add character
- [+++] Add token (This is from a library.. not sure if we are going to stll do that)
- [++] Add monster
- [+++] Add marker
- [+++] Add flag
- [++] Add image
- [+++] Upload (mostly Done)
- [++] Add Text
- [+++] Fog Of War
- [+++] Pinch zoom fix
- [+++] Zoom Fit
- [+++] Auto pan / zoom + Recenter (on gm action)
- [++] Scale Bar 
- [+++] Encounter display
- [+++] Encounter GM Control
- [+++] Long press flag
- [+] Flag Ripple effect (tried this. Should be pretty easy)
- [+] Audio effects
- [+++] Annotation Drag (mostly working, has bugs)
- [+++] Annotation Select (mostly working, has bugs)
- [++] Restrict Dialog
- [+++] Favorite Dialog
- [+++] GM / Debug Layer Control, show all plugins per layer (layers are just containers)

### Chat
- [+] Images in chat
- [+++] Flag Chat Message
- [++] Targets in Rolls
- [+++] Roll Favorites
- [+++] Roll Screen (for mobile)
- [+++] Message formatting
- [+++] Favorite a roll
- [++] GM Roll / private (e.g not sent) 
- [+] Challenge Response (roll request)
- [+] Challenge Response (poll)
- [+] Commands: 
-- toggle fog --> /fog
-- Clear fog --> /fog clear
-- set layer --> /layer player | gm | background
 
## Game Data Management

### Character
- [+++] Character UI
- [+++] Upload a character from HeroLab
- [+++] Upload a character from PCGen
- [+++] Edit Character
- [++] Crop Token Image

### Tokens
In general tokens are needed but the abilty to have the token libary prepopulated is not high. As long as there is an easy way to add a token during planning or game
- [++] Token Screen
- [++] Upload Tokens
- [++] Create Token Sets
- [+++] Upload single image as token
- [++] Convert from a token to an image anv vice-a-versa
- [+++] Arrow keys move the highlighted token

### Monsters 
Monsters are not required right away. They can be replicated with tokens. Most of this can be lived without
- [++] Monster UI
- [++] Monster Database
- [++] Add monster UI

### Favorites
- [++] Add a favorite
- [++] Favorites UI
- [++] Store favorites

### Games
- [++] Filtering
- [+++] Join / Invite logic
- [++] Invite QR Code
- [++] Player selection bug fix

## Settings
- [+++] Settings framework
