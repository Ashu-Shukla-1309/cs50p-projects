from working import convert
import pytest
def main():
    wrong_Format()
    test_time()
    wrong_hour()
    wrong_minute()
def wrong_Format():
    with pytest.raises(ValueError):
        convert("9 AM - 9 PM")
def test_time():
    assert convert("9 AM to 5 PM")=="9:00 to 17:00"
    assert convert("10 PM to 8 AM")=="22:00 to 08:00"
    assert convert("10:30 PM to 8:50 AM")=="22:30 to 08:50"
def wrong_hour():
    with pytest.raises(ValueError):
        convert("13 PM to 17 PM")
def wrong_minute():
    with pytest.raises(ValueError):
        convert("9:60 AM to 9:60 PM")

