import os

def list_files(directory):
    file_list = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_list.append(os.path.join(root, file))
    return file_list

if __name__ == "__main__":
    folder_path = r"F:/CompanyLCQuestion25/src/data/data"


    files = list_files(folder_path)
    for file in files:
        print(os.path.relpath(file, folder_path))