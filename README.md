# smileguess-server
The server for the smileguess app

When a user clicks 'join random game,' he or she will be put into an active game, if one is available. If one is not available, a new game will be instantiated for him or her.

When players join the game, they are pushed into the game's 'players' array. A game will start when enough players are available to have a fun time. This variable resides in `config/gameSettings.js` with a default value of 3.

After enough players have joined to satisfy game genesis, a dealer will be chosen at random.

A category will be randomly chosen, then a solution will randomly be chosen within that category.

As the dealer enters or removes emojis as clues, they will be pushed and popped to and from the 'this.clue' array.

