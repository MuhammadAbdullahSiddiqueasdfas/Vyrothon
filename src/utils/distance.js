// Euclidean distance between two arrays of numbers (e.g., embeddings)
const calculateEuclideanDistance = (embedding1, embedding2) => {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }
  let sum = 0;
  for (let i = 0; i < embedding1.length; i++) {
    const diff = embedding1[i] - embedding2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
};

module.exports = { calculateEuclideanDistance };
