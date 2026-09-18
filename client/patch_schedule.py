import json
import re
import random

# Generate the massive class array
classes = []
id_counter = 1

def add_day(branch, date, day_data):
    global id_counter
    for item in day_data:
        parts = item.split(' ', 2)
        time = parts[0]
        type_str = parts[1]
        instructor = parts[2].replace('(', '').replace(')', '').replace('[', '').replace(']', '').title()
        
        if 'AM' in time:
            time = time.replace('AM', ':00 AM') if ':' not in time else time.replace('AM', ' AM')
        elif 'PM' in time:
            time = time.replace('PM', ':00 PM') if ':' not in time else time.replace('PM', ' PM')

        t = 'reformer'
        if 'Mat' in type_str: t = 'mat'
        if 'Barre' in type_str: t = 'mat'
        if 'Private' in type_str: t = 'private'
        if 'Flow' in type_str or 'Yogalates' in type_str: t = 'flow'

        # Randomly assign userStatus to a few classes for demonstration
        user_status = 'none'
        if id_counter in [2, 14, 30]:
            user_status = 'booked'
        elif id_counter in [8, 41]:
            user_status = 'waitlisted'

        classes.append({
            'id': id_counter,
            'date': date,
            'title': f'{type_str} Pilates' if type_str == 'Reformer' else type_str,
            'instructor': f'Coach {instructor}',
            'time': time,
            'duration': '50 min',
            'type': t,
            'slotsLeft': random.randint(0, 10) if user_status != 'waitlisted' else 0,
            'isWaitlist': user_status == 'waitlisted' or random.choice([True, False, False, False]),
            'userStatus': user_status, # 'booked' | 'waitlisted' | 'none'
            'branch': branch
        })
        id_counter += 1

angeles_mon = ["8AM Reformer [DANI]", "9AM Reformer [DANI]", "1PM Reformer [BEA]", "2PM Reformer [BEA]", "3PM Reformer [DANI]", "4PM Reformer [BEA]", "6PM Reformer [BEA]", "7PM Reformer [BEA]"]
angeles_tue = ["8AM Reformer [CHELSEA]", "9AM Reformer [CHELSEA]", "10AM Reformer [CHELSEA]", "11AM Reformer [BEA]", "2PM Reformer [CHELSEA]", "3PM Reformer [BEA]", "4PM Mat [CHELSEA]", "5PM Reformer [BEA]", "6PM Reformer [BEA]", "7PM Reformer [BEA]"]
angeles_wed = ["8AM Reformer [CHELSEA]", "9AM Reformer [CHELSEA]", "10AM Reformer [CHELSEA]", "11AM Reformer [BEA]", "2PM Reformer [BEA]", "3PM Reformer [CHELSEA]", "4PM Reformer [CHELSEA]", "5PM Reformer [BEA]", "6PM Reformer [BEA]", "7PM Reformer [BEA]"]
sf_mon = ["8AM Reformer [GIANA]", "9AM Reformer [GIANA]", "10AM Reformer [GIANA]", "11AM Reformer [GIANA]", "1PM Private [VAN]", "2PM Reformer [VAN]", "3PM Reformer [VAN]", "5PM Reformer [VAN]", "6:30PM Yogalates [VAN]"]
sf_tue = ["8AM Reformer [VAN]", "9AM Reformer [VAN]", "10AM Reformer [VAN]", "11AM Reformer [ABBY]", "1PM Reformer [VAN]", "2PM Reformer [ABBY]", "3PM Reformer [VAN]", "4PM Reformer [VAN]", "5PM Reformer [ABBY]", "6PM Reformer [ABBY]", "7PM Reformer [ABBY]"]
sf_wed = ["8AM Reformer [VAN]", "9AM Reformer [VAN]", "10AM Reformer [VAN]", "11AM Reformer [ABBY]", "1PM Reformer [VAN]", "2PM Reformer [VAN]", "3PM Reformer [VAN]", "4PM Reformer [ABBY]", "5PM Reformer [ABBY]", "6PM Reformer [ABBY]", "7PM Reformer [ABBY]"]

add_day('Angeles City', '17', angeles_mon)
add_day('Angeles City', '18', angeles_tue)
add_day('Angeles City', '19', angeles_wed)
add_day('San Fernando', '17', sf_mon)
add_day('San Fernando', '18', sf_tue)
add_day('San Fernando', '19', sf_wed)

json_str = "const DUMMY_CLASSES = " + json.dumps(classes, indent=2).replace('"', "'") + ";"

# Patch ClassScheduleGrid.jsx
file_path = 'src/components/organisms/ClassScheduleGrid.jsx'
with open(file_path, 'r') as f:
    content = f.read()

# Replace DUMMY_CLASSES array
pattern = r"const DUMMY_CLASSES = \[.*?\];"
content = re.sub(pattern, json_str, content, flags=re.DOTALL)

# Add Status Icons into the Grid View
grid_card_pattern = r'(<div className="font-bold text-xs text-brand-dark/90 leading-snug mb-1">\{cls\.title\}</div>)'
grid_card_replacement = r'''\1
                          {cls.userStatus === 'booked' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 size={16} className="text-green-500 fill-green-100" />
                            </div>
                          )}
                          {cls.userStatus === 'waitlisted' && (
                            <div className="absolute top-2 right-2">
                              <div className="w-[16px] h-[16px] bg-orange-500 rounded-full flex items-center justify-center text-white text-[9px] shadow-sm font-bold">W</div>
                            </div>
                          )}'''
content = re.sub(grid_card_pattern, grid_card_replacement, content)

# Add Status Icons into the List View
list_card_pattern = r'(<div className="text-center">\s*<span className="text-sm font-bold text-brand-dark/70">\s*\{cls\.isWaitlist \? \'Waitlist\' : `\$\{cls\.slotsLeft\} left`\}\s*</span>\s*</div>)'
list_card_replacement = r'''<div className="text-center flex flex-col items-center gap-1">
                      {cls.userStatus === 'booked' && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={16} className="text-green-500 fill-green-100" />
                          <span className="text-xs font-bold text-green-600">Booked</span>
                        </div>
                      )}
                      {cls.userStatus === 'waitlisted' && (
                        <div className="flex items-center gap-1">
                          <div className="w-[16px] h-[16px] bg-orange-500 rounded-full flex items-center justify-center text-white text-[9px] shadow-sm font-bold">W</div>
                          <span className="text-xs font-bold text-orange-600">Waitlisted</span>
                        </div>
                      )}
                      {cls.userStatus === 'none' && (
                        <span className="text-sm font-bold text-brand-dark/70">
                          {cls.isWaitlist ? 'Waitlist' : `${cls.slotsLeft} left`}
                        </span>
                      )}
                    </div>'''
content = re.sub(list_card_pattern, list_card_replacement, content)

with open(file_path, 'w') as f:
    f.write(content)

print("Successfully patched ClassScheduleGrid.jsx")
