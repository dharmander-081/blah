import { createRng } from './seededRng';
import { calculateRisk, calculateEmployability } from './scoring';
import { 
  EnrichedStudent, Student, Academics, Attendance, LmsActivity, 
  PlacementMetrics, Checkin, Consent, Achievement 
} from './types';

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Rishi', 'Karan', 'Kabir', 'Rohan', 'Dhruv', 'Siddharth',
  'Aanya', 'Diya', 'Ananya', 'Saanvi', 'Aditi', 'Myra', 'Kavya', 'Priya', 'Riya', 'Neha',
  'Ishita', 'Anika', 'Aarohi', 'Avni', 'Shruti', 'Simran', 'Tanvi', 'Isha', 'Meera', 'Rashi',
  'Rahul', 'Vikram', 'Raj', 'Sanjay', 'Amit', 'Rohit', 'Manish', 'Saurabh', 'Nitin', 'Alok',
  'Pooja', 'Sneha', 'Jyoti', 'Shikha', 'Asha', 'Sunita', 'Rekha', 'Kiran', 'Anita', 'Swati'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Desai', 'Joshi', 'Reddy', 'Rao',
  'Iyer', 'Menon', 'Nair', 'Pillai', 'Choudhury', 'Das', 'Bose', 'Mukherjee', 'Banerjee', 'Chatterjee',
  'Kapoor', 'Malhotra', 'Bhatia', 'Chopra', 'Sethi', 'Ahluwalia', 'Yadav', 'Mishra', 'Pandey', 'Tiwari',
  'Chauhan', 'Thakur', 'Rajput', 'Jain', 'Agarwal', 'Garg', 'Bansal', 'Kaur', 'Gill', 'Dhillon'
];

const INTERESTS_POOL = [
  'Football', 'Cricket', 'Photography', 'Competitive coding', 'Poetry', 'Music production',
  'Sketching', 'Robotics', 'Gaming', 'Reading', 'Cooking', 'Yoga', 'Blogging', 'Astronomy',
  'Open source', 'ML research', 'Dance', 'Theater', 'Debate', 'Cycling', 'Chess', 'Origami',
  'Gardening', 'Calligraphy', 'Film-making', 'Volunteering', 'Fitness', 'Badminton', 'Swimming', 'Table tennis'
];

const BIOS_POOL = [
  "Passionate about building scalable systems.",
  "Coffee enthusiast and full-stack developer.",
  "Always learning, always coding.",
  "Exploring the intersection of design and engineering.",
  "Avid reader, occasional writer.",
  "Making things work, then making them fast.",
  "Tech enthusiast with a love for open source.",
  "Turning ideas into elegant code.",
  "Finding solutions to complex problems.",
  "Dedicated student and aspiring innovator."
];

const FACTORS_POOL = ['exams', 'sleep', 'family', 'friends', 'workload', 'health', 'finances', 'loneliness'];

