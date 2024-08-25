from um import count
def test_empty():
    assert count("")==0
def test_substring():
    assert count("humm")==0
def test_um():
    assert count("humm um let's go")==1
def test_UM():
    assert count("humm UM is um good")==2
