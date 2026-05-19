from rembg import remove
import os

input_path = 'public/mascotte-ia.png'
output_path = 'public/mascotte-ia-transparent.png'

print(f"Removing background from {input_path}...")
with open(input_path, 'rb') as i:
    input_data = i.read()

output_data = remove(input_data)

with open(output_path, 'wb') as o:
    o.write(output_data)

print(f"Background removed successfully! Saved to {output_path}")