export function generateMockData(): EnrichedStudent[] {
  const rng = createRng(42);
  const students: EnrichedStudent[] = [];

  for (let i = 1; i <= 5000; i++) {
    const student_id = `STU${i.toString().padStart(4, '0')}`;
    
    // Demographics
    const first_name = rng.pick(FIRST_NAMES);
    const last_name = rng.pick(LAST_NAMES);
    const full_name = `${first_name} ${last_name}`;
    
    const depRand = rng.next();
    let department: Student['department'] = 'Computer Science';
    if (depRand > 0.9) department = 'Civil';
    else if (depRand > 0.75) department = 'Mechanical';
    else if (depRand > 0.55) department = 'Electronics';
    else if (depRand > 0.3) department = 'Information Technology';

    const semester = rng.int(1, 8);
    const email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}${rng.int(1,99)}@edupulse.edu`;
    
    // Shuffle and pick 3-5 interests
    const shuffledInterests = rng.shuffle(INTERESTS_POOL);
    const interests = shuffledInterests.slice(0, rng.int(3, 5));
    
    const bio = rng.pick(BIOS_POOL);
    const avatar_initials = `${first_name[0]}${last_name[0]}`;
    const avatar_hue = rng.int(0, 360);

    const studentBase: Student = {
      student_id, full_name, department, semester, email, interests, bio, avatar_initials, avatar_hue
    };

    // Academics
    let cgpa = rng.normal(7.1, 1.2);
    cgpa = Math.max(4.0, Math.min(10.0, cgpa));
    
    let prev_cgpa = cgpa + rng.normal(0, 0.5);
    prev_cgpa = Math.max(4.0, Math.min(10.0, prev_cgpa));

    const backlogsProb = rng.next();
    let backlogs = 0;
    if (backlogsProb > 0.78) {
      // exponential decay for 1-5 backlogs
      const bRand = rng.next();
      if (bRand > 0.9) backlogs = 5;
      else if (bRand > 0.7) backlogs = 4;
      else if (bRand > 0.5) backlogs = 3;
      else if (bRand > 0.2) backlogs = 2;
      else backlogs = 1;
    }

    const exam_score_avg = Math.max(40, Math.min(100, cgpa * 9.5 + rng.normal(0, 5)));
    
    const semester_cgpas: number[] = [];
    for (let s = 1; s <= semester; s++) {
      let sCgpa = cgpa + rng.normal(0, 0.4);
      semester_cgpas.push(Number(Math.max(4.0, Math.min(10.0, sCgpa)).toFixed(2)));
    }

    const academics: Academics = {
      student_id, cgpa: Number(cgpa.toFixed(2)), prev_cgpa: Number(prev_cgpa.toFixed(2)), 
      backlogs, exam_score_avg: Number(exam_score_avg.toFixed(1)), semester_cgpas
    };

    // Attendance
    let baseAtt = cgpa * 8 + rng.normal(10, 15);
    // Burnout quadrant: High CGPA, low attendance
    if (cgpa > 8.5 && rng.bool(0.1)) {
      baseAtt = rng.float(45, 65);
    }
    const overall_attendance_pct = Math.max(45, Math.min(99, baseAtt));
    const classes_total = rng.int(300, 400);
    const classes_attended = Math.round(classes_total * (overall_attendance_pct / 100));
    
    const weekly_trend: number[] = [];
    for (let w = 0; w < 12; w++) {
      weekly_trend.push(Math.max(45, Math.min(100, overall_attendance_pct + rng.normal(0, 10))));
    }

    const attendance: Attendance = {
      student_id, overall_attendance_pct: Number(overall_attendance_pct.toFixed(1)), 
      classes_attended, classes_total, weekly_trend: weekly_trend.map(v => Number(v.toFixed(1)))
    };

    // LMS
    const login_frequency_weekly = Math.max(2, Math.min(25, (overall_attendance_pct / 4) + rng.normal(0, 3)));
    const prev_login_frequency = Math.max(2, Math.min(25, login_frequency_weekly + rng.normal(0, 2)));
    const assignment_completion_pct = Math.max(40, Math.min(100, (cgpa * 9) + rng.normal(0, 10)));
    const video_watch_rate_pct = Math.max(20, Math.min(100, assignment_completion_pct - rng.normal(10, 15)));

    const lms: LmsActivity = {
      student_id, 
      login_frequency_weekly: Math.round(login_frequency_weekly), 
      prev_login_frequency: Math.round(prev_login_frequency), 
      assignment_completion_pct: Number(assignment_completion_pct.toFixed(1)),
      video_watch_rate_pct: Number(video_watch_rate_pct.toFixed(1))
    };

    // Placement
    const aptitude_score = Math.max(30, Math.min(98, cgpa * 8 + rng.normal(10, 10)));
    const coding_score = Math.max(30, Math.min(98, cgpa * 8.5 + rng.normal(5, 12)));
    const mock_interview_rating = Math.max(4.0, Math.min(9.8, cgpa - rng.normal(0.5, 1)));

    const placement: PlacementMetrics = {
      student_id, 
      aptitude_score: Number(aptitude_score.toFixed(1)), 
      coding_score: Number(coding_score.toFixed(1)), 
      mock_interview_rating: Number(mock_interview_rating.toFixed(1))
    };

    // Consent
    const consent: Consent = {
      student_id,
      share_wellbeing_with_mentor: rng.bool(0.6),
      share_wellbeing_with_counselor: rng.bool(0.3)
    };

    // Checkins
    const checkins: Checkin[] = [];
    if (consent.share_wellbeing_with_mentor || consent.share_wellbeing_with_counselor) {
      if (rng.bool(0.4)) { // 40% of opted-in have data
        for (let d = 0; d < 30; d++) {
          if (rng.bool(0.7)) continue; // Don't check in every day
          const date = new Date(Date.now() - d * 86400000).toISOString().split('T')[0];
          const stress = Math.max(1, Math.min(5, Math.round(rng.normal(3, 1))));
          const mood = Math.max(1, Math.min(5, 6 - stress + rng.normal(0, 0.5)));
          const sleep = Math.max(4, Math.min(9, rng.normal(7, 1.5)));
          const numFactors = rng.int(0, 3);
          const f = rng.shuffle(FACTORS_POOL).slice(0, numFactors);
          
          checkins.push({
            student_id, date, mood: Math.round(mood), stress: Math.round(stress), 
            sleep_hours: Number(sleep.toFixed(1)), factors: f
          });
        }
      }
    }

    // Achievements
    const achievements: Achievement[] = [];
    const numAchievements = rng.int(0, 4);
    const achievementTypes: Achievement['type'][] = ['hackathon', 'certification', 'club_role', 'competition', 'project', 'internship'];
    for(let a=0; a<numAchievements; a++) {
      achievements.push({
        student_id,
        title: `Achievement ${a+1} for ${first_name}`,
        type: rng.pick(achievementTypes),
        date: new Date(Date.now() - rng.int(0, 31536000000)).toISOString().split('T')[0],
        verified: rng.bool(0.8),
        verifier_name: rng.bool(0.5) ? 'Prof. ' + rng.pick(LAST_NAMES) : undefined
      });
    }

    const risk = calculateRisk(academics, attendance, lms);
    const employability = calculateEmployability(academics, placement);

    students.push({
      ...studentBase,
      academics,
      attendance,
      lms,
      placement,
      risk,
      employability,
      checkins,
      consent,
      achievements
    });
  }

  return students;
}
