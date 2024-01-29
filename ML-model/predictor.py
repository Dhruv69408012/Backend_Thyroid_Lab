import sys
import json
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
input_data = json.loads(sys.argv[1])
current_working_directory = Path.cwd()

encoding = {
    0: 'PRIMARY HYPORHYROID',
    1: 'SECONDARY HYPOTHYROID',
    2: 'COMPENSATED HYPOTHYROID',
    3: 'Hypothyroid',
    4: 'Hyperthyroid',
    5: 'NEGATIVE'
}

def cleaning(df):
    df=df.replace(True,"t")
    df=df.replace(False,"f")
    df["TSH"] = pd.to_numeric(df["TSH"].replace("?", np.nan))
    df["T3"] = pd.to_numeric(df["T3"].replace("?", np.nan))
    df["TT4"] = pd.to_numeric(df["TT4"].replace("?", np.nan))
    df["FTI"] = pd.to_numeric(df["FTI"].replace("?", np.nan))
    df["gender"]=df["gender"].replace(["M","F"],[1,0])
    df["gender"]=pd.to_numeric(df["gender"].replace("?",np.nan))
    df = df.replace(["t"], 1)
    df = df.replace(["f"], 0)
    return df

try:
    model = joblib.load("./ML-model/xgmodel.pkl")
except FileNotFoundError:
    received = {"condition": "UNKNOWN_ERROR"}

df = pd.DataFrame([input_data])

df = cleaning(df)

try:
    y_pred = model.predict(df)
    resulting = [encoding[i] for i in y_pred]
    received = {"condition": resulting[0]}
except Exception as e:
    received = {"condition": "UNKNOWN_ERROR"}


print(json.dumps(received))
