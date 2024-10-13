const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
const uploadConfig = require('./multer');

const database = mysql.createConnection({
    host: 'localhost',
    database: 'crowdfunding_db',
    user: 'root',
    password: '123456'
});

database.connect((error) => {
    if (error) {
        throw error
    }
});

router.get('/category', (req, res) => {
    database.query('SELECT * FROM category', (err, data) => {
        if (err) {
            throw err
        };
        res.json(data);
    });
});

router.get('/search', (req, res) => {
    const category = req.query.category;
    let sql = 'SELECT f.*, c.NAME FROM fundraiser as f JOIN category as c ON f.CATEGORY_ID = c.CATEGORY_ID'
    if (category != undefined && category != null && category != 'null') {
        const categoryArray = category.split(',').map(item => item.trim());
        if (categoryArray.length > 0 && categoryArray[0] != '') {
            sql += ` WHERE f.CATEGORY_ID IN (${category})`;
        }
    }
    database.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        res.json(data);
    });
});

router.get('/fundraiser/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT fundraiser.*, category.NAME FROM fundraiser JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID WHERE fundraiser.FUNDRAISER_ID = ' + id;
    database.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        res.json(data);
    });
})

router.get('/donationList/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'SELECT * FROM donation WHERE FUNDRAISER_ID = ' + id;
    database.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        res.json(data);
    });
})

router.post('/donation', (req, res) => {
    const { FUNDRAISER_ID, AMOUNT, GIVER, DATE } = req.body;
    const getCurrentFundingSql = `SELECT CURRENT_FUNDING FROM FUNDRAISER WHERE FUNDRAISER_ID = ${FUNDRAISER_ID}`;
    database.query(getCurrentFundingSql, (err, result) => {
        if (err) {
            throw err;
        }
        const currentFunding = result[0].CURRENT_FUNDING;
        const updatedFunding = Number(currentFunding) + Number(AMOUNT);
        const insertDonationSql = `INSERT INTO DONATION (FUNDRAISER_ID, AMOUNT, GIVER, DATE) VALUES (${FUNDRAISER_ID}, ${AMOUNT}, '${GIVER}', '${DATE}')`;
        database.query(insertDonationSql, (err, data) => {
            if (err) {
                throw err;
            }
            const updateFundraiserSql = `UPDATE FUNDRAISER SET CURRENT_FUNDING = ${updatedFunding} WHERE FUNDRAISER_ID = ${FUNDRAISER_ID}`;
            database.query(updateFundraiserSql, (err, result) => {
                if (err) {
                    throw err;
                }
                res.json(data);
            });
        });
    });
});

router.post('/upload', (req, res) => {
    uploadConfig(req, res)
        .then(imgSrc => {
            res.json({
                "code": 0,
                "msg": "string",
                'data': imgSrc
            })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.sendFile(path.join(__dirname, 'images', imageName));
});

router.post('/insertData', (req, res) => {
    const { organizer, caption, target, city, status, category, describe, url } = req.body;
    const category_id = Number(category)
    const sql = 'INSERT INTO FUNDRAISER (`ORGANIZER`, `CAPTION`, `TARGET_FUNDING`, `CITY`, `ACTIVE`, `CATEGORY_ID`, `DESCRIBE`, `IMAGEURL`) VALUES ( \'' + organizer + '\', \'' + caption + '\', ' + target + ', \'' + city + '\', ' + status+', ' + category_id +', \'' + describe +'\', \'' + url + '\' )';
    database.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        res.json(data);
    });
});

router.put('/updateData', (req, res) => {
    const { id, organizer, caption, target, city, status, category, describe, url } = req.body;
    const category_id = Number(category)
    const sql = 'UPDATE FUNDRAISER SET `ORGANIZER` = \'' + organizer + '\', ' + '`CAPTION` = \'' + caption + '\', ' + '`TARGET_FUNDING` = ' + target + ', ' + '`CITY` = \'' + city + '\', ' + '`ACTIVE` = ' + status + ', ' + '`CATEGORY_ID` = ' + category_id + ', ' + '`DESCRIBE` = \'' + describe + '\', ' + '`IMAGEURL` = \'' + url + '\' WHERE FUNDRAISER_ID = ' + id;
    database.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        res.json(data);
    });
});

router.delete('/deleteData', (req, res) => {
    const { id } = req.query;
    const sql = 'DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ' + id;
    database.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        res.json(data);
    });
});

module.exports = router;