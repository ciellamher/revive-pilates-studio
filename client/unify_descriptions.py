import re

def bullets_to_paragraph(text):
    # Remove leading dots and newlines, join with spaces
    cleaned = re.sub(r'•\s*', '', text)
    cleaned = cleaned.replace('\n', ' ')
    # Fix double spaces if any
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    # Add periods to end of sentences if missing
    sentences = [s.strip() for s in cleaned.split('  ') if s.strip()] # if separated by double space
    if not sentences:
        # try splitting by capitals
        pass
    
    # Actually, let's just do a simple replacement for the specific files
    return cleaned

file_path = 'src/pages/PrivateSessions.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# PrivateSessions specific replaces
content = content.replace("description: '• One-on-one session\\n• Designed to meet your specific goals and needs\\n• Provides focused guidance and precise form correction'", "description: 'A one-on-one session designed to meet your specific goals and needs. Provides focused guidance and precise form correction for optimal results.'")
content = content.replace("description: '• Duo session for two people\\n• Designed to meet your specific goals and needs\\n• Provides focused guidance and precise form correction'", "description: 'A duo session for two people, designed to meet your specific goals and needs. Provides focused guidance and precise form correction.'")
content = content.replace("description: '• Trio session for three people\\n• Designed to meet your specific goals and needs\\n• Provides focused guidance and precise form correction'", "description: 'A trio session for three people, designed to meet your specific goals and needs. Provides focused guidance and precise form correction.'")
content = content.replace("description: '• Designed for expectant mothers\\n• Enhances strength, mobility, and body support during pregnancy\\n• Emphasizes safe, controlled movements'", "description: 'Designed for expectant mothers, this session enhances strength, mobility, and body support during pregnancy. Emphasizes safe, controlled movements.'")
content = content.replace("description: '• Designed for postpartum recovery\\n• Focuses on core strength, stability, and proper alignment\\n• Supports a safe and gradual return to movement'", "description: 'Designed for postpartum recovery, focusing on core strength, stability, and proper alignment. Supports a safe and gradual return to movement.'")
content = content.replace("description: '• Led by a licensed physical therapist or certified clinical Pilates instructor\\n• Focuses on assessment-based, safe, and controlled movement\\n• Typically taken with a doctor\\'s referral'", "description: 'Led by a licensed physical therapist or certified instructor. Focuses on assessment-based, safe, and controlled movement. Typically taken with a referral.'")

with open(file_path, 'w') as f:
    f.write(content)

file_path2 = 'src/pages/GroupClasses.jsx'
with open(file_path2, 'r') as f:
    content2 = f.read()

content2 = content2.replace("description: '• Performed on a mat or padded surface\\n• Uses body weight and minimal props for resistance\\n• Accessible and can be practiced in various settings\\n• Suitable for those seeking a simple Pilates experience'", "description: 'Performed on a mat or padded surface using body weight and minimal props for resistance. Accessible and suitable for those seeking a simple, foundational Pilates experience.'")

with open(file_path2, 'w') as f:
    f.write(content2)

print("Descriptions converted to paragraphs.")
