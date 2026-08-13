import * as coffee from '../assets/coffeehouse';
import * as DC from '../assets/UTHSDC';
import * as design from '../assets/designapalooza';
import * as prefrosh from '../assets/prefrosh';
import { ACTIVE_EVENT_ID } from './activeEvent';

export type EventDetails = {
  location?: { building: string; address: string; mapUrl: string; };
  date?: string;
  timeframe?: string;
  itinerary?: { time: string; activity: string }[];
  requirements?: string[];
  highlights?: string[];
  registrationDeadline?: string;
};

export type EventData = {
  id: string;
  title: string;
  time: string;
  description: string;
  images: string[];
  link: string;
  isUpcoming: boolean;
  details?: EventDetails;
};

export const eventsData: EventData[] = [
  {
    id: "COFFEEHOUSE",
    title: "MENTORSHIP COFFEEHOUSE",
    time: "September 26th",
    description:
      "The Mentorship Coffeehouse is an amazing opportunity for high-school students to learn more about UofT Engineering design teams, Skule spirit, hear from professors and current students, participate in some fun engineering activities, and all around, learn more about engineering!",
    images: [
      // Top 4 curated specifically for the popup modal grid
      coffee.coffeehouseImages.groups[0], 
      coffee.coffeehouseImages.events[0], 
      coffee.coffeehouseImages.students[0], 
      coffee.coffeehouseImages.mentors[0],
      // The rest of the photos to fill out the rolling carousel automatically
      ...coffee.coffeehouseImages.groups.slice(1),
      ...coffee.coffeehouseImages.events.slice(1),
      ...coffee.coffeehouseImages.students.slice(1),
      ...coffee.coffeehouseImages.mentors.slice(1),
    ],
    link: '/mentorship-coffeehouse',
    isUpcoming: ACTIVE_EVENT_ID === "COFFEEHOUSE",
    details: {
      location: { building: "Galbraith Building Room 202", address: "35 St George St, Toronto", mapUrl: 'https://www.google.com/maps/place/43°39\'35.6"N+79°23\'46.9"W/@43.6597922,-79.3963609,19z/data=!4m4!3m3!8m2!3d43.6598889!4d-79.3963611?entry=ttu&g_ep=EgoyMDI2MDgxMC4wIKXMDSoASAFQAw%3D%3D' },
      date: "Saturday, September 26th",
      timeframe: "10:00 AM - 3:00 PM",
      requirements: [
        "<strong>Who is it for?</strong> High School Students (Grades 9-12)",
        "<strong>Prerequisites:</strong> No prior coding or engineering experience required",
      ],
      highlights: ["Meet UofT Engineering professors", "Interactive engineering challenges", "Free snacks and refreshments"],
      registrationDeadline: "September 25th at 11:59 PM",
      itinerary: [
        { time: "10:00 AM", activity: "Registration & Welcome" },
        { time: "11:30 AM", activity: "Design Team Showcase" },
        { time: "1:30 PM", activity: "Professor Q&A Panel" },
        { time: "3:30 PM", activity: "Networking & Snacks" }
      ]
    }
  },
  {
    id: "UTHSDC",
    title: "UNIVERSITY OF TORONTO HIGH SCHOOL DESIGN COMPETITION (UTHSDC)",
    time: "LATE FALL",
    description:
      "The University of Toronto High School Design Competition (UTHSDC) is an exciting challenge where students take on a real-world engineering problem, brainstorm and refine solutions, and present their designs in a friendly competition. Along the way, they’ll apply the Engineering Design Process, build problem-solving skills, and bring creative ideas to life with guidance from experienced mentors.",
    images: [
      // Top 4 curated for the popup modal grid (as requested)
      DC.uthsdcImages.mentors[0],
      DC.uthsdcImages.events[0],
      DC.uthsdcImages.events[1],
      DC.uthsdcImages.students[0],
      // The rest of the photos for the carousel automatically
      DC.uthsdcImages.groups[0],
      ...DC.uthsdcImages.mentors.slice(1),
      ...DC.uthsdcImages.events.slice(2),
      ...DC.uthsdcImages.students.slice(1)
    ],
    link: '',
    isUpcoming: ACTIVE_EVENT_ID === "UTHSDC",
    details: {
      location: { building: "Myhal Centre for Engineering Innovation & Entrepreneurship", address: "55 St George St, Toronto", mapUrl: "https://goo.gl/maps/sample2" },
      date: "Saturday, November 14th",
      timeframe: "9:00 AM - 5:00 PM",
      requirements: [
        "<strong>Who is it for?</strong> High School Students (Grades 9-12)",
        "<strong>Prerequisites:</strong> No prior coding or engineering experience required",
        "<strong>Team Size:</strong> Sign up solo or in teams of up to 4"
      ],
      highlights: ["Tackle real-world engineering problems", "Guidance from UofT mentors", "Prizes for winning designs", "Free pizza lunch"],
      registrationDeadline: "November 5th at 11:59 PM",
      itinerary: [
        { time: "9:00 AM", activity: "Check-in & Breakfast" },
        { time: "10:00 AM", activity: "Opening Ceremonies & Problem Reveal" },
        { time: "11:00 AM", activity: "Design & Brainstorming Phase" },
        { time: "1:00 PM", activity: "Lunch Break" },
        { time: "2:00 PM", activity: "Prototyping Phase" },
        { time: "4:00 PM", activity: "Presentations & Judging" },
        { time: "4:30 PM", activity: "Awards & Closing" }
      ]
    }
  },
  {
    id: "DESIGNAPALOOZA",
    title: "DESIGNAPALOOZA",
    time: "WINTER",
    description:
      "Designapalooza gives high school students the chance to spend a day at U of T’s Faculty of Applied Science & Engineering, taking part in hands-on workshops across different engineering fields—like building wind turbines in Mechanical Engineering or programming Arduino circuits in Electrical & Computer Engineering. Led by U of T design teams, students can learn new skills, tackle real-world challenges, and see how engineering can make an impact.",
    images: [
      // Top 4 curated for popup modal grid
      design.designapaloozaImages.groups[0],
      design.designapaloozaImages.events[0],
      design.designapaloozaImages.mentors[0],
      design.designapaloozaImages.students[0],
      // The rest of the photos for the carousel automatically
      ...design.designapaloozaImages.groups.slice(1),
      ...design.designapaloozaImages.events.slice(1),
      ...design.designapaloozaImages.mentors.slice(1),
      ...design.designapaloozaImages.students.slice(1)
    ],
    link: '',
    isUpcoming: ACTIVE_EVENT_ID === "DESIGNAPALOOZA",
    details: {
      location: { building: "Bahen Centre for Information Technology", address: "40 St George St, Toronto", mapUrl: "https://goo.gl/maps/sample" },
      date: "Saturday, February 21st",
      timeframe: "10:00 AM - 4:00 PM",
      requirements: [
        "<strong>Who is it for?</strong> High School Students (Grades 9-12)",
        "<strong>Prerequisites:</strong> No prior experience required",
        "<strong>Team Size:</strong> Sign up solo or with friends"
      ],
      highlights: ["Hands-on engineering workshops", "Learn Arduino and CAD", "Build mechanical prototypes"],
      registrationDeadline: "February 14th at 11:59 PM",
      itinerary: [
        { time: "10:00 AM", activity: "Registration & Team Groupings" },
        { time: "10:30 AM", activity: "Workshop Session 1" },
        { time: "12:30 PM", activity: "Lunch Break" },
        { time: "1:30 PM", activity: "Workshop Session 2" },
        { time: "3:30 PM", activity: "Closing Ceremony" }
      ]
    }
  },
  {
    id: "PREFROSH",
    title: "PRE-FROSH",
    time: "SUMMER",
    description:
      "HEY FUTURE ENGINEERS! 🎉💜 GET READY FOR PRE FROSH! An afternoon packed with games, activities, and nonstop Skule spirit is waiting for you. Meet new friends, dive into the hype, and experience all the excitement that <strong>Hi-Skule™</strong> has to offer. You won’t want to miss the energy, the fun, and the chance to kick off your engineering journey with a bang! 💜🚀",
    images: [prefrosh.first, prefrosh.second, prefrosh.third, prefrosh.forth, prefrosh.fifth, prefrosh.sixth, prefrosh.seventh, prefrosh.eighth, prefrosh.ninth],
    link: '',
    isUpcoming: ACTIVE_EVENT_ID === "PREFROSH",
    details: {
      location: { building: "Front Campus (King's College Circle)", address: "King's College Cir, Toronto", mapUrl: "https://goo.gl/maps/sample3" },
      date: "Late August",
      timeframe: "1:00 PM - 5:00 PM",
      requirements: [
        "<strong>Who is it for?</strong> Incoming UofT Engineering First-Year Students"
      ],
      highlights: ["Meet your future classmates", "Learn Skule traditions", "Fun outdoor activities and games"],
      registrationDeadline: "Rolling registration",
      itinerary: [
        { time: "1:00 PM", activity: "Check-in & Swag Distribution" },
        { time: "1:30 PM", activity: "Icebreakers & Games" },
        { time: "3:00 PM", activity: "Campus Tour" },
        { time: "4:30 PM", activity: "Closing & Group Photo" }
      ]
    }
  }
];