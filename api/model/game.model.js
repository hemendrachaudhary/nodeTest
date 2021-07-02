var Sequelize = require('sequelize');
var sequelize = require('../../config/database');

const checkGame = async (where) => {
    var user_game = Promise.resolve(await sequelize.query(`SELECT count(id) as game_count
    FROM game 
    WHERE ${where} `, { type: Sequelize.QueryTypes.SELECT }));
    if (user_game._rejectionHandler0[0].game_count > 0)
        return user_game._rejectionHandler0[0].game_count;
    else
        return 0;
};

async function createGame(query) {
    var user_game = Promise.resolve(await sequelize.query(`INSERT INTO game SET ${query}`, { type: Sequelize.QueryTypes.INSERT }));
    if (user_game._rejectionHandler0.length === 0)
        return user_game._rejectionHandler0;
    else {
        return user_game._rejectionHandler0[0];
    }
}

async function updateGame(query, where) {
    var user_game = Promise.resolve(await sequelize.query(`UPDATE game SET ${query} WHERE ${where} `, { type: Sequelize.QueryTypes.INSERT }));
    if (user_game._rejectionHandler0.length === 0)
        return user_game._rejectionHandler0;
    else {
        return user_game._rejectionHandler0[0];
    }
}



async function getGame(where,order_by_score,limit,offset) {
    var total_game = Promise.resolve(await sequelize.query(`SELECT count(id) as total_game FROM game WHERE ${where}  `, { type: Sequelize.QueryTypes.SELECT }));
    var game = Promise.resolve(await sequelize.query(`SELECT * FROM game  WHERE ${where} ${order_by_score} LIMIT ${limit} OFFSET ${offset} `, { type: Sequelize.QueryTypes.SELECT }));
    var data = { total: 0, game: [] }
    if (total_game._rejectionHandler0.length != 0) {
        data.total = total_game._rejectionHandler0[0].total_game;
    }
    if (game._rejectionHandler0.length != 0) {
        data.game = game._rejectionHandler0;
    }
    return data;
 }



async function deletegame(where) {
    var user_game = Promise.resolve(await sequelize.query(`DELETE FROM game WHERE ${where} `, { type: Sequelize.QueryTypes.DELETE }));
    return 1;
}



module.exports = {
    checkGame  : checkGame,
    createGame : createGame,
    updateGame : updateGame,
    deletegame : deletegame,
    getGame    : getGame,
   
}