total=0
while True:
    try:
        item=input().title()
        if item in items:
            total+=items.get(item)
            print(f"${total:.2f}")
        else:
            pass
    except EOFError:
        break
