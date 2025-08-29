## Project setup
```
npm install
```

### Local Run 
```
1. Create .env file in project folder
2. Copy paste this content:

NODE_ENV= production/development
JWT_SECRET= jwt secret key

# Database config
DB_PORT= database port
DB_HOST= database ip or localhost
DB_USER= database username
DB_PASS= database password
DB_NAME= database name 
DB_DIALECT= mysql

# Sequelize Pool Settings
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# Path attachment
PATH_ATTH_DEV = C:

3. node server.js
```

