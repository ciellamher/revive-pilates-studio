import re

file_path = 'src/components/organisms/Navbar.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Remove the old links
content = re.sub(r'<Link to="/classes".*?Group Classes\n\s*</Link>', '', content)
content = re.sub(r'<Link to="/private-sessions".*?Private Sessions\n\s*</Link>', '', content)
content = re.sub(r'<Link to="/packages".*?Packages\n\s*</Link>', '', content)

# Change /my-bookings to /dashboard
content = content.replace('to="/my-bookings"', 'to="/dashboard"')
content = content.replace('> My schedule', '> My schedule') # No change needed here, just the 'to' is enough
content = content.replace('My Bookings\n            </Link>', 'Dashboard\n            </Link>')

with open(file_path, 'w') as f:
    f.write(content)

print("Updated Navbar.jsx")
