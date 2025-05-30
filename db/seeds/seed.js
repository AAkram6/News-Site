const db = require("../connection")



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

};



module.exports = seed;
