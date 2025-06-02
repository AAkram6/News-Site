const db = require("../connection")
const { convertTimestampToDate } = require('./utils');



const seed = async ({ topicData, userData, articleData, commentData }) => {

  await db.query('DROP TABLE IF EXISTS comments;');
  await db.query('DROP TABLE IF EXISTS articles;');
  await db.query('DROP TABLE IF EXISTS users;');
  await db.query('DROP TABLE IF EXISTS topics;');


  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR(100) PRIMARY KEY NOT NULL,
      description VARCHAR(1000),
      img_url VARCHAR(1000)
    );
  `);

  await db.query(`
    CREATE TABLE users (
      username VARCHAR(50) PRIMARY KEY NOT NULL,
      name VARCHAR(50) NOT NULL,
      avatar_url VARCHAR(1000)
    );
  `);

  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      topic VARCHAR(100) NOT NULL,
      author VARCHAR(50) NOT NULL,
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INTEGER DEFAULT 0,
      article_img_url VARCHAR(1000),
      FOREIGN KEY (topic) REFERENCES topics(slug),
      FOREIGN KEY (author) REFERENCES users(username)
    );
  `);

  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INTEGER NOT NULL,
      body TEXT,
      votes INTEGER DEFAULT 0,
      author VARCHAR(30) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(article_id),
      FOREIGN KEY (author) REFERENCES users(username)
    );
  `);


  const newTopicData = topicData.map((topic) => {
    return {
      slug: topic.slug,
      description: topic.description,
      img_url: topic.img_url
    }
  });


  for (const topic of newTopicData) {
    await db.query(
      'INSERT INTO topics (slug, description, img_url) VALUES ($1, $2, $3);',
      [topic.slug, topic.description, topic.img_url]
    );
  }




  const newUserData = userData.map((user) => {
    return {
      username: user.username,
      name: user.name,
      avatar_url: user.avatar_url
    }
  });

  for (const user of newUserData) {
    await db.query(
      'INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3);',
      [user.username, user.name, user.avatar_url]
    );
  }

  

  const newArticleData = articleData.map((article) => {
    return convertTimestampToDate ({
      title: article.title,
      topic: article.topic,
      author: article.author,
      body: article.body,
      created_at: article.created_at,
      votes: article.votes,
      article_img_url: article.article_img_url
    });
  });

  const articleKey = new Map();

  for (const article of newArticleData) {
    const values = await db.query(
      'INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING article_id, title;',
      [article.title, article.topic, article.author, article.body, article.created_at, article.votes, article.article_img_url] );
      articleKey.set(values.rows[0].title, values.rows[0].article_id);
  }



  const newCommentData = commentData.map((comment) => {
    return convertTimestampToDate ({
      article_id: articleKey.get(comment.article_title),
      body: comment.body,
      votes: comment.votes,
      author: comment.author,
      created_at: comment.created_at
    });
  });

  for (const comment of newCommentData) {
    const values = await db.query(
      'INSERT INTO comments (article_id, body, votes, author, created_at) VALUES ($1, $2, $3, $4, $5);',
      [comment.article_id, comment.body, comment.votes, comment.author, comment.created_at] );
  }

};




module.exports = seed;
