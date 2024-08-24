import re
import sys
def main():
    print(convert(input("Hours: ")))
def convert(s):
    pattern = r"^([0-9]{1,2}):?([0-9]{2})? (AM/PM) to ([0-9]{1,2}):?([0-9]{2})? (AM/PM)$"
    match=re.search(pattern,s)
    if not match:
        raise ValueError
    start_hour,start_minute,start_period,end_hour,end_minute,end_period=match.groups()
    start_hour,end_hour=int(start_hour),int(end_hour)
    start_minute=int(start_minute) if start_minute else 0
    end_minute=int(end_minute) if end_minute else 0
    if not (0<=start_minute<60 and 0<=end_minute<60):
        raise ValueError
    if not (1<=start_hour<=12 and 1<=end_hour<=12):
        raise ValueError
    if start_period=="AM":
        if start_hour==12:
            start_hour=0
    else:
        if start_hour!=12:
            start_hour+=12
    if start_period=="AM":
        if end_hour==12:
            end_hour=0
    else:
        if end_hour!=12:
            end_hour+=12
    return f"{start_hour:02}:{start_minute:02} to {end_hour:02}:{end_minute:02}"
if __name__ == "__main__":
    main()
