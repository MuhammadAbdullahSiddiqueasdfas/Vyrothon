# Grabpic - Intelligent Identity Engine 🚀

## Project Overview
Grabpic is a production-ready Node.js backend acting as an Intelligent Identity Engine. Its main role revolves around a potent facial recognition system capable of processing a batch of unstructured photos, detecting distinct individuals, and dynamically assigning sequential identities (`GRAB_001`, `GRAB_002`, etc.).

### Key Features
* **Facial Recognition System**: Leverages TensorFlow and FaceAPI to generate 128-dimensional facial embeddings for pinpoint accuracy (safely gracefully falling back to deterministic mocking if models aren't present).
* **One-to-Many Image Mapping**: An individual identity can be linked to multiple photos seamlessly.
* **Selfie-based Authentication**: Users can verify their assigned `grab_id` by securely uploading a selfie. The engine processes the selfie via Euclidean distance computation against known embeddings in MongoDB to locate the closest match.

## Tech Stack
* **Node.js**: Asynchronous backend execution.
* **Express.js**: Highly scalable routing layer.
* **MongoDB & Mongoose**: Database management utilizing normalized schema collections (Faces and Images).

---

## Setup & Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/MuhammadAbdullahSiddiqueasdfas/Vyrothon.git
   cd Vyrothon
   npm install
   ```

2. **Download Models (Optional)**
   The neural network requires pre-trained models. A script is provided to automate this:
   ```bash
   node scripts/download_models.js
   ```

3. **Database Setup (.env)**
   Ensure your MongoDB connection string is populated in the `.env` file at the root. Use the `.env.example` as reference.
   ```env
   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/grabpic?retryWrites=true&w=majority
   PORT=5000
   ```

4. **Prepare Images**
   Place your bulk images to be processed inside the `./raw_storage` directory inside the project root folder. (The folder is auto-created dynamically if missing).

5. **Start the Application**
   ```bash
   npm start
   ```

---

## 📡 API Endpoints & Testing Instructions (CURL & Postman)

A core requirement is verifying that Grabpic's engine endpoints operate securely.

### 1. Ingest Raw Images (`POST /ingest`)
Crawls `./raw_storage` recursively, evaluates new images, and appends newly discovered clusters into the database dynamically generating `GRAB_XXX` sequences.

* **CURL Request**
  ```bash
  curl -X POST http://localhost:5000/ingest
  ```
* **Postman Setup:**
  - Method: `POST`
  - URL: `http://localhost:5000/ingest`
  - Body: *none*

* **Example Response:**
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
Submit a facial portrait `selfie` file upload via form-data to authenticate against the engine and establish your verified identity code.

* **CURL Request**
  ```bash
  curl -X POST -F "selfie=@/path/to/my_selfie.jpg" http://localhost:5000/auth
  ```
* **Postman Setup:**
  - Method: `POST`
  - URL: `http://localhost:5000/auth`
  - Body Tab: select `form-data`
  - Key: `selfie` (Change type from Text -> File)
  - Value: Select an image on your computer.

* **Example Response:**
  ```json
  {
    "success": true,
    "grab_id": "GRAB_002"
  }
  ```

### 3. Retrieve Known Images (`GET /my-images/:grab_id`)
Pulls an aggregated collection array containing every photo tied to the target user identity.

* **CURL Request**
  ```bash
  curl -X GET http://localhost:5000/my-images/GRAB_002
  ```
* **Postman Setup:**
  - Method: `GET`
  - URL: `http://localhost:5000/my-images/GRAB_002`

* **Example Response:**
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

---

## Technical Details

* **How embeddings work**: The neural network evaluates facial landmarks and shapes, mathematically translating them into an array of precisely 128 floating-point numbers. This multidimensional array plots the face within geographical "distance space".
* **How matching works**: When deciding if two faces belong to the same person, we compute the **Euclidean distance** across their 128D arrays. If the distance falls under a strict threshold (`0.6`), they are classified as the same person. Let $a$ and $b$ be the arrays; distance equals $\sqrt{\sum_{i=1}^{n} (a_i - b_i)^2}$.
* **One image → multiple faces**: A single group photo or crowd shot may include multiple individuals. Grabpic identifies each unique face in that image context, links its distinct descriptor to the Global Identity Database, and outputs multiple `grab_ids` binding strictly to the original image path.
