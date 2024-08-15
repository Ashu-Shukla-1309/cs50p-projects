def main():
    test_values1()
    test_values2()
    test_values3()

def test_values1():
    assert values("hello")==0
    assert values("HELLO")==0
    assert values("hello")==0
def test_values2():
    assert values("hi")==20
    assert values("hiak")==20
def test_values3():
    assert values("cs50")==100
    assert values("50")==100
    assert values("what's up?")==100
if __name__ == "__main__":
    main()
