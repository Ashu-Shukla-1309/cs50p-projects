def main():
    text=input("Enter a smiley or sad face")
    def emoji(text1):
        return text1.replace(":)","🙂").replace(":(","🙁")
    emoji(text)
main()
