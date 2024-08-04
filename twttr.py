def main():
    text=input("")
    result=remove_vowels(text)
    print(result)
def remove_vowels(text):
    vowels="AEIUOaeiou"
    result=""
    for char in vowels:
        result+=char
main()
