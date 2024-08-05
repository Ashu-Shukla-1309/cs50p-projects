dict1={}
while True:
    try:
        input=input("Enter your items").upper()
    except EOFError:
        print()
        break
    if input in dict1:
        dict1[input]+=1
    else:
        dict1[input]=1
for input in sorted(dict1.keys()):
    print(dict1[input],input)


