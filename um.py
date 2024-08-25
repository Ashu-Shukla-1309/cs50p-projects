import re
def main():
    print(count(input("Text: ")).strip())
def count(s):
    pattern=r"\bum\b"
    match=re.findall(pattern,s,re.IGNORECASE)
    return len(match)
if __name__ == "__main__":
    main()

