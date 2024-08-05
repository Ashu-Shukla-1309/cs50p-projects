lst=[]
while True:
    try:
        x=input().title()
        if x not in dict():
            pass
        else:
            lst.append(dict.get(x))
            print(f"${sum(lst):.2f}")
    except EOFError:
        break

