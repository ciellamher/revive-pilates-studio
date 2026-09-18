import re

file_path = 'src/pages/PrivateSessions.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace Star import with BarChart
content = content.replace("import { Clock, Star } from 'lucide-react';", "import { Clock, BarChart } from 'lucide-react';")

# Add 'level: "Personalized"' to all catalog items and change duration format
content = content.replace("duration: 'From 55 mins'", "duration: '55 mins',\n    level: 'Personalized'")

# Remove Rating Block and replace with Duration & Level Block
rating_pattern = r'\{/\* Rating \*/\}.*?\{/\* Duration \*/\}'
new_metadata = """{/* Duration & Level */}
                <div className="flex gap-6 mb-4 text-xs font-semibold text-brand-dark/70 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{cls.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart size={14} />
                    <span>{cls.level}</span>
                  </div>
                </div>"""
content = re.sub(rating_pattern, new_metadata + '\n\n                {/* Description */}', content, flags=re.DOTALL)

# Remove the old standalone duration block
duration_block = r'<div className="flex items-center gap-2 mb-4 text-xs font-semibold text-brand-dark/70 uppercase tracking-wider">\n\s*<Clock size=\{14\} />\n\s*<span>\{cls.duration\}</span>\n\s*</div>'
content = re.sub(duration_block, '', content)

# Change "Starting at" to "PER SESSION"
content = content.replace('<span className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">Starting at</span>', '<span className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">Per Session</span>')

# Change "View More" to "View Details"
content = content.replace('View More\n                </Link>', 'View Details\n                </Link>')

with open(file_path, 'w') as f:
    f.write(content)

print("Updated PrivateSessions.jsx")
