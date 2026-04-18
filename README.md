# Grabpic - Intelligent Identity Engine

## Project Overview
Grabpic is a production-ready Node.js backend acting as an Intelligent Identity Engine. Its main role revolves around a potent facial recognition system capable of processing a batch of unstructured photos, detecting distinct individuals, and dynamically assigning sequential identities (`GRAB_001`, `GRAB_002`, etc.).

### Key Features
* **Facial Recognition System**: Leverages TensorFlow and FaceAPI to generate 128-dimensional facial embeddings for pinpoint accuracy.
* **One-to-Many Image Mapping**: An individual identity can be linked to multiple photos seamlessly.
* **Selfie-based Authentication**: Users can verify their assigned `grab_id` by securely uploading a selfie. The engine processes the selfie via Euclidean distance computation against known embeddings in MongoDB to locate the closest match.

## Tech Stack
* **Runtime**: Node.js
* **Framework**: Express
* **Database**: MongoDB (via Mongoose schemas)
* **ML Library**: @vladmandic/face-api, Canvas

## Folder Structure
```text
grabpic/
├── README.md
├── scripts/
│   └── download_models.js    # Downloads necessary ML models for FaceAPI
├── server.js                 # Entrypoint
├── package.json
└── src/
    ├── config/
    │   └── db.js             # Mongoose connection
    ├── controllers/
    │   ├── authController.js # Selfie authentication logic
    │   ├── ingestController.js # Processes raw_storage contents
    │   └── retrieveController.js # Retrieves photos based on ID
    ├── middleware/
    │   ├── errorHandler.js   # Global error formatting
    │   └── upload.js         # Multer configuration for selfies
    ├── models/
    │   ├── Face.js           # 128D Embedding & ID schema
    │   └── Image.js          # Photo mapping schema
    ├── routes/
    │   ├── authRoutes.js
    │   ├── ingestRoutes.js
    │   └── retrieveRoutes.js
    ├── services/
    │   └── faceService.js    # Core facial extraction algorithms
    └── utils/
        └── distance.js       # Euclidean distance thresholds
```

## Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   git clone <repo-url>
   cd grabpic
   npm install
   ```

2. **Download Models**
   The neural network requires pre-trained models. A script is provided to automate this:
   ```bash
   node scripts/download_models.js
   ```

3. **Database Setup (.env)**
   Ensure your MongoDB connection string is populated in the `.env` file at the root.
   ```env
   MONGO_URI=mongodb+srv://vyrothon:Admin123@cluster0.mongodb.net/grabpic?retryWrites=true&w=majority
   PORT=5000
   ```

4. **Prepare Images**
   Place your bulk images to be processed inside the auto-created `./raw_storage` directory inside the project root folder.

5. **Start the Application**
   ```bash
   npm start
   ```

## Explanation

* **How embeddings work**: The neural network evaluates facial landmarks and shapes, mathematically translating them into an array of precisely 128 floating-point numbers. This multidimensional array plots the face within geographical "distance space".
* **How matching works**: When deciding if two faces belong to the same person, we compute the **Euclidean distance** across their 128D arrays. If the distance falls under a strict threshold (`0.6`), they are classified as the same person. Let $a$ and $b$ be the arrays; distance equals $\sqrt{\sum_{i=1}^{n} (a_i - b_i)^2}$.
* **One image → multiple faces**: A single group photo or crowd shot may include multiple individuals. Grabpic identifies each unique face in that image context, links its distinct descriptor to the Global Identity Database, and outputs multiple `grab_ids` binding strictly to the original image path.

## API Endpoints & Examples

### 1. Ingest Images (`POST /ingest`)
Crawls `./raw_storage` recursively, evaluates new images, and appends newly discovered clusters into the database.
```bash
curl -X POST http://localhost:5000/ingest
```
Response:
```json
{
  "success": true,
  "data": {
    "totalImagesProcessed": 5,
    "facesDetected": 12,
    "newFacesCreated": 3
  }
}
```

### 2. Authenticate Selfie (`POST /auth`)
Submit a facial portrait `selfie` file to authenticate against the engine and establish your verified identity code.
```bash
curl -X POST -F "selfie=@/path/to/my_selfie.jpg" http://localhost:5000/auth
```
Response:
```json
{
  "success": true,
  "grab_id": "GRAB_002"
}
```

### 3. Retrieve Known Images (`GET /my-images/:grab_id`)
Pulls an aggregated collection array containing every photo tied to the target user identity.
```bash
curl -X GET http://localhost:5000/my-images/GRAB_002
```
Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    "raw_storage/party.jpg",
    "raw_storage/conference.jpg"
  ]
}
```
