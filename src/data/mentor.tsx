// mentorSections.ts (or inside same file)
import * as mentorPic from '../assets/random_mentor_pic'
import {mentor, first} from '../assets/coffeehouse'


type ButtonType = {
  label: string;
  link?: string; 
};

type ImageType = {
  src: string;
  type: "horizontal" | "vertical";
  position: "left" | "right";
};

type MentorSection = {
  header: string;
  text: string;
  buttons: ButtonType[];
  image?: ImageType;
};
// Define your section data
const mentorSections: MentorSection[] = [
  {
    header: "MENTORSHIP COFFEEHOUSE MENTOR SIGN UP",
    text: `Want to be a mentor for <strong>Hi-Skule™</strong>’s first event of the year? Sign up as a Coffeehouse Mentor and share your journey with high school students at our Mentorship Coffeehouse on Sept 20!`,
    buttons: [{ label: "SIGN UP"}],
    image: { src: first, type: "horizontal", position: "left" }
  },
  {
    header: "MENTOR MAILING LIST SIGN UP",
    text: `Become a mentor today and have the opportunity to guide young students who are curious about pursuing a career in STEM. By signing up to be a <strong>Hi-Skule™</strong> mentor you’ll be notified when volunteer signup is available for all <strong>Hi-Skule™</strong> Mentorship Events.`,
    buttons: [{ label: "SIGN UP", link:'https://docs.google.com/forms/d/e/1FAIpQLSdM_ZME1zqUSYguJBbzbUHJrsWxeS6MwKpEMrgXzfxXadv_Ig/viewform'}],
    image: { src: mentor, type: "horizontal", position: "right" }
  },
  {
    header: "First Year Executive",
    text: `Ready to make an impact as a first year? Join the 2T5-2T6 <strong>Hi-Skule™</strong> exec team today! Help recruit mentors and inspire the next generation of engineers`,
    buttons: [{ label: "SIGN UP", link:'https://docs.google.com/forms/d/e/1FAIpQLSe9KaU4Bv3zBqRBYL7WFtXirvXfn6Nji-3TCqeOP6nsB-3UjA/viewform'}],
    image: { src: mentorPic.eighth, type: "vertical", position: "left" }
  },
  {
    header: "STAY INVOLVED",
    text: `Want to help out? Join our Discord to stay in the loop with all things <strong>Hi-Skule™</strong>!`,
    buttons: [{ label: "JOIN DISCORD", link:'https://discord.gg/YsKmdBKRwD'}],
    image: { src: mentorPic.tenth, type: "vertical", position: "right" }
  }
];

export default mentorSections;
