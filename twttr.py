def remove_vowels(text):
    vowels="AEIOUaeiou"
    result=""
    for char in text:
        if char not in vowels:
            result+=char
    return result
user_input=input("Input:")
output=remove_vowels(user_input)
print(output)
