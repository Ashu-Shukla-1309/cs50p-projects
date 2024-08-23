import pytest
from working import convert

def test_valid_cases():
    assert convert("9 AM to 5 PM") == "09:00 to 17:00"
    assert convert("9:00 AM to 5:00 PM") == "09:00 to 17:00"
    assert convert("10 AM to 8:50 PM") == "10:00 to 20:50"
    assert convert("10:39 PM to 8:00 AM") == "22:39 to 08:00"

def test_invalid_cases():
    with pytest.raises(ValueError):
        convert("9:60 AM to 5:08 PM")
    with pytest.raises(ValueError):
        convert("9 AM - 5 PM")
    with pytest.raises(ValueError):
        convert("09:00 AM - 17:00 PM")
    with pytest.raises(ValueError):
        convert("8:60 AM to "4:60 PM")
