def main():
    file_name=input("Enter the file name").lower().strip()
    gif = "image/gif"
    jpg = "image/jpeg"
    jpeg = "image/jpeg"
    png = "image/png"
    pdf = "application/pdf"
    txt = "text/plain"
    zip = "application/zip"
    if file_name.endswith(".gif"):
        print(gif)
    elif file_name.endswith(".jpg")  or extension.endswith(".jpeg"):
        print(jpg)
    elif file_name.endswith(".png"):
        print(png)
    elif file_name.endswith(".pdf"):
        print(pdf)
    elif file_name.endswith(".txt"):
        print(txt)
    elif file_name.endswith(".zip"):
        print(zip)
    else:
        print("application/octet-stream")
main()
