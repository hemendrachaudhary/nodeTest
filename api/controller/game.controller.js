var gameModel = require('../model/game.model');
const jwt = require('jsonwebtoken');
const response = require("../../utils/response");
const messages = require("../../utils/messages")["game"];
const pagination = require("../../config")["pagination"];
const common = require("../../utils/common");
require('dotenv').config();


async function create(data, res) {
    try {
        const requiredFields = ["title", "platform","score","genre","editors_choice"];
        if (!common.checkKeys(data.body, requiredFields)) {
          return response.sendBadRequest(res);
        }
      var token = data.headers['x-access-token'];
      const { title, platform, score,genre,editors_choice} = data.body;
      jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      })
      var where = `title='${title}'`;
      var exists_game = await gameModel.checkGame(where);
    if (exists_game > 0) {
        return response.sendError(res, messages.game_exist);  
    } else{
       
         var insert = `title='${title}',platform='${platform}',score='${score}',editors_choice='${editors_choice}'`;
        gameData =  gameModel.createGame(insert);
         return response.sendSuccess(res, messages.created);
        }
    
  } catch (error) {
      return response.sendSystemError(res, error);
    }
  }

  async function editGame(data, res) {
    try {
      
        var gameId = data.params.id;
        const requiredFields = ["title", "platform","score","genre","editors_choice"];
        if (!common.checkKeys(data.body, requiredFields)) {
          return response.sendBadRequest(res);
        }
      var token = data.headers['x-access-token'];
      const { title, platform, score,genre,editors_choice} = data.body;
      jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      })
      var where = `id='${gameId}'`;
      var exists_game = await gameModel.checkGame(where);
    if (exists_game > 0) {
        var update = `title='${title}',platform='${platform}',score='${score}',editors_choice='${editors_choice}'`;
        gameData =  gameModel.updateGame(update,where);
         return response.sendSuccess(res, messages.edited);
       
    } else{
        return response.sendError(res, messages.game_not); 
         }
    
  } catch (error) {
      return response.sendSystemError(res, error);
    }
  }

  async function deleteGame(data, res) {
    try {
      var token = req.headers['x-access-token'];   
      jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }) 
        var gameId = data.params.id;
        var token = data.headers['x-access-token'];
     
      
      var where = `id='${gameId}'`;
      var exists_game = await gameModel.checkGame(where);
    if (exists_game > 0) {
        gameData =  await gameModel.deletegame(where);
        return response.sendSuccess(res, messages.removed);
       } else{
        return response.sendError(res, messages.game_not); 
         }
       } catch (error) {
      return response.sendSystemError(res, error);
    }
  }

async function getGame(req, res) {
  try {
    var token = req.headers['x-access-token'];
    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      }) 
    var title = req.query.title != undefined && req.query.title != null ? req.query.title : null;
    var order_by = req.query.order_by != undefined && req.query.order_by != null ? req.query.order_by : null;
    var platform = req.query.platform != undefined && req.query.platform != null ? req.query.platform : null;
    var editors_choice = req.query.editors_choice != undefined && req.query.editors_choice != null ? req.query.editors_choice : null;
    var genre = req.query.genre != undefined && req.query.genre != null ? req.query.genre : null;
    var page_number = req.query.page_number != undefined && req.query.page_number != null ? req.query.page_number : null;

    var limit = req.query.limit
    var offset;
    if (page_number == null || page_number == 1) {
        offset = 0;
    }
     else {
        offset = limit * (req.query.page_number - 1);
    }
       
   
    if (limit == undefined || limit == null || limit == "") {
        res.json({ 'status': 'failed', 'message': 'limit  is required' });
        return response.sendError(res, messages.lmt); 
     }
    var where = ``;
    if(title != "" && platform == null &&  editors_choice == null &&  genre == null) {
     where += `title='${title}'`;
    }
    else if(title != null && platform != null &&  editors_choice == null && genre == null) {
      
      where += `title='${title}' AND platform = '${platform}'`;
    }
    else if(title != null && platform == null &&  editors_choice != null && genre == null) {
      
      where += `title='${title}' AND editors_choice = '${plateditors_choiceform}'`;
    }
    else if(title != null && platform == null &&  editors_choice == null && genre != null) {
      
      where += `title='${title}' AND genre = '${genre}'`;
    }
    else if(title != null && platform != null &&  editors_choice != null && genre == null) {
      where += `title='${title}' AND platform = '${platform}' AND editors_choice = '${editors_choice}' AND genre = '${genre}' `;
    }
    
    else if(title != null && platform != null &&  editors_choice != null && genre != null) {
      where += `title='${title}' AND platform = '${platform}' AND editors_choice = '${editors_choice}' AND genre = '${genre}'`;
    }

    else if(title == null && platform != null &&  editors_choice == null && genre == null) {
     
      where += `platform = '${platform}'`;
    }
    else if(title == null && platform != null &&  editors_choice != null && genre == null) {
      
      where += `platform = '${platform}' AND editors_choice = '${editors_choice}'`;
    }
    else if(title == null && platform != null &&  editors_choice == null && genre != null) {
      
      where += `platform = '${platform}' AND genre = '${genre}'`;

    }
    else if(title == null && platform == null &&  editors_choice != null && genre == null) {
      
      where += `editors_choice = '${editors_choice}'`;
    }
    else if(title == null && platform == null &&  editors_choice != null && genre != null) {
      
      where += `editors_choice = '${editors_choice}' AND genre = '${genre}'`;
    }
    else if(title == null && platform == null &&  editors_choice == null && genre != null) {
      
      where += `genre = '${genre}'`;
    } else {
       where += ` 1`;
    }
    var order_by_score = '';
    if(order_by !=null) {
      order_by_score = `ORDER BY score ${order_by}`;
    }else{
      order_by_score = `ORDER BY score 'ASC'`;
    }
    var gameData = await gameModel.getGame(where,order_by_score,limit,offset);
    console.log(gameData);
    gameList = gameData.game
    total = gameData.total
    if (gameList.length > 0) {
      return response.sendSuccess(res, messages.retrive,{gameList},{total_count:total});
        
    } else {
      return response.sendError(res, messages.game_not);
      
    }
  } catch (error) {
    return response.sendSystemError(res, error);
  }
}

module.exports = {
    create: create,
    getGame: getGame,
    deleteGame : deleteGame,
    editGame : editGame,   
}