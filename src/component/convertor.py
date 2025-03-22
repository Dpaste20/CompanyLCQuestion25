import os
import json


directory = r"...\..\public\dataJson"
output_file = r"..\CompanyLCQuestion25\public\merged_questions.json"


merged_data = {}


for filename in os.listdir(directory):
    if filename.endswith(".json"):
        company_name = filename.replace(".json", "") 
        file_path = os.path.join(directory, filename)
        
        with open(file_path, "r", encoding="utf-8") as file:
            try:
                questions = json.load(file)  
                merged_data[company_name] = questions  
            except json.JSONDecodeError as e:
                print(f"Error reading {filename}: {e}")

with open(output_file, "w", encoding="utf-8") as output:
    json.dump(merged_data, output, indent=4)

print(f"Merged JSON saved to {output_file}")
