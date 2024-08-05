while True:
    fuel=input("Fraction:")
    try:
        numerator,denominator=fuel.split("/")
        numerator1=int(numerator)
        denominator1=int(denominator)
        percentage=numerator1/denominator1
        if percentage<1:
            break
    except(ValueError,ZeroDivisionError):
        pass
f=percentage*100.round()
if f<=1:
    print("E")
elif f>=99:
    print("F")
else:
    print(f"{f}%")
