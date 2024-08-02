def main():
    dollars = dollars_to_float(input("How much was the meal? "))
    percent = percent_to_float(input("What percentage would you like to tip? "))
    tip = dollars * percent
    print(f"Leave ${tip:.2f}")


def dollars_to_float(d):
    # TODO
    d_without_sign=d.replace("$","")
    return float(d_without_sign)


def percent_to_float(p):
    # TODO
    perc=p.replace("%","")
    per=float(perc)/100
    return per


main()
