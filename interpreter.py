def main():
    x,y,z=input("Enter expressions").split()
    x=float(x)
    z=float(z)
    match y:
        case"+":
            result=x+z
        case"-":
            result=x-z
        case"/":
            result=x/z
        case"*":
            result=x*z
        print(round(result,1))
main()
