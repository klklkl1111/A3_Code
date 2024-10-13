const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const router = require('./controller');
const server = express();
const port = 8999

server.use(bodyParser.json());
server.use(cors({
    origin: '*',
    credentials: true
}));

server.use('/api', router);

server.use('/images', express.static(path.join(__dirname, 'public/images')));

server.listen(port, () => {
    console.log(`http://localhost:${port} is running!`)
});