import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestClassifier

data = {
    "skill_count": [3,5,8,10,12,15,18,20],
    "project_count": [0,1,2,2,3,3,4,5],
    "experience": [0,0,1,1,1,1,1,1],
    "resume_length": [100,200,300,400,500,600,700,800],
    "keyword_density": [0.01,0.02,0.03,0.04,0.05,0.06,0.07,0.08],
    "section_score": [2,3,3,4,4,4,4,4],
    "quality": [0,0,1,1,2,2,2,2]
}

df = pd.DataFrame(data)

X = df.drop("quality", axis=1)
y = df["quality"]

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "resume_quality_model.pkl")
joblib.dump(model, MODEL_PATH)

print("✅ Model trained and saved")