def main():
    x,y,z=input("Enter expressions").split()
    x=float(x)
    z=float(z)
    if y=="+":
        result=x+z
    elif y=="-":
        result=x-z
    elif y=="/":
        result=x/z
    else:
        result=x*z
    print(round(result,1))
main()
