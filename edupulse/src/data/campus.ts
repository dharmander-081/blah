import { CampusPlace } from './types';

export const campusPlaces: CampusPlace[] = [
  { id: 'p1', name: 'Library', type: 'academic', x: 35, y: 25, busyness: 'quiet', hours: '8am-10pm', seats_free: 23 },
  { id: 'p2', name: 'CS Block', type: 'academic', x: 55, y: 20, busyness: 'moderate', hours: '8am-6pm' },
  { id: 'p3', name: 'ECE Block', type: 'academic', x: 65, y: 35, busyness: 'quiet', hours: '8am-6pm' },
  { id: 'p4', name: 'Mechanical Workshop', type: 'academic', x: 75, y: 50, busyness: 'quiet', hours: '9am-5pm' },
  { id: 'p5', name: 'Central Canteen', type: 'food', x: 45, y: 55, busyness: 'packed', hours: '7am-9pm' },
  { id: 'p6', name: 'Hostel A', type: 'hostel', x: 20, y: 65, busyness: 'moderate', hours: '24hrs' },
  { id: 'p7', name: 'Hostel B', type: 'hostel', x: 25, y: 75, busyness: 'quiet', hours: '24hrs' },
  { id: 'p8', name: 'Auditorium', type: 'recreation', x: 50, y: 40, busyness: 'quiet', hours: '9am-9pm', upcoming_event: 'TEDx Campus at 4pm' },
  { id: 'p9', name: 'Sports Ground', type: 'recreation', x: 80, y: 70, busyness: 'moderate', hours: '6am-8pm' },
  { id: 'p10', name: 'Admin Block', type: 'academic', x: 40, y: 15, busyness: 'quiet', hours: '9am-5pm' },
  { id: 'p11', name: 'Medical Centre', type: 'help', x: 30, y: 50, busyness: 'quiet', hours: '24hrs' },
  { id: 'p12', name: 'Counselling Cell', type: 'help', x: 32, y: 48, busyness: 'quiet', hours: '9am-5pm' },
  { id: 'p13', name: 'IT Block', type: 'academic', x: 60, y: 25, busyness: 'packed', hours: '8am-6pm' }
];
