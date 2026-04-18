const fs = require('fs');
const path = require('path');
const { getEmbeddingFromImage, findMatchingFace, createNewFace } = require('../services/faceService');
const Image = require('../models/Image');

const ingestImages = async (req, res, next) => {
  try {
    const storagePath = path.join(__dirname, '../../raw_storage');
    // Initialize directory if missing
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
      return res.status(200).json({ 
        message: "No images found. Created raw_storage folder. Please add images there.",
        data: { totalImagesProcessed: 0, facesDetected: 0, newFacesCreated: 0 } 
      });
    }

    const files = fs.readdirSync(storagePath).filter(file => file.match(/\.(jpg|jpeg|png)$/i));
    
    let totalProcessed = 0;
    let facesDetected = 0;
    let newFaces = 0;

    for (const file of files) {
      const filePath = path.join(storagePath, file);
      const relativeFilePath = `raw_storage/${file}`;
      
      // Checking for duplicate DB processing
      const existingImage = await Image.findOne({ filePath: relativeFilePath });
      if (existingImage) continue;
      
      const detections = await getEmbeddingFromImage(filePath);
      if (detections.length === 0) continue;
      
      totalProcessed++;
      facesDetected += detections.length;
      
      const grabIds = [];
      
      for (const detection of detections) {
        let grab_id = await findMatchingFace(detection.descriptor);
        if (!grab_id) {
          grab_id = await createNewFace(detection.descriptor);
          newFaces++;
        }
        if (!grabIds.includes(grab_id)) {
          grabIds.push(grab_id);
        }
      }
      
      // Keep Image Document
      await Image.create({
        filePath: relativeFilePath,
        grab_ids: grabIds
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalImagesProcessed: totalProcessed,
        facesDetected,
        newFacesCreated: newFaces
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { ingestImages };
