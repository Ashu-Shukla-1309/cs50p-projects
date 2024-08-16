import sys
count=0
#sys argv excpecting two arguments
if len(sys.argv)<2:
    sys.exit("Too few command line arguments")
elif len(sys.argv)>2:
    sys.exit("Too many command line arguments")
else:
    filename=sys.argv[1]
    if filename.endswith(".py"):
        try:
            with open(filename)as file:
                for linr in file:
                    if not line.lstrip().startwith("#") and line.split!=[]:
                        count+=1
        except FileNotFoundError:
            sys.exit("File not found")
    else:
        sys.exit("Not a Python file")
print(count)
