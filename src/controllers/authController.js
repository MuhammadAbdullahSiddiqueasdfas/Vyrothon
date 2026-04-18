const { getEmbeddingFromImage, findMatchingFace } = require('../services/faceService');
const fs = require('fs');

const authenticateFace = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a selfie image' });
    }

    const filePath = req.file.path;
    
    // Process selfie
    const detections = await getEmbeddingFromImage(filePath);
    
    // Clean up uploaded image right away securely
    fs.unlinkSync(filePath);

    if (detections.length === 0) {
      return res.status(400).json({ error: 'No face detected in the image' });
    }

    if (detections.length > 1) {
      return res.status(400).json({ error: 'Multiple faces detected. Please upload a clear selfie with only your face.' });
    }

    const descriptor = detections[0].descriptor;
    const matchGrabId = await findMatchingFace(descriptor);

    if (matchGrabId) {
      res.status(200).json({
        success: true,
        grab_id: matchGrabId
      });
    } else {
      res.status(404).json({ error: 'Identity match failed. No matching face found in the identity engine.' });
    }

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

module.exports = { authenticateFace };
