import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_squared_error
from transformers import TFDistilBertModel, DistilBertTokenizer
from tensorflow.keras.layers import Input, Dense, Dropout, GlobalAveragePooling1D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import MeanSquaredError


data = pd.read_csv("car_emission_data.csv")

data['Engine Specs'] = pd.to_numeric(data['Engine Specs'], errors='coerce')


data['Engine Specs'] = data['Engine Specs'].astype(float)


label_encoders = {}
categorical_cols = ["Transportation Mode", "Make", "Model", "Fuel Type", "Traffic Information", "Road Types"]
for col in categorical_cols:
    label_encoders[col] = LabelEncoder()
    data[col] = label_encoders[col].fit_transform(data[col])


X = data.drop(columns=["Estimated CO2 Emissions (g/km) for trip"])
y = data["Estimated CO2 Emissions (g/km) for trip"]


imputer = SimpleImputer(strategy="mean")
X_imputed = imputer.fit_transform(X)


scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)


X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)


tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
bert_model = TFDistilBertModel.from_pretrained('distilbert-base-uncased')


max_length = 127
input_texts_train = [str(row) for row in X_train]
input_texts_test = [str(row) for row in X_test]

input_ids_train = tokenizer(input_texts_train, padding=True, truncation=True, return_tensors="tf")["input_ids"]
attention_masks_train = tokenizer(input_texts_train, padding=True, truncation=True, return_tensors="tf")["attention_mask"]

input_ids_test = tokenizer(input_texts_test, padding=True, truncation=True, return_tensors="tf")["input_ids"]
attention_masks_test = tokenizer(input_texts_test, padding=True, truncation=True, return_tensors="tf")["attention_mask"]


input_ids_input = Input(shape=(max_length,), dtype='int32', name='input_ids')
attention_masks_input = Input(shape=(max_length,), dtype='int32', name='attention_masks')

bert_output = bert_model([input_ids_input, attention_masks_input])[0]
pooling_output = GlobalAveragePooling1D()(bert_output)
dense_layer = Dense(64, activation='relu')(pooling_output)
dropout_layer = Dropout(0.2)(dense_layer)
output_layer = Dense(1, activation='linear')(dropout_layer)

model = Model(inputs=[input_ids_input, attention_masks_input], outputs=output_layer)
model.compile(optimizer=Adam(), loss=MeanSquaredError())


history = model.fit(
    [input_ids_train, attention_masks_train],
    y_train,
    epochs=5,
    batch_size=32,
    validation_split=0.2
)


y_pred = model.predict([input_ids_test, attention_masks_test])
mse = mean_squared_error(y_test, y_pred)
print("Mean Squared Error:", mse)
