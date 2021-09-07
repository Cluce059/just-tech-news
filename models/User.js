const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//create User Model
class User extends Model {}

//define table col and configs
User.init(
    {
        //table col definitions
        //define id col
        id: {
            //use Sequelize DataTypes object to provide the datatype
            type: DataTypes.INTEGER,
            //aka 'NOT NULL'
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            //run data thru validator if set to not null
            validate: {
            isEmail: true
            }
        },
        //define password col
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            //password must be at least 4 char long
            len: [4]
                }
            }
        },
        {
          hooks: {
            async beforeCreate(newUserData){
                //pass in saltround value of 10
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData
            },
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
            sequelize,
            timestamps: false,
            freezeTableName: true,
            underscored: true,
            modelName: 'user'
        }
);

module.exports = User;