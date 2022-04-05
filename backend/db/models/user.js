'use strict';
const { Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)){
            throw new Error('Cannot be an email address.');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256]
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60,60]
      }
    }
  }, 
  {
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword','email','createdAt','updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword'] }
      },
      loginUser: {
        attributes: {}
      }
    },
    underscored: true
  });

  User.prototype.toSafeObject = function() {
    const { id, username, email } = this;
    return { id, username, email };
  };

  User.prototype.validatePassword = function( password ){
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  }

  User.getCurrentUserById = async function( id ){
    return await User.scope('currentUser').findByPk(id);
  };

  User.login = async function( { credential, password } ){
    const { Op } = require('sequelize');
    const user = await User.scope('loginUser').findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });
    if( user && user.validatePassword(password) ){
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  User.signup = async function( { username, email, password } ){
    const hashedPassword = await bcrypt.hash(password, 12); 
    const user = await User.create({
      username,
      email,
      hashedPassword
    });
    return await User.scope('currentUser').findByPk(user.id);
  }

  User.associate = function(models) {
    User.hasMany(models.Spot, { foreignKey: 'user_id' });
    User.belongsToMany(models.Spot, {
      through: 'favorites',
      otherKey: 'spot_id',
      foreignKey: 'user_id',
      as: 'Favorites'
    });
  };

  return User;
};
