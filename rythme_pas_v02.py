from garminconnect import Garmin
from datetime import datetime

# Remplacez par vos identifiants Garmin
email = "clarkybrian@outlook.fr"
password = "0106-YouDja"

def afficher_donnees_essentielles():
    try:
        # Connexion au client Garmin
        client = Garmin(email, password)
        client.login()

        # Définir la date et l'heure actuelle
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"Requête effectuée à : {current_time}")

        # Fréquence cardiaque actuelle
        try:
            heart_rate = client.get_heart_rates(current_time)  # Utiliser l'heure exacte

            # Extraire les valeurs de fréquence cardiaque
            heart_rate_values = heart_rate.get('heartRateValues', [])

            if heart_rate_values:
                last_entry = heart_rate_values[-1]  # Dernière mesure
                timestamp_ms = last_entry[0]  # Timestamp en millisecondes
                current_heart_rate = last_entry[1]  # Valeur de la fréquence cardiaque

                # Convertir le timestamp en format lisible
                timestamp = datetime.fromtimestamp(timestamp_ms / 1000)
                print(f"Fréquence cardiaque actuelle : {current_heart_rate} bpm (mesurée à {timestamp})")
            else:
                print("Aucune donnée de fréquence cardiaque disponible.")

        except Exception as e:
            print(f"Erreur lors de la récupération de la fréquence cardiaque : {e}")

        # Calories brûlées
        try:
            stats = client.get_stats(current_time)  # Utiliser l'heure exacte
            calories_burned = stats.get("totalKilocalories", None)
            print(f"Calories brûlées aujourd'hui : {calories_burned} kcal")
        except Exception as e:
            print(f"Erreur lors de la récupération des calories brûlées : {e}")

        # Niveau de stress
        try:
            # Générer la date actuelle au format attendu
            cdate = datetime.now().strftime("%Y-%m-%d")
            
            # Récupérer les données de stress pour la date actuelle
            stress_data = client.get_all_day_stress(cdate)
            
            # Vérifier si 'stressValuesArray' contient des données
            stress_values_array = stress_data.get('stressValuesArray', [])
            if stress_values_array:
                # Récupérer la dernière entrée
                latest_entry = stress_values_array[-1]
                timestamp_ms = latest_entry[0]
                stress_level = latest_entry[1]

                # Convertir le timestamp en format lisible
                timestamp = datetime.fromtimestamp(timestamp_ms / 1000).strftime("%Y-%m-%d %H:%M:%S")
                print(f"Dernière donnée de stress : {stress_level} (mesurée à {timestamp})")
            else:
                print("Aucune donnée de stress disponible.")
        except Exception as e:
            print(f"Erreur lors de la récupération des données de stress : {e}")


    except Exception as e:
        print(f"Erreur lors de la récupération des données : {e}")

if __name__ == "__main__":
    afficher_donnees_essentielles()
