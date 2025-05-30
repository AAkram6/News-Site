# NC News Seeding

# Instructions:
- Two .env files are required in order to connect to the local PosgreSQL databases;
1. .env.development
2. .env.test 

- You will be required to create both files in the root of the project directory. 

Add the following configurations into the below files:

# .env.development 
PGDATABASE=nc_news

# .env.test
PGDATABASE=nc_news_test

# gitignore 
.env.*

