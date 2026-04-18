const Image = require('../models/Image');

const getImagesByGrabId = async (req, res, next) => {
  try {
    const { grab_id } = req.params;

    const images = await Image.find({ grab_ids: grab_id });

    if (!images || images.length === 0) {
      return res.status(404).json({ success: false, message: 'No images found for this identity.' });
    }

    const filePaths = images.map(img => img.filePath);

    res.status(200).json({
      success: true,
      count: filePaths.length,
      data: filePaths
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getImagesByGrabId };
