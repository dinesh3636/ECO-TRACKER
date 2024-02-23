import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_squared_error
from sklearn.impute import SimpleImputer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
import joblib

# Load data
data = pd.read_csv("car_emission_data.csv")

data['Engine Specs'] = pd.to_numeric(data['Engine Specs'], errors='coerce')

# Convert to float
data['Engine Specs'] = data['Engine Specs'].astype(float)

# Encode categorical features
label_encoders = {}
categorical_cols = ["Transportation Mode", "Make", "Model", "Fuel Type", "Traffic Information", "Road Types"]
for col in categorical_cols:
    label_encoders[col] = LabelEncoder()
    data[col] = label_encoders[col].fit_transform(data[col])

# joblib.dump(label_encoders, 'label_encoders.joblib')

# Split data into features and target
X = data.drop(columns=["Estimated CO2 Emissions (g/km) for trip"])
y = data["Estimated CO2 Emissions (g/km) for trip"]

# Impute missing values
imputer = SimpleImputer(strategy="mean")
X_imputed = imputer.fit_transform(X)

# joblib.dump(imputer, 'imputer.joblib')

# Normalize numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)

# joblib.dump(scaler, 'scaler.joblib')

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Define the ANN model
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dropout(0.2),
    Dense(32, activation='relu'),
    Dropout(0.2),
    Dense(1)
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.006), loss='mean_squared_error')

# Train the model
history = model.fit(X_train, y_train, validation_split=0.2, epochs=30, batch_size=32, verbose=1)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Calculate mean squared error
mse = mean_squared_error(y_test, y_pred)
print("Mean Squared Error:", mse)

# joblib.dump(model, 'ann_model.joblib')