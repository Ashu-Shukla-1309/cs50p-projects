camelcase=input("Camelcase=")
for i in camelcase:
    if i.isupper():
        print("_"+i.lower(),end="")
    else:
        print(i,end="")
