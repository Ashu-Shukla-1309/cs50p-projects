import inflect
import sys
p = inflect.engine()
names=[]
while True:
    try:
        name=input()
        names.append(name)
    except EOFError:
        print()
        break
print("Adieu, adieu, to "+p.join(names))
