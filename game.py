import random
def get_level():
    while True:
        level = input("Level: ")
        if level.isdigit() and int(level) > 0:
            return int(level)
def get_guess():
    while True:
        guess = input("Guess: ")
        if guess.isdigit():
            return int(guess)
def main():
    level = get_level()
    target = random.randint(1, level)
    while True:
        guess = get_guess()
        if guess < target:
            print("Too small!")
        elif guess > target:
            print("Too large!")
        else:
            print("Just right!")
            break
if __name__ == "__main__":
    main()
