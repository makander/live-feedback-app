# Quick start

In the root directory run step 1-5:

1. `cp .env.example .env && cp client/deploy/.env.dist cp client/deploy/.env && cp server/deploy/.env.dist server/deploy/.env`
2. `cd client && npm i`
3. `cd ../server && npm i`
4. `docker-compose up` - Grab a coffee -...
5. Make sure everything is running: `docker ps -a`

## Using the mongodb admin

1. Go to <http://localhost:1234>
2. Input the following string into the "Connection string" input:
   `mongodb://admin:password@database:27017/database?authMechanism=SCRAM-SHA-1&authSource=admin`

### Tests

The backend tests are primarily set up to run in the deployment pipeline, but they can also be run locally. Once your local docker environment is up and running, run "docker exec -it [server_container_id] sh" to enter the server container, then run "npm test". You will likely get an error outside your test suit saying port 5000 is already in use, just ignore that.

### CD/CI Using Buddy.works

In the buddy.works.config folder you'll find a pipelines.yml file that you can import directly into buddy.works. The pipelines marked \[DEV\] are setup to deploy from the develop branch, while the ones marked \[PROD\] are set to deploy from the master branch. The Deploy API Tests pipelines setup and run the backend tests in a docker container built based on the Dockerfile.dev.tests in the server/deploy folder. The Tests pipelines trigger on push, and if the tests succeed they trigger the corresponding Deploy API pipeline that deploys the backend.

The Deploy Client pipelines trigger on push and run the tests as part of the pipeline, if the tests fail the pipeline fails.

Most of the configuration will need to be done on buddy.works in the pipelines themselves and the docker-stack files found in the \[client/server\]/deploy folders. The .env-files will also need to updated to reflect the port/URL choices for the local and deployed docker stacks.
