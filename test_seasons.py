from datetime import date
import seasons

def test_calculate_age_in_minutes():
    assert seasons.calculate_age_in_minutes(date(2000, 1, 1), date(2020, 1, 1)) == 10540800
    assert seasons.calculate_age_in_minutes(date(1990, 6, 15), date(2024, 6, 15)) == 17971200

def test_convert_number_to_words():
    assert seasons.convert_number_to_words(525600) == "five hundred twenty-five thousand six hundred"
    assert seasons.convert_number_to_words(1440) == "one thousand four hundred forty"

def test_output_format():
    birth_date = date(2000, 1, 1)
    today = date(2020, 1, 1)
    age_in_minutes = seasons.calculate_age_in_minutes(birth_date, today)
    age_in_words = seasons.convert_number_to_words(age_in_minutes)
    output = f"{age_in_words.capitalize()} minutes"
    assert output == "Ten million five hundred forty thousand eight hundred minutes"

if __name__ == "__main__":
    try:
        test_calculate_age_in_minutes()
        test_convert_number_to_words()
        test_output_format()
        print("All tests passed!")
        exit(0)
    except AssertionError as e:
        print(f"Test failed: {e}")
        exit(1)
