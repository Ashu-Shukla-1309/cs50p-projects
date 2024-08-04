amoununt_due=50
change_owed=0
while amount_due>0:
    print(amount_due)
    coin=int(input("Enter the coin: "))
    if coin==25 or coin==10 or coin==5:
        amount_due-=coin
        print(amount_due)
    if amount_due<=0:
        change_owed-=amount_due
        print(change_owed)
