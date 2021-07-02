var userModel = require('../model/users.model');
var fs = require('fs');
var request = require('request');
var encryption = require("../../utils/encryption");
const response = require("../../utils/response");
const messages = require("../../utils/messages")["user"];
const common = require("../../utils/common");
require('dotenv').config();
const jwt = require('jsonwebtoken');


async function signUp(data, res) {
    try {
      const requiredFields = ["password", "email","name","phoneNumber"];
      if (!common.checkKeys(data.body, requiredFields)) {
        return response.sendBadRequest(res);
      }
      
      const { name, phoneNumber, email} = data.body;
      var password = data.body.password
      var where = `email='${email}'`;
    var exists_user = await userModel.checkUser(where);
    if (exists_user > 0) {
        return response.sendError(res, messages.user_exist);
    }
    
    if (exists_user == 0) {
        password =  encryption.hashPasswordUsingBcrypt(password);
      let verificationKey = password;
      var token = jwt.sign({ verificationKey: verificationKey}, process.env.TOKEN_SECRET, {
      expiresIn: 86400 // expires in 24 hours
       });
      
      var insert = `name='${name}',phoneNumber='${phoneNumber}',email='${email}',password='${password}',verificationKey='${verificationKey}'`;
        user = await userModel.createUser(insert);
        return response.sendSuccess(res, messages.user_added);
      }
    } catch (error) {
      return response.sendSystemError(res, error);
    }
  }

async function login(data, res) {
    try {
      const requiredFields = ["email", "password"];
      if (!common.checkKeys(data.body, requiredFields)) {
        return response.sendBadRequest(res);
      }

      let user;
      var  { email, password } = data.body;
      var where = `email='${email}'`;
      var userData = await userModel.getUser(where);
      console.log(userData);
    if (userData.length < 1) { 
        return response.sendError(res, messages.not_found);
    }
    else{
        if (
          await encryption.comparePasswordUsingBcrypt(password, userData[0].password)
        ) {
            var token = jwt.sign({ verificationKey: userData.verificationKey}, process.env.TOKEN_SECRET, {
                expiresIn: 86400 // expires in 24 hours
                 });
            return response.sendSuccess(res, messages.login_success, {
            token: token,
            user: userData[0].email,
            user_id: userData[0].id,
          });
        } else {
          return response.sendError(res, messages.login_failed);
        }
      }
      
    } catch (err) {
      return response.sendSystemError(res, err);
    }
  }




module.exports = {
    login: login,
    signUp:signUp
}
