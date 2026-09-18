import json

classes = []
id_counter = 1

def add_day(branch, date, day_data):
    global id_counter
    for item in day_data:
        parts = item.split(' ', 2)
        time = parts[0]
        type_str = parts[1]
        instructor = parts[2].replace('(', '').replace(')', '').replace('[', '').replace(']', '').title()
        
        # fix time formatting
        if 'AM' in time:
            time = time.replace('AM', ':00 AM') if ':' not in time else time.replace('AM', ' AM')
        elif 'PM' in time:
            time = time.replace('PM', ':00 PM') if ':' not in time else time.replace('PM', ' PM')

        t = 'reformer'
        if 'Mat' in type_str: t = 'mat'
        if 'Barre' in type_str: t = 'mat' # treat barre as mat color
        if 'Private' in type_str: t = 'private'
        if 'Flow' in type_str or 'Yogalates' in type_str: t = 'flow'

        classes.append({
            'id': id_counter,
            'date': date,
            'title': f'{type_str} Pilates' if type_str == 'Reformer' else type_str,
            'instructor': f'Coach {instructor}',
            'time': time,
            'duration': '50 min',
            'type': t,
            'slotsLeft': 5,
            'isWaitlist': False,
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

print("const DUMMY_CLASSES = " + json.dumps(classes, indent=2).replace('"', "'") + ";")
