import random
def get_level():
    while True:
        try:
            level = int(input("Enter level (1, 2, or 3): "))
            if level in [1, 2, 3]:
                return level
        except ValueError:
            pass
        print("Invalid level. Please enter 1, 2, or 3.")
def generate_integer(level):
    if level == 1:
        return random.randint(0, 9)
    elif level == 2:
        return random.randint(10, 99)
    elif level == 3:
        return random.randint(100, 999)
    else:
        raise ValueError("Invalid level")
def main():
    level = get_level()
    score = 0
    for _ in range(10):
        x = generate_integer(level)
        y = generate_integer(level)
        answer = x + y
        attempts=0
        while attempts<3:
            try:
                user_answer = int(input(f"{x} + {y} = "))
                if user_answer == answer:
                    score += 1
                    break
                else:
                    print("EEE")
            except ValueError:
                print("EEE")
            attempts+=1
        if attempts==3:
            print(f"The correct answer is {answer}.")
    print(f"Your score: {score}/10")
if __name__ == "__main__":
    main()
