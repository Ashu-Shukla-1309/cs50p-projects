while True:
    fuel=input("Fraction:")
    try:
        numerator,denominator=fuel.split("/")
        numerator=int(numerator)
        denominator=int(denominator)
        percentage=numerator/denominator
        if percentage<1:
            break
    except(ValueError,ZeroDivisionError):
        pass
f=percentage*100
if f<=1:
    print("E")
elif f>=99:
    print("F")
else:
    print(f"{f}%")
