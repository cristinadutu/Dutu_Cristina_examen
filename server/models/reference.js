const { DataTypes } = require('sequelize')
const sequelize = require('../sequelize')


const Reference = sequelize.define('Reference', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
	title: {
        type: DataTypes.STRING,
        validate: {
            len: [5,30]
            
        }
    },
    date: DataTypes.DATE,
    listOfAuthors: DataTypes.STRING
        
})

module.exports = Reference