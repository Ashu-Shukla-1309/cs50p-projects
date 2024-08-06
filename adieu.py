import inflect
import sys
p = inflect.engine()
names=[]
while True:
    try:
        input1=input()
        names.append(input)
    except EOFError:
        print()
        break
print("Adieu, adieu, to "+p.join(names))
