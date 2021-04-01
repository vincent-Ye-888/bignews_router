// 引入express包
const express = require('express');
const sql = require('../utils/sql.js');
const router = express.Router();

// 引入封装好的连接数据库模块
const conn = require('../utils/sql.js');
// 下面的一句代码是实现获取post请求携带的普通键值对形式的参数
router.use(express.urlencoded());

// 根据read字段查询表中7条数据
// SELECT id,title FROM `articles`  order by `read` desc limit 7


// 随机查询表中5条数据
// SELECT * FROM articles ORDER BY RAND() LIMIT 5

// 文章类型接口
router.get('/category', (req, res) => {
    // 拼接sql语句
    const sqlStr = `select * from categories`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '服务器错误' })
            return;
        }
        // console.log(result);
        res.json({ status: 0, message: '获取成功', data: result });
    });
});

// 热点图接口 
router.get('/hotpic', (req, res) => {
    // 拼接sql语句 随机返回5条数据
    const sqlStr = `select id, cover, title from articles order by rand() limit 5`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取错误' })
            return;
        }
        // console.log(result);
        res.json({ status: 0, message: '获取成功', data: result });
    });
});

// 文章热门排行榜接口 返回7条数据
router.get('/rank', (req, res) => {
    // 拼接sql语句 返回7条数据 根据read量最多的7条
    const sqlStr = "SELECT id, title FROM articles  order by `read` desc limit 7";
    console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        if (err) {
            res.json({ status: 1, message: '获取失败' })
            return;
        }
        // console.log(result);
        res.json({ statsus: 0, message: '获取成功', data: result });
    });
});

// 文章搜索接口
router.get('/search', (req, res) => {
    // 获取传入的参数
    // console.log(req.query);
    const { key, type, page, perpage } = req.query;
    // 拼接sql 什么都不传的情况
    let sqlStr = `select * from articles`;
    if (key) {
        sqlStr += ` where title like "%${key}%"`;
    }
    if (type) {
        sqlStr += ` and categoryId=${type}`;
    } else if (!key && type) {
        sqlStr += ` where categoryId=${type}`;
    }
    console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        if (err) {
            res.json({ status: 1, message: '获取失败' })
            return;
        }
        // console.log(result);
        if (result == "") {
            res.json({ status: 1, message: '没有获取到数据' });
            return;
        }
        // 如果都不传入页数和每一页显示多少条 默认是第1页 每一页6条
        if (!perpage && !page) {
            res.json({ status: 0, message: '获取成功', page: 1, perpage: 6, data: result });
            return;
        }
        if (!page) {
            res.json({ status: 0, message: '获取成功', page: 1, perpage: perpage, data: result });
            return;
        }
        if (!perpage) {
            res.json({ status: 0, message: '获取成功', page: page, perpage: 6, data: result });
            return;
        }
        res.json({ status: 0, message: '获取成功', page: page, perpage: perpage, data: result });
    });
});


// 导出路由中间件
module.exports = router;