from project import calculate_feels_like_temperature, suggest_clothing, get_weather
def test_calculate_feels_like_temperature():
    cold_weather_data = {"main": {"feels_like": 5}}
    assert calculate_feels_like_temperature(cold_weather_data) == 5
    mild_weather_data = {"main": {"feels_like": 15.5}}
    assert calculate_feels_like_temperature(mild_weather_data) == 15.5
    hot_weather_data = {"main": {"feels_like": 28.7}}
    assert calculate_feels_like_temperature(hot_weather_data) == 28.7
def test_suggest_clothing():
    assert "Bundle up!" in suggest_clothing(5)
    assert "light jacket" in suggest_clothing(15)
    assert "Enjoy the sunshine!" in suggest_clothing(25)
def test_get_weather():
    city = "London"
    weather_data = get_weather(city)
    assert weather_data is not None
if __name__ == "__main__":
    pass
