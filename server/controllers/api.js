var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var router = express.Router();
var moment = require('moment');
var models = require('../models');
var Product = models.tbl_product;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var sequelize = models.sequelize;
var mysql = require('mysql');
var DBConnection = mysql.createConnection({
    host: process.env.MysqlHost,
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    multipleStatements: process.env.MultipleStatements
});

//Create Database
function ManageDB() {

    DBConnection.query("CREATE DATABASE IF NOT EXISTS product_demo", function(err, result) {
        console.log(err)
        if (err) throw err;
        console.log("Database created");
        let tbl_product = "USE product_demo;CREATE TABLE IF NOT EXISTS `tbl_product` ( " +
            "    `id` int(11) NOT NULL AUTO_INCREMENT, " +
            "    `name` varchar(100) NOT NULL," +
            "    `image` varchar(250) NOT NULL," +
            "    `price` DECIMAL(6,4)  NOT NULL," +
            "    `created_date` datetime NOT NULL DEFAULT current_timestamp()," +
            "    PRIMARY KEY (`id`)" +
            "  ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;";

        DBConnection.query(tbl_product, function(err, result) {
            if (err) throw err;
            DBConnection.query("TRUNCATE TABLE tbl_product;", function(err, result) {
                console.log("tbl_product clear");
                let insert = '';
                for (let index = 1; index < 100; index++) {
                    insert += `INSERT INTO tbl_product (name, image, price)
                VALUES ('Product${index}', 'https://i.imgur.com/9UYzfny.png', '${parseFloat(Math.floor(Math.random() * 16) + 5).toFixed(2)}');`;
                }
                DBConnection.query(insert, function(err, result) {
                    if (err) throw err;
                    console.log("data inserted");
                })
            })
        })
    });
}

ManageDB();


//List Of All Product with Page
router.post('/GetAllProductWithDynamicPaging', jsonParser, function(req, res) {
    console.log(req.body)
    var objParam = req.body;
    var objSearch = objParam.search;
    var Orderby = [req.body.order_key, req.body.order_value];
    let offset = 0;
    let limit = parseInt(objParam.limit);
    if (objParam.page != undefined || objParam.page != null) {
        offset = parseInt(objParam.page - 1) * limit;
    }
    var WhereSearch = {};
    if (objSearch != '' && objSearch != undefined && objSearch != null) {
        WhereSearch[Op.or] = [];
        WhereSearch[Op.or].push(sequelize.literal("name like '%" + objSearch + "%'"));
        WhereSearch[Op.or].push(sequelize.literal("price like '%" + objSearch + "%'"));
    }
    Product.findAndCountAll({
        where: WhereSearch,
        order: [
            Orderby
        ],
        offset: parseInt(offset),
        limit: parseInt(limit)
    }).then(function(results) {
        if (results) {
            var response1 = new Object();
            response1.records_total = results.count;
            response1.data = results.rows;
            res.json(response1);
        } else {
            var response1 = new Object();
            response1.records_total = 0;
            response1.data = [];
            res.json(response1);
        }
    }).catch(function(err) {
        console.error('[' + moment().format('DD/MM/YYYY hh:mm:ss a') + '] ' + err.stack || err.message);
        res.json({
            success: false,
            message: 'Record(s) not found.'
        });
    });
});



module.exports = router;