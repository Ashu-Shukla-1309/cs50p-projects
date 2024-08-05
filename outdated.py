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
    date=input("Date:")
    try:
        month,day,year=date.split("/")
        if 1<=int(month)<=12 or 1<=int(day)<=31:
            break
    except ValueError:
        try:
            old_month,old_day,year=date.split(" ")
            for i in range(len(months)):
                if old_month==months[i]:
                    month=i+1
            day=old_day.replace(",","")
            if 1<=int(month)<=12 or 1<=int(day)<=31:
                break
        except:
            print()
            pass
print(f"{year}-{int(month):02}-{int(day):02}")
