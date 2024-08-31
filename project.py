import requests
def get_weather(city):
    api_key = "69e533043ebebcc924926eace2befca1"
    base_url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": city,
        "units": "metric",
        "appid": api_key,
    }
    try:
        response = requests.get(base_url, params=params)
        data = response.json()
        return data
    except requests.RequestException:
        return None
def calculate_feels_like_temperature(weather_data):
    return weather_data.get("main", {}).get("feels_like", 0)
def suggest_clothing(feels_like_temp):
    if feels_like_temp < 10:
        return f"Bundle up! It's chilly out there. Current temperature: {feels_like_temp:.1f}°C"
    elif feels_like_temp < 20:
        return f"A light jacket should do the trick. Current temperature: {feels_like_temp:.1f}°C"
    else:
        return f"Enjoy the sunshine! Dress comfortably. Current temperature: {feels_like_temp:.1f}°C"
def display_additional_conditions(weather_data):
    cloudiness = weather_data.get("clouds", {}).get("all", 0)
    wind_speed = weather_data.get("wind", {}).get("speed", 0)
    humidity = weather_data.get("main", {}).get("humidity", 0)
    print(f"Cloudiness: {cloudiness}%")
    print(f"Wind Speed: {wind_speed} m/s")
    print(f"Humidity: {humidity}%")
def main():
    city = input("Enter a city name: ")
    weather_data = get_weather(city)
    if weather_data:
        feels_like_temp = calculate_feels_like_temperature(weather_data)
        recommendation = suggest_clothing(feels_like_temp)
        print(recommendation)
        display_additional_conditions(weather_data)
    else:
        print("Oops! Something went wrong. Check your city name or API key.")
if __name__ == "__main__":
    main()
