
const express = require('express')
const router = express.Router()
const sequelize = require('../sequelize')

router
    .route('/')
    .get(async (req, res) => {
        try {
            await sequelize.sync({force: true})
            return res.status(200).json({message: "Tables have been updated"})
          } catch (error) {
            return res.status(500).json(error)
          }
    })

module.exports = router