import pip
def emojize_input(input_str):
    return emoji.emojize(input_str,language='alias')
if __name__=="__main__":
    user_input=input("Input:")
    output=emojize_input(user_input)
    print("Output:",output)

