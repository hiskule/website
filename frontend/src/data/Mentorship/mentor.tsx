import type { MentorSection } from './mentorTypes';
import { mentorEvents } from './mentorEvents';
import * as mentorPic from '../../assets/random_mentor_pic'
import { mentor } from '../../assets/coffeehouse'

// These cards will always be displayed at the bottom of the mentorship page
const permanentSections: MentorSection[] = [
  {
    header: "MENTOR MAILING LIST SIGN UP",
    text: `Become a mentor today and have the opportunity to guide young students who are curious about pursuing a career in STEM. By signing up to be a <strong>Hi-Skule™</strong> mentor you’ll be notified when volunteer signup is available for all <strong>Hi-Skule™</strong> Mentorship Events.`,
    buttons: [{ label: "JOIN MAILING LIST", link: 'https://docs.google.com/forms/d/e/1FAIpQLSdB_hGkubv-qBG_U-rmObEm7uk4VeSl2HQcyfzGuSGy_QVZTg/viewform' }],
    image: { src: mentor, type: "horizontal", position: "right" }
  },
  {
    header: "First Year Executive & Volunteer Pool",
    text: `Ready to make an impact right from your first year? Join the <strong>Hi-Skule™</strong> volunteer pool today! Help recruit mentors and inspire the next generation of engineers.`,
    buttons: [{ label: "VOLUNTEER SIGN UP", link: '' }],
    image: { src: mentorPic.eighth, type: "vertical", position: "left" }
  },
  {
    header: "STAY INVOLVED ON DISCORD",
    text: `Want to help out and chat with our team directly? Join our Discord server to stay in the loop with all things <strong>Hi-Skule™</strong>!`,
    buttons: [{ label: "JOIN DISCORD", link: 'https://discord.gg/YsKmdBKRwD' }],
    image: { src: mentorPic.tenth, type: "vertical", position: "right" }
  }
];

// Automatically filter out any events that are marked as inactive
const activeEvents = mentorEvents.filter(event => event.isActive);

// Merge the active events to appear at the top, followed by the permanent cards
const mentorSections: MentorSection[] = [...activeEvents, ...permanentSections];

export default mentorSections;

