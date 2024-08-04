def main():
    plate= input("Plate: ")
    if is_valid(plate):
        print("Valid")
    else:
        print("Invalid")
def is_valid(s):
    if 6>=len(s)>=2:
        if s.isalpha():
            return True
        elif s.alnum() and s[0:2].isalpha():
            for char in s:
                if char.isdidgit():
                    index=s.index(char)
                    if s[index:].isdigit() and int(char)!=0:
                        return True
                    else:
                        return False
if __name__=="__main__":
    main()
