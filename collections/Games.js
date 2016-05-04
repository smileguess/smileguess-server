// may want to store games in a hash table later, with references
// to games stored in the full/open games arrays
module.exports = {
  fullGames: [],
  openGames: [],
  sort: (gameCollection) => {
    gameCollection.sort((game1, game2) => (
      game1.seatsOpen > game2.seatsOpen
    ));
  },
};
