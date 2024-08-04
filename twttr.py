def main():
    text=input("")
    output=remove_vowels(text)
    print(output)
def remove_vowels(text):
    vowels="AEIOUaeiou"
    result=""
    for char in text:
        if char not in vowels:
            result+=char
    return result
if__name="__main__":
    main()
