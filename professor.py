import random
def get_level():
    while True:
        try:
            level = int(input("Enter level (1, 2, or 3): "))
            if level in [1, 2, 3]:
                return level
        except ValueError:
            continue
        if level in [1, 2, 3]:
            return level
        continue
def generate_integer(level):
    if level == 1:
        num=random.randint(0, 9)
    elif level == 2:
        num=random.randint(10, 99)
    elif level == 3:
        num=random.randint(100, 999)
    else:
        raise ValueError("Invalid level")
    return num
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
            except ValueError:
                print("EEE")
                attempts+=1
            else:
                if user_answer == answer:
                    score += 1
                    break
                else:
                    print("EEE")
                    attempts+=1
                    continue
        if attempts>=3:
            print(f"The correct answer is {answer}.")
    print(f"Your score: {score}")
if __name__ == "__main__":
    main()
