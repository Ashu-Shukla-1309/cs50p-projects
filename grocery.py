dict1={}
while True:
    try:
        input1=input("Enter your items")
        if input1="":
            break
        input1=input1.upper()

    except EOFError:
        print()
        break
    if input1 in dict1:
        dict1[input1]+=1
    else:
        dict1[input1]=1
for input1 in sorted(dict1.keys()):
    print(dict1[input1],input1)
