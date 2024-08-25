from datetime import date
import seasons
def test_calculate_age_in_minutes():
    assert seasons.calculate_age_in_minutes(date(2000, 1, 1), date(2020, 1, 1)) == 10540800
    assert seasons.calculate_age_in_minutes(date(1990, 6, 15), date(2024, 6, 15)) == 17971200
def test_convert_number_to_words():
    assert seasons.convert_number_to_words(525600) == "five hundred twenty-five thousand six hundred"
    assert seasons.convert_number_to_words(1440) == "one thousand four hundred forty"
if __name__ == "__main__":
    test_calculate_age_in_minutes()
    test_convert_number_to_words()
    print("All tests passed!")
