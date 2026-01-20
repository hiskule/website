// mentorSections.ts (or inside same file)
import * as mentorPic from '../assets/random_mentor_pic'
import {mentor} from '../assets/coffeehouse'
import {first} from '../assets/UTHSDC'


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
    header: "Designapalooza 2T6 MENTOR SIGN UP",
    text: `Want to be a mentor for <strong>Hi-Skule™</strong>’s most technical event of the year? Sign up as a Designapalooza Mentor and help us run this event smoothly on February 28!`,
    buttons: [{ label: "SIGN UP", link:'https://forms.gle/ZUyph4WVZPsAHSBG6'}],
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
    buttons: [{ label: "SIGN UP", link:''}],
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
