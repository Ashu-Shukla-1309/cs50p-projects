import pytest
from working import convert
def test_valid_times():
    assert convert("9:00 AM to 5:00 PM")=="09:00 to 17:00"
    assert convert("9 AM to 5 PM")=="09:00 to 17:00"
    assert convert("9 AM to 5:00 PM")=="09:00 to 17:00"
    assert convert("12:00 PM to 5:00 AM ")=="12:00 to 05:00"
def test_invalid_format():
    with pytest.raises(ValueError):
        convert("09:00AM to 5:00PM")
    with pytest.raises(ValueError):
        convert("9:00 to 5:00")
    with pytest.raises(ValueError):
        convert("9:00 AM -5:00 PM")
    with pytest.raises(ValueError):
        convert("9:00 am to 5:00 pm")
def test_invalid_times():
    with pytest.raises(ValueError):
        convert("13:00 AM to 5:00 PM")
    with pytest.raises(ValueError):
        convert("9:00 AM to 55:00 PM")
    with pytest.raises(ValueError):
        convert("9:00 AM -5:60 PM")
