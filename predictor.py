import sys
import json
import pickle

# Load input data from command line argument
input_data = json.loads(sys.argv[1])

encoding = {
    0: 'PRIMARY HYPORHYROID',
    1: 'SECONDARY HYPOTHYROID',
    2: 'COMPENSATED HYPOTHYROID',
    3: 'Hypothyroid',
    4: 'Hyperthyroid',
    5: 'NEGATIVE'
}

def cleaning(input_data):
    if input_data["TSH"] == "":
        input_data["TSH"] = 2.875
    if input_data["T3"] == "":
        input_data["T3"] = 1.25
    if input_data["TT4"] == "":
        input_data["TT4"] = 105
    if input_data["FTI"] == "":
        input_data["FTI"] = 97.5
    return input_data

input_data = cleaning(input_data)

# Extracting values from the dictionary and creating a list
input_list = [
    input_data["age"], input_data["gender"], input_data["on thyroxine"], 
    input_data["on antithyroid medication"], input_data["sick"],
    input_data["pregnant"], input_data["thyroid surgery"],
    input_data["I131 treatment"], input_data["lithium"],
    input_data["goitre"], input_data["tumor"], input_data["hypopituitary"],
    input_data["psych"], input_data["TSH"], input_data["T3"],
    input_data["TT4"], input_data["FTI"]
]

with open("xgmodel.pkl", "rb") as model_file:
    model = pickle.load(model_file)

# Assuming the model expects input as a list
# Make predictions using the model
y_pred = model.predict([input_list])

resulting = [encoding[i] for i in y_pred]
received = {"condition": resulting[0]}

print(json.dumps(received))
