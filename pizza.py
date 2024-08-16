from tabulate import tabulate
import sys
import csv
table=[]
if len(sys.argv)<2:
    sys.exit("Too few command line arguments")
elif len(sys.argv)>2:
    sys.exit("Too many command line arguments")
else:
    csvfile=sys.argv[1]
    try:
        if csvfile.endswith("csv"):
            with open(csvfile) as file:
                    reader=csv.reader()
                    for row in reader:
                        table.append(row)
                    print(tabulate(table,tablefmt="grid",headers="firstrow"))
        else:
            sys.exit("Not a Csv file")
    except FileNotFoundError:
        sys.exit("File not Found")

