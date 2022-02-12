const Article = require('./models/article')
const Reference=require('./models/reference')

const { DataTypes } = require('sequelize')

Article.hasMany(Reference, { onDelete: 'cascade' })


module.exports = {Article,Reference }
