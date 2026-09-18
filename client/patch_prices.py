import re

# Patch GroupClasses.jsx
file_path = 'src/pages/GroupClasses.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Add price to CLASS_CATALOG objects
content = re.sub(r"(duration: '50 mins',|duration: '60 mins',)", r"\1\n    price: '₱800',", content)

# Add price UI above View Details button
card_pattern = r'(<p className="text-brand-dark/70 text-sm leading-relaxed mb-8 flex-1">\s*\{cls\.description\}\s*</p>)'
card_replacement = r'''<p className="text-brand-dark/70 text-sm leading-relaxed mb-6 flex-1">
                  {cls.description}
                </p>
                <div className="flex items-center justify-between mb-4 border-t border-brand-sand/30 pt-4">
                  <span className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">Per Session</span>
                  <span className="text-xl font-bold text-brand-dark">{cls.price || '₱800'}</span>
                </div>'''
content = re.sub(card_pattern, card_replacement, content)

with open(file_path, 'w') as f:
    f.write(content)

# Patch PrivateSessions.jsx
file_path2 = 'src/pages/PrivateSessions.jsx'
with open(file_path2, 'r') as f:
    content2 = f.read()

# Add price to PRIVATE_CATALOG objects
content2 = re.sub(r"(duration: 'From 55 mins',)", r"\1\n    price: '₱2,500',", content2)

# Add price UI above View More button
card_pattern2 = r'(<p className="text-brand-dark/70 text-sm leading-relaxed mb-8 flex-1">\s*\{cls\.description\}\s*</p>)'
card_replacement2 = r'''<p className="text-brand-dark/70 text-sm leading-relaxed mb-6 flex-1">
                  {cls.description}
                </p>
                <div className="flex items-center justify-between mb-4 border-t border-brand-sand/30 pt-4">
                  <span className="text-xs font-bold text-brand-dark/60 uppercase tracking-wider">Starting at</span>
                  <span className="text-xl font-bold text-brand-dark">{cls.price || '₱2,500'}</span>
                </div>'''
content2 = re.sub(card_pattern2, card_replacement2, content2)

with open(file_path2, 'w') as f:
    f.write(content2)

print("Successfully patched prices")
