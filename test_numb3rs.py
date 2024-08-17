from numb3rs import validate
def main():
    test_ip_true()
    test_ip_false()
def test_ip_true():
    assert validate("123.123.123.123")==True
    assert validate("12.13.34.123")==True
def test_ip_false():
    assert validate("2236.123.123.123")==False
    assert validate("cat")==False
if __name__ == "__main__":
    main()
