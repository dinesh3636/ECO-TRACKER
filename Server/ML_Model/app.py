from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
import joblib
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# Load the trained model
loaded_model = joblib.load('ann_model_1.joblib')

# Load label encoders and scalers used during training
label_encoders = joblib.load('label_encoders_1.joblib')
scaler = joblib.load('scaler_1.joblib')
imputer = joblib.load('imputer_1.joblib') 

# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/predict', methods=['POST'])

def predict():
    
    data = request.get_json() # receive json data from front end
    '''
    route_distance = float(data['distance'])
    route_duration = float(data['durationInMins'])
    transportation_mode = data['Transportation Mode']
    make = data['Make']
    model = data['Model']
    fuel_type = data['Fuel Type']
    engine_specs = float(data['Engine Specs'])
    fuel_efficiency = float(data['Fuel Efficiency (km/L)'])
    vehicle_co2_emissions = float(data["Vehicle CO2 Emissions (g/km)"])
    traffic_information = data['Traffic Information']
    elevation_data = float(data['Elevation Data (m)'])
    road_types = data['Road Types']


    # the following code should NOT be changed
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
    '''

    route_distance = float(data['a'])
    route_duration = float(data['b'])
    transportation_mode = data['c']
    make = data['d']
    model = data['e']
    fuel_type = data['f']
    engine_specs = float(data['g'])
    fuel_efficiency = float(data['h'])
    vehicle_co2_emissions = float(data["i"])
    traffic_information = data['j']
    elevation_data = float(data['k'])
    road_types = data['l']

    # road_types_available = ["Hill road", "Local road", "Highway"]
    # road_types= random.choice(road_types_available)
    # the following code should NOT be changed
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
    # print(prediction_result)
    return jsonify(float(prediction_result))

if __name__ == '__main__':
    app.run(debug=True)
