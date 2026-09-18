import os
import glob

html = "<html><body>"
files = glob.glob("src/assets/revive-photos/*.jpg")
for f in files:
    name = os.path.basename(f)
    html += f"<div><h3>{name}</h3><img src='{f}' style='width: 300px;' /></div>"
html += "</body></html>"

with open("gallery.html", "w") as f:
    f.write(html)
