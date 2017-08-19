module.exports = function(sequelize, DataTypes) {
  return sequelize.define("customers", {
    name: DataTypes.STRING
  });
}