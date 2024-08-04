def main():
    plate= input("Plate: ")
    if is_valid(plate):
        print("Valid")
    else:
        print("Invalid")
        
def is_valid(s):
    validity= True
    count_digit = 0
    if(len(s) < 2 or len(s) > 6 ):
        validity = False
        return validity
    if(s[0].isdigit() or s[1].isdigit()):
        validity = False
        return validity
    for char in s:
        if(not char.isalnum()):
            validity = False
            return validity
        if(count_digit > 1 and char.isalpha()):
            validity = False
            return validity
        if(char.isdigit()):
            count_digit += 1
        if(count_digit == 1 and char == "0"):
            validity = False
            return validity
    return validity

main()
