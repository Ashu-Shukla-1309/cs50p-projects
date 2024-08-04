def main():
    text=input("")
    output=remove_vowels(text)
    print(output)
def remove_vowels(text):
    vowels="AEIUOaeiou"
    result=""
    for char in vowels:
        result+=char
        return result
main()
