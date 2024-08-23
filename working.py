import re
def main():
    print(convert(input("Hours: ")))
def convert(s):
    Format=re.search(r"^(([0-9][0-2]*):*([0-5][0-9])*)([A-P]M) to (([0-9][0-2])*:*([0-5][0-9])*)([A-P]M)$",s)
    if Format:
        cookies=Format.groups()
        if int(cookies[1])>12 or int(cookies[5])>12:
            raise ValueError
        first=new_Format(cookies[1],cookies[2],cookies[3])
        second=new_Format(cookies[5],cookies[6],cookies[7])
        return first + ' to '+ second
    else:
        raise ValueError
def new_Format(hour,minute,am_pm):
    if am_pm=="PM":
        if int(hour)==12:
            new_hour=12
        else:
            new_hour=12+int(hour)
    else:
        if int(hour)==12:
            new_hour=0
        else:
            new_hour=int(hour)
    if minute==None:
        new_minute=":00"
        time=f"{new_hour:02}"+new_minute
    else:
        time=f"{new_hour:02}"+":"+minute
    return time

if __name__ == "__main__":
    main()
