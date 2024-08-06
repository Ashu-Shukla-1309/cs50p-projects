import inflect
p = inflect.engine()
names=[]
while True:
    try:
        input=input()
        inputs.append(input)
    except EOFError:
        print()
        break
print("Adieu, adieu, to "+p.join(names))
