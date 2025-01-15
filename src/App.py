from flask import Flask, jsonify
from flask_cors import CORS
from garminconnect import Garmin
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})# Restriction des origines

# Identifiants Garmin (à remplacer par des variables d'environnement)
email = os.getenv('GARMIN_EMAIL', 'clarkybrian@outlook.fr')
password = os.getenv('GARMIN_PASSWORD', '0106-YouDja')

@app.route('/api/fitness-data', methods=['GET'])
def get_fitness_data():
    try:
        # Connexion au client Garmin
        client = Garmin(email, password)
        client.login()

        # Définir la date actuelle
        today_date = datetime.now().strftime("%Y-%m-%d")
        
        heart_rate_data, calories_burned, stress_level = {}, "N/A", "N/A"
        
        # Récupération de la fréquence cardiaque actuelle
        try:
            heart_rate = client.get_heart_rates(today_date)
            heart_rate_values = heart_rate.get('heartRateValues', [])

            if heart_rate_values:
                last_entry = heart_rate_values[-1]  # Dernière mesure
                timestamp_ms = last_entry[0]  # Timestamp en millisecondes
                current_heart_rate = last_entry[1]  # Valeur de la fréquence cardiaque

                # Convertir le timestamp en format lisible
                timestamp = datetime.fromtimestamp(timestamp_ms / 1000)
                heart_rate_data = {
                    "currentHeartRate": current_heart_rate,
                    "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S")
                }
                print(f"Dernière donnée de fréquence cardiaque : {current_heart_rate} bpm (mesurée à {timestamp})")
            else:
                heart_rate_data = {"currentHeartRate": "99", "timestamp": "N/A"}
        except Exception as e:
            heart_rate_data = {"error": f"Erreur lors de la récupération de la fréquence cardiaque : {e}"}

        # Récupération des calories brûlées
        try:
            stats = client.get_stats(today_date)
            calories_burned = stats.get("totalKilocalories", "N/A")
            print(f"Dernière donnée de calories : {calories_burned}")
        except Exception as e:
            calories_burned = f"Erreur : {e}"

        # Récupération du niveau de stress
        try:
            stress_data = client.get_all_day_stress(today_date)
            
            # Vérifier si 'stressValuesArray' contient des données
            stress_values_array = stress_data.get('stressValuesArray', [])
            
            if stress_values_array:
                # Récupérer la dernière entrée
                latest_entry = stress_values_array[-1]
                timestamp_ms = latest_entry[0]
                stress_level = latest_entry[1]

                
                print(f"Dernière donnée de stress : {stress_level}")
        except Exception as e:
            stress_level = f"Erreur : {e}"

        # Préparer la réponse
        response = {
            "heartRate": heart_rate_data,
            "caloriesBurned": calories_burned,
            "stressLevel": stress_level
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
