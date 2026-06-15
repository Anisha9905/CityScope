from ultralytics import YOLO
model = YOLO("best.pt")

results = model.predict("test.jpg")

for r in results:
    probs = r.probs.data.tolist()
    names = model.names
    for i, p in enumerate(probs):
        print(f"{names[i]}: {p:.2f}")
