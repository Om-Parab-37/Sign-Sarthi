# SignSarthi 🤟

![Project Banner](screenshots/Sign%20Sarthi%20Cover.png)

**SignSarthi** is a cutting-edge **Sign Language Translation & Companion** application designed to bridge the communication gap for the deaf and hard-of-hearing community. It combines advanced edge AI, computer vision, and a modern user interface to verify, translate, and teach sign language in real-time.

<div align="center">

# 🚀 [TRY THE LIVE DEMO](https://frontend-production-8a4d.up.railway.app/) 🚀
### *Experience Real-time Hand Tracking & Translation in your Browser*

</div>

---

## 🚀 Features

### 👋 Real-time Fingerspelling Recognition
Start signing in front of your camera, and SignSarthi will translate your fingerspelling into text instantly.
- **Powered by MediaPipe & TensorFlow.js** for high-performance, private, client-side inference.
- Real-time visual feedback with 3D landmark tracking.

### 🎥 Text-to-Sign Animation
Type any English phrase, and watch a 3D avatar/animation perform the sign language translation.
- **Semantic Understanding**: Uses **Sentence Transformers** and **Spacy** (NER) to understand context and map text to the most accurate sign assets.
- Support for common phrases and continuous sentence translation.
- Smooth video playback with intelligent caching.

### 📚 Interactive Learning
An immersive way to learn sign language by seeing translations in real-time and practicing fingerspelling with instant AI feedback.

---

## 📸 Screenshots

![UI Showcase](screenshots/UI%20Showcase%20banner.png)

| Home Dashboard | Translation Interface | Fingerspelling Mode |
|:---:|:---:|:---:|
| ![Home Screenshot](screenshots/Home%20Screen.png) | ![Translation Screenshot](screenshots/Translation%20Screen.png) | ![Fingerspelling Screenshot](screenshots/FingerSpelling%20Screen.png) |
| *Visual Dashboard* | *Text to Sign Animation* | *Real-time Hand Tracking* |


---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Edge AI**: 
  - [MediaPipe Hands](https://developers.google.com/mediapipe) (Hand tracking)
  - [TensorFlow.js](https://www.tensorflow.org/js) (Model inference)
- **State/Data**: [TanStack Query](https://tanstack.com/query/latest)

### Backend (Server)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **Server**: Uvicorn
- **NLP & AI Engine**:
  - [Spacy](https://spacy.io/) (Named Entity Recognition)
  - [Sentence Transformers](https://sbert.net/) (Semantic Search)
  - [NLTK](https://www.nltk.org/) (Natural Language Toolkit)
- **Validation**: Pydantic

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose

---

## 📂 Project Structure

```bash
SignSarthiV2/
├── backend/                # Python FastAPI Server (NLP Engine)
│   ├── app/
│   │   ├── main.py         # App Entry point
│   │   ├── api/            # API Routes
│   │   ├── core/           # Config & Security
│   │   └── services/       # NLP & Video Logic
│   ├── Dockerfile
│   └── pyproject.toml      # Python Dependencies
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Application Routes (Home, TextInput, Fingerspelling)
│   │   ├── context/        # React Contexts
│   │   └── lib/            # Utilities
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml      # Orchestration
```

---

## 🏁 Getting Started

### Prerequisites
- **Docker** and **Docker Compose** installed on your machine.
- (Optional) **Node.js** & **Python 3.12+** if running locally without Docker.

### 🐳 Run with Docker (Recommended)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/SignSarthiV2.git
    cd SignSarthiV2
    ```

2.  **Start the application**
    ```bash
    docker-compose up --build
    ```
    This command will build the frontend and backend images and start the services.

3.  **Access the App**
    - Frontend: `http://localhost:80` (or `http://localhost:5173` depending on config)
    - Backend API Docs: `http://localhost:8000/docs`

### 🔧 Local Development (Manual)

**Backend:**
```bash
cd backend
# Install dependencies (using pip or uv)
pip install -r requirements.txt # OR uv sync
# Start Server
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
# Install dependencies
npm install
# Start Dev Server
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
