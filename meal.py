def main():
    time=input("What time is it?")
    answer=convert(time)
    if answer>=7 and answer<=8:
        print("breakfast time")
    if answer>=12 and answer<=13:
        print("lunch time")
    if answer>=18 and answer<=19:
        print("dinner time")
def convert(time):
    hours,minutes=time.split(":")
    minute=float(minutes)/60
    return float(hours)+minute
if __name__ == "__main__":
    main()
