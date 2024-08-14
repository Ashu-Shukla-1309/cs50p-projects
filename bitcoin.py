import sys
import requests
if len(sys.argv)== 2:
    url="https://api.coindesk.com/v1/bpi/currentprice.json"
    try:
        request=requests.get("url")
        json_request=request.json()
        n=float(sys.argv[1])
    except ValueError:
        sys.exit("Command line argument is not a number")
    except requests.RequestException:
        print("HTTP request failed")
    else:
        coin=json_request['bpi']['USD']['rate_float']
        Total=n*coin
        print(f"${Total:,.4f}")
else:
    sys.exit("missing command line argument")
