def main():
    Greeting=input("Say a greeting: ").lower().strip()
    if "hello" in Greeting:
        print("$0")
    elif "h"==Greeting[0][0] and Greeting[0]!="hello":
        print("$20")
    else:
        print("$100")
main()
