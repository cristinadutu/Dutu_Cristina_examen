const { DataTypes } = require('sequelize')
const sequelize = require('../sequelize')


const Article = sequelize.define('Article', {
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
    summary: {
        type: DataTypes.STRING,
        validate: {
            len: [10,50]
            
        }
    },
    date: DataTypes.DATE

})

module.exports = Article