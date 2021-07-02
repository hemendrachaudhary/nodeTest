var Sequelize = require('sequelize');
var sequelize = require('../../config/database');

const checkUser = async (where) => {
  var user = Promise.resolve(await sequelize.query(`SELECT count(id) as user_count
  FROM users 
  WHERE ${where} `, { type: Sequelize.QueryTypes.SELECT }));
  if (user._rejectionHandler0[0].user_count > 0)
    return user._rejectionHandler0[0].user_count;
  else
    return 0;
};

const getUser = async (where)=> {
  var user = Promise.resolve(await sequelize.query(`SELECT users.id,
  COALESCE(name,'') as name,
  COALESCE(phoneNumber,'') as phoneNumber,
  COALESCE(password,'') as password,
  COALESCE(email,'') as email  FROM users
  WHERE ${where} `, { type: Sequelize.QueryTypes.SELECT }));
  return user;
};

async function createUser(query) {
  var users = Promise.resolve(await sequelize.query(`INSERT INTO users SET ${query}`, { type: Sequelize.QueryTypes.INSERT }));
  if (users._rejectionHandler0.length === 0)
    return users._rejectionHandler0;
  else {
    return users._rejectionHandler0[0];
  }
}




module.exports = {
  checkUser: checkUser,
  getUser: getUser,
  createUser: createUser
}