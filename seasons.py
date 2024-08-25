from datetime import date
import inflect
import sys

def main():
    birth_date = input("Enter your date of birth (YYYY-MM-DD): ")
    try:
        birth_date = date.fromisoformat(birth_date)
    except ValueError:
        sys.exit("Invalid date format. Please use YYYY-MM-DD.")

    today = date.today()
    age_in_minutes = calculate_age_in_minutes(birth_date, today)
    age_in_words = convert_number_to_words(age_in_minutes)
    print(f"{age_in_words.capitalize()} minutes")

def calculate_age_in_minutes(birth_date, today):
    delta = today - birth_date
    return delta.days * 24 * 60

def convert_number_to_words(number):
    p = inflect.engine()
    return p.number_to_words(number, andword="")

if __name__ == "__main__":
    main()
