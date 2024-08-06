import inflect
p = inflect.engine()
names=[]
while True:
    try:
        input=input()
        names.append(input)
    except EOFError:
        print()
        break
print("Adieu, adieu, to "+p.join(names))
