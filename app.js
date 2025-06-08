const express = require('express');
const endpoints = require('./endpoints.json');
const db = require('./db/connection');

const app = express();

app.use(express.json());


app.get("/api", (req, res) => {
    res.status(200)
    .send( endpoints );
});


app.get("/api/topics", async (req, res, next) => {
    try {
        const result = await db.query('SELECT slug, description FROM topics;')
        res.status(200)
        .send( { topics: result.rows } )
    } catch(err) {
        next(err);
    }
});


app.get("/api/articles", async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
            COUNT(comments.comment_id)::INT AS comment_count 
            FROM articles 
            INNER JOIN comments ON articles.article_id = comments.article_id 
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`)
        res.status(200)
        .send( { articles: result.rows } )
    } catch(err) {
        next(err);
    }
});



module.exports = app;