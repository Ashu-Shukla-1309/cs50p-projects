import re

def convert(s):
    # Regular expression to match the time format
    match = re.match(r"(\d{1,2}):(\d{2}) (AM|PM) to (\d{1,2}):(\d{2}) (AM|PM)", s)
    if not match:
        raise ValueError("Invalid time format")

    # Extracting parts
    start_hour, start_minute, start_period, end_hour, end_minute, end_period = match.groups()

    # Convert start time to 24-hour format
    start_hour = int(start_hour)
    if start_period == 'PM' and start_hour != 12:
        start_hour += 12
    elif start_period == 'AM' and start_hour == 12:
        start_hour = 0

    # Convert end time to 24-hour format
    end_hour = int(end_hour)
    if end_period == 'PM' and end_hour != 12:
        end_hour += 12
    elif end_period == 'AM' and end_hour == 12:
        end_hour = 0

    # Format time strings with leading zeros if necessary
    start_time = f"{start_hour:02}:{start_minute}"
    end_time = f"{end_hour:02}:{end_minute}"

    # Return the converted time
    return f"{start_time} to {end_time}"
user_input=input("Hours: ")
print(convert(user_input))


