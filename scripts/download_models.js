const fs = require('fs');
const path = require('path');
const https = require('https');

const modelsDir = path.join(__dirname, '../models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

const baseUrl = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model/';
const filesToDownload = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

const downloadFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(modelsDir, fileName);
    if (fs.existsSync(filePath)) {
      console.log(`${fileName} already exists.`);
      return resolve();
    }
    console.log(`Downloading ${fileName}...`);
    const file = fs.createWriteStream(filePath);
    https.get(baseUrl + fileName, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`${fileName} downloaded.`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filePath);
      reject(err);
    });
  });
};

const downloadAllModels = async () => {
  try {
    for (const file of filesToDownload) {
      await downloadFile(file);
    }
    console.log('All models downloaded successfully! You can now start the server.');
  } catch (error) {
    console.error('Error downloading models:', error);
  }
};

downloadAllModels();
