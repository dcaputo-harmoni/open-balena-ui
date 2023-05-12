const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const webpack = require('webpack');
const { createFsFromVolume, Volume } = require('memfs');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.js');
const Minio = require('minio')
const jwt = require('njwt');
require('dotenv').config();

const minioClient = new Minio.Client({
  endPoint: process.env.OPEN_BALENA_S3_URL.split('://')[1],
  useSSL: process.env.OPEN_BALENA_S3_URL.includes('https') ? true : false,
  accessKey: process.env.OPEN_BALENA_S3_ACCESS_KEY,
  secretKey: process.env.OPEN_BALENA_S3_SECRET_KEY,
});
const registryBucket = 'registry-data';

const PORT = process.env.PORT;
const HOST = '0.0.0.0';

const app = express();

app.use(bodyParser.json());

app.post('/deleteRegistryImage', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization.split("Bearer ")[1], process.env.OPEN_BALENA_JWT_SECRET);
  } catch (err) {
    res.json({success: false, message: 'Invalid token'});
    return;
  }
  const imageRepository = `data/docker/registry/v2/repositories/v2/${req.body.imageLocationHash}`;
  var objectsList = []
  var objectsStream = minioClient.listObjects(registryBucket, imageRepository, true)
  objectsStream.on('data', (obj) => { objectsList.push(obj.name) });
  objectsStream.on('error', (err) => { 
    res.json({success: false, message: err});
    return;
  });
  objectsStream.on('end', () => {
    if (objectsList.length === 0) {
      res.json({success: false, message: 'image not found'});
      return;  
    } 
    minioClient.removeObjects(registryBucket, objectsList, (err) => {
      if (err) {
        res.json({success: false, message: err});
        return;
      } 
      res.json({success: true});
    });
  });
});

app.post('/deleteOrphanedRegistryImages', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization.split("Bearer ")[1], process.env.OPEN_BALENA_JWT_SECRET);
  } catch (err) {
    res.json({success: false, message: 'Invalid token'});
    return;
  }
  const databaseImages = req.body.databaseImages;
  const imageRepositories = `data/docker/registry/v2/repositories/v2/`;
  const registryImages = []
  var objectsStream = minioClient.listObjects(registryBucket, imageRepositories, false)
  objectsStream.on('data', (obj) => { registryImages.push(obj.prefix.split('repositories/v2/')[1].split('/')[0]) });
  objectsStream.on('error', (err) => { 
    res.json({success: false, message: err});
    return;
  });
  objectsStream.on('end', () => {
    const orphanedImages = registryImages.filter(x => !databaseImages.includes(x));
    const imagesToDelete = databaseImages.filter(x => !registryImages.includes(x));
    res.json({success: true, orphanedImages, imagesToDelete});
    /*
    minioClient.removeObjects(registryBucket, objectsList, (err) => {
      if (err) {
        res.json({success: false, message: err});
        return;
      } 
      res.json({success: true});
    });
    */
  });
});


// React client endpoints
const memfs = createFsFromVolume(new Volume());
memfs.join = path.join.bind(path);

const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: 'errors-only',
  outputFileSystem: memfs,
}));

app.use(webpackHotMiddleware(compiler));

app.get('*', async (req, res) => {
  try {
    res.send(memfs.readFileSync(path.join(compiler.outputPath, 'index.html')).toString());
  } catch (error) {
    res.sendStatus(404);
  }
});

app.listen(PORT, HOST);
console.log(`Running open-balena-ui on http://${HOST}:${PORT}`);
