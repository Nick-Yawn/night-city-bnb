'use strict';
module.exports = (sequelize, DataTypes) => {
  const Spot = sequelize.define('Spot', {
    district_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    user_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Spot.associate = function(models) {
    Spot.belongsTo(models.User, { 
      foreignKey: 'user_id', 
      onDelete: 'cascade' 
    });
    Spot.belongsTo(models.District, {
      foreignKey: 'district_id'
    });
    Spot.hasMany(models.Image, {
      foreignKey: 'spot_id'
    });
    Spot.belongsToMany(models.Amenity, {
      through: 'spot_amenities',
      otherKey: 'amenity_id',
      foreignLey: 'spot_id'
    }); 
    Spot.belongsToMany(models.User, {
      through: 'favorites',
      otherKey: 'user_id',
      foreignLey: 'spot_id',
      as: 'Favorites'
    });
    Spot.hasMany(models.Review, {
      foreignKey: 'spot_id'
    }) 
    Spot.hasMany(models.Booking, {
      foreignKey: 'spot_id'
    })
  };
  return Spot;
};
