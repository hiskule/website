// mentorSections.ts (or inside same file)
import * as mentorPic from '../assets/random_mentor_pic'
import {mentor} from '../assets/coffeehouse'


type ButtonType = {
  label: string;
  link?: string; // optional
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
    header: "MENTOR MAILING LIST SIGN UP",
    text: `Become a mentor today and have the opportunity to guide young students who are curious about pursuing a career in STEM. By signing up to be a <strong>Hi-Skule™</strong> mentor you’ll be notified when volunteer signup is available for all <strong>Hi-Skule™</strong> Mentorship Events.`,
    buttons: [{ label: "SIGN UP", link:'https://hiskule.skule.ca/home/events-page/'}],
    image: { src: mentor, type: "horizontal", position: "right" }
  },
  {
    header: "First Year Executive",
    text: `Ready to make an impact as a first year? Join the 2T5-2T6 <strong>Hi-Skule™</strong> exec team today! Help recruit mentors and inspire the next generation of engineers`,
    buttons: [{ label: "SIGN UP",}],
    image: { src: mentorPic.eighth, type: "vertical", position: "left" }
  },
  {
    header: "STAY INVOLVED",
    text: `Want to help out? Out next event is ..., Join us for our planning meeting on ... at ...! Can’t make it? Join our Discord to stay in the loop with all things <strong>Hi-Skule™</strong>!`,
    buttons: [{ label: "RSVP FOR MEETING" }, { label: "JOIN DISCORD"}],
    image: { src: mentorPic.tenth, type: "vertical", position: "right" }
  }
];

export default mentorSections;
