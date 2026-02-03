import os
import zipfile
import xml.etree.ElementTree as ET

def docx_to_text(path):
    try:
        document = zipfile.ZipFile(path)
        xml_content = document.read('word/document.xml')
        document.close()
        tree = ET.XML(xml_content)
        
        paragraphs = []
        for paragraph in tree.iter():
            if paragraph.tag.endswith('p'):
                texts = [node.text for node in paragraph.iter() if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
        return '\n\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading {path}: {str(e)}"

data_dir = r"d:\Code\AradhanaTrust\data"
output_dir = r"d:\Code\AradhanaTrust\docs\content_extracted"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for filename in os.listdir(data_dir):
    if filename.endswith(".docx"):
        input_path = os.path.join(data_dir, filename)
        text = docx_to_text(input_path)
        output_filename = filename.replace(".docx", ".md")
        output_path = os.path.join(output_dir, output_filename)
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(f"# {filename}\n\n{text}")
        print(f"Converted {filename} to {output_path}")
