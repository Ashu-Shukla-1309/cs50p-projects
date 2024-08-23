import re
def main():
    user_input=input("Hours: ")
    Convert=convert(user_input)
    print(Convert)
def convert(s):
    match = re.match(r"(\d{1,2}):(\d{2}) (AM|PM) to (\d{1,2}):(\d{2}) (AM|PM)", s)
    if not match:
        raise ValueError("Invalid time format)
    start_hour, start_minute, start_period, end_hour, end_minute, end_period = match.groups()
    start_hour = int(start_hour)
    if start_period == 'PM' and start_hour != 12:
        start_hour += 12
    elif start_period == 'AM' and start_hour == 12:
        start_hour = 0
    end_hour = int(end_hour)
    if end_period == 'PM' and end_hour != 12:
        end_hour += 12
    elif end_period == 'AM' and end_hour == 12:
        end_hour = 0
    start_time = f"{start_hour:02}:{start_minute}"
    end_time = f"{end_hour:02}:{end_minute}"
    return f"{start_time} to {end_time}"
if __name__ == "__main__":
    main()