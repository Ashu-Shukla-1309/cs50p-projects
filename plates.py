def main():
    plate = input("Plate: ")
    if is_valid(plate):
        print("Valid")
    else:
        print("Invalid")


def is_valid(s):
    if 6<=len(s)>=2 and s[0:2].isalpha() and s.isalnum:
        for char in s:
            if char.isdidgit():
                index=s.index(char)
                return True
            else:
                return False
        return True
main()
