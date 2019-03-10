var Sequelize  = require("sequelize")
const db = {}
Sequelize = new Sequelize("Dugdh", "Vishal", "destroy@9795",{
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }

})

db.Sequelize = Sequelize
db.Sequelize = Sequelize

module.exports=db