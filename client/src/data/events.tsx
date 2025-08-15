import * as coffee from '../assets/coffeehouse';
import * as DC from '../assets/UTHSDC';
import BigLogo from '../assets/hiskule_full.png';
import SmallLogo from '../assets/hiskule_small.png';

export const eventsData = [
  {
    title: "MENTORSHIP COFFEEHOUSE",
    time: "EARLY FALL",
    description:
      "The Mentorship Coffeehouse is an amazing opportunity for high-school students to learn more about UofT Engineering design teams, Skule spirit, hear from professors and current students, participate in some fun engineering activities, and all around, learn more about engineering!",
    images: [coffee.first, coffee.second, coffee.third, coffee.fourth, coffee.fifth],
    showRegister: true,
  },
  {
    title: "UNIVERSITY OF TORONTO HIGH SCHOOL DESIGN COMPETITION (UTHSDC)",
    time: "LATE FALL",
    description:
      "The University of Toronto High School Design Competition (UTHSDC) is an exciting challenge where students take on a real-world engineering problem, brainstorm and refine solutions, and present their designs in a friendly competition. Along the way, they’ll apply the Engineering Design Process, build problem-solving skills, and bring creative ideas to life with guidance from experienced mentors.",
    images: [DC.first, DC.second, DC.third, DC.fourth, DC.fifth, DC.sixth, DC.seventh],
    showRegister: false,
  },
  {
    title: "DESIGNAPALOOZA",
    time: "WINTER",
    description:
      "Designapalooza gives high school students the chance to spend a day at U of T’s Faculty of Applied Science & Engineering, taking part in hands-on workshops across different engineering fields—like building wind turbines in Mechanical Engineering or programming Arduino circuits in Electrical & Computer Engineering. Led by U of T design teams, students can learn new skills, tackle real-world challenges, and see how engineering can make an impact.",
    images: [BigLogo, SmallLogo, BigLogo],
    showRegister: false,
  },
  {
    title: "PRE-FROSH",
    time: "Summer", //??
    description:
      "HEY FUTURE ENGINEERS! 🎉💜 GET READY FOR PRE FROSH! An afternoon packed with games, activities, and nonstop Skule spirit is waiting for you. Meet new friends, dive into the hype, and experience all the excitement that Hi-Skule has to offer. You won’t want to miss the energy, the fun, and the chance to kick off your engineering journey with a bang! 💜🚀",
    images: [BigLogo, SmallLogo, BigLogo],
    showRegister: false,
  },
];