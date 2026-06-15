🌍 Civic Issue Classifier – Description

The CivicAI SIH Project is an AI-powered civic issue reporting and management platform designed to make cities smarter, more efficient, and responsive to citizen needs.

In today’s world, a large number of urban challenges such as garbage accumulation, potholes, broken streetlights, water logging, and floods often go unnoticed or take too long to resolve due to delays in reporting and lack of proper routing to the right departments. CivicAI bridges this gap by allowing citizens to simply upload a photo of an issue.

Once an image is uploaded, the platform leverages the YOLOv8 deep learning model to automatically classify the type of civic problem. The model has been trained on thousands of images and can recognize issues with high accuracy. After classification, the system intelligently maps each issue to the relevant department:

Garbage → Ministry of Housing and Urban Affairs / Sanitation Department

Potholes → Roads and Transport Department

Streetlight Failures → Electricity Department

Water Logging → Municipal Water Management

Floods → Disaster Management Authority / Water Resources Department

This ensures that the complaint does not remain in a general pool but is instead directly assigned to the correct authority for faster redressal.

Additionally, the system provides prediction probabilities and confidence scores to maintain transparency and trust in AI-based decision-making. Each report is saved and logged in a structured format (CSV or database) for tracking, analytics, and follow-up actions.

The CivicAI platform goes beyond just classification—it creates a smart grievance redressal pipeline where citizens, municipal authorities, and government departments work in sync. By automating classification and routing, the system reduces manual effort, shortens response times, and improves accountability.

This project not only demonstrates the power of artificial intelligence in solving real-world problems but also has the potential to scale across multiple cities and states, making civic governance more efficient and citizen-friendly.

In essence, CivicAI empowers citizens, strengthens governance, and contributes toward building the Smart Cities of the future.

---

## 🛠 Reorganized Project Structure

The machine learning components have been separated into a dedicated `ml/` directory to keep the root clean and differentiate between the frontend dashboard and the AI model codebase:

```
CityScope/
├── app/                  # Next.js pages, layouts, and API routes
├── components/           # Reusable UI components (React/Shadcn)
├── lib/                  # Shared utility functions and database configs
├── public/               # Static assets (images, icons)
├── styles/               # CSS and styling files
├── utils/                # Next.js auxiliary utility modules
├── ml/                   # Machine Learning Model & CLI Scripts (Separated)
│   ├── .streamlit/       # Streamlit server and user configuration
│   ├── App.py            # Streamlit Interactive Web Application
│   ├── Predict.py        # CLI prediction script
│   ├── Train.py          # Model training script
│   ├── requirements.txt  # Python dependencies for ML
│   ├── best.pt           # Trained YOLOv8 classification weights
│   ├── yolov8n-cls.pt    # Pre-trained YOLOv8 classification weights
│   └── *.png, *.jpg, *.csv, *.cache  # Training graphs, reports, and caches
└── package.json          # Node/Next.js dependencies and run scripts
```

---

## 🚀 How to Run the Project

This project consists of two separate components: a **Next.js Frontend Dashboard** and a **Streamlit ML Classifier**. They can be run independently.

### 1. Next.js Frontend Dashboard

The frontend application provides the main civic issue reporting portal, maps, and MCC staff dashboard.

#### Prerequisites
- **Node.js** (v18.x or higher recommended)
- **npm** (comes with Node.js)

#### Steps to Run
1. Open your terminal in the project root directory.
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

### 2. Machine Learning & Streamlit Classifier

The Streamlit app is a dedicated portal to upload civic issue photos, execute YOLOv8 image classification, and automatically determine target departments and severity levels.

#### Prerequisites
- **Python** (v3.8 or higher recommended)
- **pip** (Python package installer)

#### Steps to Run
1. Open your terminal in the project root directory.
2. (Recommended) Create and activate a Python virtual environment:
   * **Windows (Command Prompt / PowerShell):**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install the required Python dependencies:
   ```bash
   pip install -r ml/requirements.txt
   ```
4. Run the Streamlit application:
   ```bash
   streamlit run ml/App.py
   ```
5. Streamlit will automatically open the app in your browser at:
   ```
   http://localhost:8501
   ```

#### Additional ML Scripts
- **Model Inference CLI (`ml/Predict.py`):** Runs predictions on a test image. Customize `test.jpg` and execute with:
  ```bash
  python ml/Predict.py
  ```
- **Model Training (`ml/Train.py`):** Retrains the classifier. Run with:
  ```bash
  python ml/Train.py
  ```

