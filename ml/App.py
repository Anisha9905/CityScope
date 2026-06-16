import streamlit as st
from ultralytics import YOLO
from PIL import Image

import os

@st.cache_resource
def load_model():
    model_path = os.path.join(os.path.dirname(__file__), "best.pt")
    return YOLO(model_path)

model = load_model()

department_map = {
    "Flood": "Department of Water Resources",
    "Garbage": "Ministry of Housing and Urban Affairs",
    "Pothole Issues": "Public Works Department (PWD)",
    "Water Logging": "Municipal Water Management",
    "signal Broken": "Traffic Management Department",
    "street light Pole": "Electricity Board"
}

# Only calculate severity for these classes
severity_classes = ["Garbage", "Pothole Issues", "street light Pole"]

def get_severity(confidence):
    if confidence < 0.4:
        return "Low"
    elif confidence < 0.7:
        return "Medium"
    else:
        return "High"

st.set_page_config(page_title="Civic Issue Classifier", page_icon="🏙", layout="wide")

# Header (same as before)
st.markdown(
    """
    <style>
    .gradient-header { background: linear-gradient(90deg, #3a8ce0, #2ebf91); padding: 40px 20px; border-radius: 12px; text-align: center; color: white; margin-bottom: 30px; }
    .gradient-header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .gradient-header p { font-size: 1.2rem; margin: 0; }
    .stCard { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
    </style>
    """,
    unsafe_allow_html=True
)

st.markdown(
    """
    <div class="gradient-header">
        <h1>🏙 Civic Issue Classifier</h1>
        <p>Upload a civic issue photo and AI will classify it & assign the correct department.</p>
    </div>
    """,
    unsafe_allow_html=True
)

uploaded_file = st.file_uploader("📷 Upload an Image", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    st.markdown('<div class="stCard">', unsafe_allow_html=True)
    img = Image.open(uploaded_file)
    st.image(img, caption="Uploaded Image", use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

    results = model(img)
    probs = results[0].probs.data.tolist()

    st.markdown('<div class="stCard">', unsafe_allow_html=True)
    st.subheader("📊 Prediction Probabilities")
    for i, p in enumerate(probs):
        st.write(f"{model.names[i]}** → {p*100:.2f}%")
    st.markdown('</div>', unsafe_allow_html=True)

    top_class = int(results[0].probs.top1)
    confidence = float(results[0].probs.top1conf)
    predicted_class = model.names[top_class]
    assigned_department = department_map.get(predicted_class, "General Civic Department")

    st.markdown('<div class="stCard">', unsafe_allow_html=True)
    st.success(f"👉 Final Prediction: *{predicted_class}* ({confidence*100:.2f}% confidence)")
    st.info(f"📌 Assigned Department: *{assigned_department}*")

    # Severity calculation for selected classes
    if predicted_class in severity_classes:
        severity = get_severity(confidence)
        st.warning(f"⚠ *Severity Level:* {severity}")
    st.markdown('</div>', unsafe_allow_html=True)

st.markdown("---")
st.caption("Powered by AI-driven Civic Issue Classifier")