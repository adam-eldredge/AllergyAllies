const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:19006', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,

  // origin: 'https://npiregistry.cms.hhs.gov/api',
  // methods: 'GET',
  // credentials: true
};

module.exports = cors(corsOptions);