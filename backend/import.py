import sys
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler

import numpy as np

# Load the trained model
model = joblib.load(r'C:\Users\IRA MAY\my-web-app\backend\poverty_classification_svm_model (5).pkl')  # Adjust path if needed

# Load the previously saved scaler and imputer from training (if they were saved separately)
scaler = joblib.load(r'C:\Users\IRA MAY\my-web-app\backend\scaler (2).pkl')  # Path to the scaler
#imputer = joblib.load(r'C:\Users\IRA MAY\my-web-app\backend\imputer.pkl')  # Path to the imputer

def process_input_data(input_data):
    # Feature names expected by the scaler
    feature_names = ['Monthly Income', 'Number of Family Members']  # Match training data
    
    # Convert input to DataFrame with feature names
    input_df = pd.DataFrame([input_data], columns=feature_names)

    # Standardize the input data using the saved scaler (from the training phase)
    input_array = scaler.transform(input_df)

    return input_array


def classify_poverty(income, family_size):
    # Classification rules and corresponding labels
    if income < 5000 and 5 <= family_size <= 10:
        return 0, "Poor"
    elif income < 10000 and 3 <= family_size <= 10:
        return 1, "Low-income"
    elif income >= 20000 and 3 <= family_size <= 10:
        return 2, "Middle"
    elif income >= 40000 and 3 <= family_size <= 10:
        return 3, "Upper-middle"
    elif income >= 100000 and 3 <= family_size <= 10:
        return 4, "Rich"
    else:
        return None, "Undefined"  # Undefined category

if __name__ == "__main__":
    # Get the arguments passed from the command line
    arguments = sys.argv[1:]

    # Extract 'Monthly Income' and 'Number of Family Members' from arguments
    income = float(arguments[5])  # Monthly Income
    family_size = int(arguments[7])  # Number of Family Members

    print(f"Arguments passed: {arguments}")
    print(f"Income: {income}, Family Size: {family_size}")

    # Process the input data
    input_data = [income, family_size]
    processed_data = process_input_data(input_data)

    # Make prediction using the model
    try:
        prediction = model.predict(processed_data)
        print(f"Model Prediction: {prediction[0]}")

        # Use classification rules for poverty classification
        poverty_class, poverty_label = classify_poverty(income, family_size)
        print(f"Poverty Classification: {poverty_class} - {poverty_label}")

    except Exception as e:
        print(f"Error: {e}")