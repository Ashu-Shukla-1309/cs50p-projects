camelcase=input("Camelcase=")
for i in camelcase:
    if i.isupper():
        print(i,end="_")
    else:
        print(i,end="")
