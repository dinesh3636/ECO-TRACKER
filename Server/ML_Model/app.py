from flask import Flask, render_template, request
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
import joblib

app = Flask(__name__)

# Load the trained model
loaded_model = joblib.load('ann_model.joblib')

# Load label encoders and scalers used during training
label_encoders = joblib.load('label_encoders.joblib')
scaler = joblib.load('scaler.joblib')
imputer = joblib.load('imputer.joblib') 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    
    route_distance = float(request.form['route_distance'])
    route_duration = float(request.form['route_duration'])
    transportation_mode = request.form['transportation_mode']
    make = request.form['make']
    model = request.form['model']
    fuel_type = request.form['fuel_type']
    engine_specs = float(request.form['engine_specs'])
    fuel_efficiency = float(request.form['fuel_efficiency'])
    traffic_information = request.form['traffic_information']
    elevation_data = float(request.form['elevation_data'])
    road_types = request.form['road_types']
    vehicle_co2_emissions = request.form['Vehicle_co2_emissions']

    form_data = {
        'Route Distance (km)': [route_distance],
        'Route Duration (min)': [route_duration],
        'Transportation Mode': [transportation_mode],
        'Make': [make],
        'Model': [model],
        'Fuel Type': [fuel_type],
        'Engine Specs': [engine_specs],
        'Fuel Efficiency (km/L)': [fuel_efficiency],
        "Vehicle CO2 Emissions (g/km)": [vehicle_co2_emissions],
        'Traffic Information': [traffic_information],
        'Elevation Data (m)': [elevation_data],
        'Road Types': [road_types]
    }

    input_data = pd.DataFrame(form_data)

    for col in label_encoders:
        input_data[col] = label_encoders[col].transform(input_data[col])

    input_data_imputed = imputer.transform(input_data)

    input_data_scaled = scaler.transform(input_data_imputed)

    predictions = loaded_model.predict(input_data_scaled)

    prediction_result = predictions[0]

    return render_template('result.html', prediction=prediction_result)

if __name__ == '__main__':
    app.run(debug=True)
