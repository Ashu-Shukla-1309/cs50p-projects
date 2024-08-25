from um import count
def test_single_um():
    assert um.count("um") == 1

def test_multiple_ums():
    assert um.count("um, um, um") == 3

def test_um_in_word():
    assert um.count("yummy") == 0

def test_um_with_punctuation():
    assert um.count("Um, I think um this is an example.") == 2

def test_um_case_insensitive():
    assert um.count("UM um Um") == 3

if __name__ == "__main__":
    test_single_um()
    test_multiple_ums()
    test_um_in_word()
    test_um_with_punctuation()
    test_um_case_insensitive()
    print("All tests passed!")
