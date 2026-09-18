import React from 'react';

const WEEKLY_SCHEDULE = [
  {
    date: '17', day: 'MON',
    classes: [
      { time: '8AM', name: 'Reformer', instructor: 'DANI' },
      { time: '9AM', name: 'Reformer', instructor: 'DANI' },
      { time: '1PM', name: 'Reformer', instructor: 'BEA' },
      { time: '2PM', name: 'Reformer', instructor: 'BEA' },
      { time: '4PM', name: 'Reformer', instructor: 'BEA' },
    ]
  },
  {
    date: '18', day: 'TUE',
    classes: [
      { time: '8AM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '9AM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '10AM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '4PM', name: 'Mat', instructor: 'CHELSEA' },
      { time: '6PM', name: 'Reformer', instructor: 'BEA' },
    ]
  },
  {
    date: '19', day: 'WED',
    classes: [
      { time: '8AM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '10AM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '2PM', name: 'Reformer', instructor: 'BEA' },
      { time: '5PM', name: 'Reformer', instructor: 'BEA' },
    ]
  },
  {
    date: '20', day: 'THU',
    classes: [
      { time: '9AM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '11AM', name: 'Reformer', instructor: 'BEA' },
      { time: '3PM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '5PM', name: 'Reformer', instructor: 'BEA' },
    ]
  },
  {
    date: '21', day: 'FRI',
    classes: [
      { time: '8AM', name: 'Reformer', instructor: 'VAN' },
      { time: '10AM', name: 'Reformer', instructor: 'VAN' },
      { time: '2PM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '6PM', name: 'Reformer', instructor: 'CHELSEA' },
    ]
  },
  {
    date: '22', day: 'SAT',
    classes: [
      { time: '9AM', name: 'Reformer', instructor: 'CHELSEA' },
      { time: '10:30AM', name: 'Barre', instructor: 'ALEX' },
      { time: '2PM', name: 'Reformer', instructor: 'CHELSEA' },
    ]
  },
  {
    date: '23', day: 'SUN',
    classes: [
      { time: '8AM', name: 'Reformer', instructor: 'BEA' },
      { time: '10AM', name: 'Reformer', instructor: 'BEA' },
      { time: '1PM', name: 'Reformer', instructor: 'GIANA' },
      { time: '3PM', name: 'Private', instructor: 'GIANA' },
    ]
  }
];

export default function WeeklyScheduleGrid() {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {WEEKLY_SCHEDULE.map((day) => (
          <div key={day.date} className="bg-white rounded-3xl p-6 shadow-sm border border-brand-sand/30 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-baseline mb-6 border-b border-brand-sand/30 pb-4">
              <span className="text-6xl font-serif text-brand-brown">{day.date}</span>
              <span className="text-xl font-semibold text-brand-dark/60 tracking-wider">{day.day}</span>
            </div>
            
            <div className="space-y-3">
              {day.classes.map((cls, idx) => (
                <div key={idx} className="flex gap-4 items-center group cursor-pointer">
                  <span className="text-red-700 font-bold text-sm w-12 group-hover:text-brand-brown transition-colors">
                    {cls.time}
                  </span>
                  <span className="text-brand-dark/80 font-medium text-sm">
                    {cls.name} [{cls.instructor}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Private Class Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-sand/30 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
          <h3 className="text-3xl font-serif text-brand-brown leading-tight mb-6">
            PRIVATE<br/>CLASS
          </h3>
          <p className="text-lg text-brand-dark/80 font-medium max-w-[200px]">
            Message us to book a private class.
          </p>
        </div>

      </div>
    </div>
  );
}
