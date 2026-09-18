import re

# Remove 'Buy a package' from Checkout.jsx
file_path = 'src/pages/Checkout.jsx'
with open(file_path, 'r') as f:
    content = f.read()

pattern = r'\s*\{\/\* Buy Package Accordion \*\/.*?<hr className="border-brand-sand/30" />'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)

# Remove the status pill from Navbar.jsx
file_path2 = 'src/components/organisms/Navbar.jsx'
with open(file_path2, 'r') as f:
    content2 = f.read()

nav_pattern = r'<div className="flex items-center gap-4">.*?<Link to="/register"'
nav_replacement = r'<Link to="/register"'
content2 = re.sub(nav_pattern, nav_replacement, content2, flags=re.DOTALL)

# Revert Account to Log In and remove the wrapping div closure
content2 = content2.replace('<span>Account</span>\n              </Link>\n            </div>', '<span>Log In</span>\n            </Link>')

with open(file_path2, 'w') as f:
    f.write(content2)

print("Successfully reverted UI elements")
