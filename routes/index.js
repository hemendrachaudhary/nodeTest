var express = require('express');
const router = express.Router();
var user = require('../api/controller/users.controller');
var game = require('../api/controller/game.controller');



router.route("/v1/login/").post(user.login);    
router.route("/v1/user/").post(user.signUp);



  router.route("/v1/createGame/").post(game.create);
  router.route("/v1/getGame/").get(game.getGame);
  router.route("/v1/editGame/:id").put(game.editGame);
  router.route("/v1/deleteGame/:id").delete(game.deleteGame);
  
  module.exports = router

