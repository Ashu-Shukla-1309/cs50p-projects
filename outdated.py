months=[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
while True:
    date=input("Date:").strip()
    if "/" in date:
        mon, day, year = date.split("/")
        if mon.isalpha()==True:
            continue
    elif "," in date:
        date=date.replace(",","")
        mon,day,year=date.split(" ")
        if mon in months:
            mon=months.index(mon)+1
        else:
            continue
    else:
        continue
    try:
        if int(mon)>12 or int(day)>31:
            continue
        else:
            break
    except EOFError:
        break
print(f"{year}-{int(mon):02}-{int(day):02}")
