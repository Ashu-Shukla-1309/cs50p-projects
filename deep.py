def main():
    Question=input("What is the Answer to the Great Question of Life, the Universe and Everything?").lower().strip()
    def check_answer(Question):
        if Question=="42" or Question=="forty two" or Question=="forty-two":
            print("Yes")
        else:
            print("No")
main()
