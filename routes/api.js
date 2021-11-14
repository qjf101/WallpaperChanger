const express = require('express');
const createError = require('http-errors')

const cors = require('cors');
const jetpack = require('fs-jetpack');
const path = require('path');
const fetch = require("node-fetch");
const wallpaper = require('wallpaper');
const { dialog } = require('electron');

const apiRoutes = express.Router();

let backendFilePath = '';
let frontendFilePath = '';
let savedWallpaper = null;

if (process.env.NODE_ENV === "development") {
  backendFilePath = './client/public/images/image.jpg';
  frontendFilePath = '../images/image.jpg';
}
else {
  backendFilePath = './public/images/image.jpg';
  frontendFilePath = path.join(__dirname, '../../../public/images/image.jpg');
}

apiRoutes.get('/getCurrentWallpaper', cors(), async (req, res, next) => {
  try {
    wallpaper.get().then((data) => {
      if (process.env.NODE_ENV === "development") {
        jetpack.copyAsync(data, './client/public/images/current.jpg', { overwrite: true }).then(() =>
          res.send('../images/current.jpg'));
      } else {
        res.send(data)
      }
    })
  }
  catch (e) {
    next(createError(500, e))
  }
})

apiRoutes.get('/getNewWallpaper', cors(), async (req, res, next) => {
  try {
    const apiRequestUrl = 'https://wallhaven.cc/api/v1/search?resolutions=1920x1080';
    const apiResponse = await fetch(apiRequestUrl);
    const apiResponseJson = await apiResponse.json();

    let imagesArray = []
    let i;
    let iLength = apiResponseJson.data.length;
    for (i = 0; i < iLength; i++) {
      const values = apiResponseJson.data[i].path
      imagesArray.push(values)
    }
    const url = imagesArray[parseInt(Math.random() * imagesArray.length)]
    console.log(url);

    fetch(url)
      .then(response => response.buffer())
      .then(buffer => { jetpack.writeAsync(backendFilePath, buffer); savedWallpaper = buffer })
      .then(() =>
        res.send(frontendFilePath));
  }
  catch (e) {
    next(createError(500, e))
  }
})

apiRoutes.get('/setWallpaper', cors(), async (req, res, next) => {
  try {
    console.log('updating wallpaper')
    await wallpaper.set(backendFilePath, 'all', 'fill').then(() =>
      console.log('Wallpaper updated successfully')).then(() =>
        res.send(`Wallpaper changed to: ${backendFilePath}`));
  }
  catch (e) {
    next(createError(500, e))
  }
})

apiRoutes.get('/saveWallpaper', cors(), async (req, res, next) => {
  try {
    console.log('opening save dialog')
    const { filePath, canceled } = await dialog.showSaveDialog({
      defaultPath: "Wallpaper.jpg", buttonLabel: "Save Wallpaper", filters: [
        { name: 'Image', extensions: ['jpg'] }
      ]
    });

    if (savedWallpaper == null) {
      res.send('Get a new wallpaper before saving.')
      console.log('Get a new wallpaper before saving.')
    }
    else if (canceled) {
      res.send('canceled')
    }
    else if (filePath && !canceled) {
      console.log('saving wallpaper')
      jetpack.writeAsync(filePath, savedWallpaper)
        .then(
          res.send(`Wallpaper saved to: ${filePath}`)
        );
    }
  }
  catch (e) {
    next(createError(500, e))
  }
})


module.exports = apiRoutes