while True:
    fuel=input("Fraction:")
    try:
        X,Y=fuel.split("/")
        X1=int(X)
        Y1=int(Y)
        percentage=X1/Y1
        if percentage<=1:
            break
    except(ValueError,ZeroDivisionError):
        pass
f=percentage*100
k=round(f)
if k<=1:
    print("E")
elif k>=99:
    print("F")
else:
    print(f"{k}%")
