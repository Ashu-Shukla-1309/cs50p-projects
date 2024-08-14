import sys
import requests
if len(sys.argv) != 2:
    print("Usage: python bitcoin.py <amount>")
    sys.exit(1)
try:
    amount = float(sys.argv[1])
except ValueError:
    print("Amount must be a number")
    sys.exit(1)
try:
    response = requests.get("https://api.coindesk.com/v1/bpi/currentprice.json")
    response.raise_for_status()
    data = response.json()
    price = data["$"]["bpi"]["rate_float"]
    total_cost = amount * price
    print(f"{total_cost:,.4f} USD")
except requests.RequestException as e:
    print(f"Error fetching data: {e}")
    sys.exit(1)
