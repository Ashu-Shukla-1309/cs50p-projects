import sys
import requests
if len(sys.argv)== 2:
    url="https://api.coindesk.com/v1/bpi/currentprice.json"
    try:
        response=requests.get("url")
        json_response=response.json()
        n=float(sys.argv[1])
    except ValueError:
        sys.exit("Command line argument is not a number")
    except requests.RequestException:
        print("HTTP request failed")
    else:
        coin_price=json_response['bpi']['USD']['rate_float']
        amount=n*coin_price
        print(f"${amount:,.4f}")
else:
    sys.exit("missing command line argument")
