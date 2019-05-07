# Quick start

1. `cp .env.example .env`
   `cp client/deploy/.env.dist .env`
   `cp server/deploy/.env.dist .env`
2. `cd client && npm i`
3. `cd ../server && npm i`
4. In the root directory run: `docker-compose up`

- Grab a coffee -

5. Make sure everything is running: `docker ps -a`

### Using the mongodb admin

1. Go to http://localhost:1234
2. Input the following string into the "Connection string" input:
   `mongodb://admin:password@database:27017/database?authMechanism=SCRAM-SHA-1&authSource=admin`
