import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.impute import SimpleImputer

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

# Split data into features and target
X = data.drop(columns=["Estimated CO2 Emissions (g/km) for trip"])
y = data["Estimated CO2 Emissions (g/km) for trip"]

# Impute missing values
imputer = SimpleImputer(strategy="mean")
X_imputed = imputer.fit_transform(X)

# Normalize numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train a Random Forest Regressor model
model = RandomForestRegressor(random_state=42)
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
print("Mean Squared Error:", mse)