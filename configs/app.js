/** *******
 * app.js file
 ******** */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const routes = require('../routes');

module.exports = () => {
  const server = express();

  const create = (config, db) => {
    server.use(cors());
    server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // set all the server things
    server.set('env', config.env);
    server.set('port', config.port);
    server.set('hostname', config.hostname);

    // add middleware to parse the json
    server.use(bodyParser.json());
    server.use(
      bodyParser.urlencoded({
        extended: false,
      }),
    );

    // connect the database
    mongoose.connect(db.database, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
"auth": {
      		"authSource": "admin"
    	},
    	"user": "ProxiviaAdmin",
    	"pass": process.env.DB_PASSWORD
    });

    // Set up routes
    routes.init(server);
  };

  const start = () => {
    const hostname = server.get('hostname');
    const port = server.get('port');
    server.listen(port, () => {
      console.log(
        `Express server listening on - http://${hostname}:${port}`,
      );
    });
  };
  return {
    create,
    start,
    server,
  };
};
