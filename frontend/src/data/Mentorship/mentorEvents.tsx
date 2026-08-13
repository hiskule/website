import type { MentorSection } from './mentorTypes';
import * as coffee from '../../assets/coffeehouse';
import * as DC from '../../assets/UTHSDC';
import * as design from '../../assets/designapalooza';
import * as prefrosh from '../../assets/prefrosh';
import { ACTIVE_EVENT_ID } from '../activeEvent';

// Add all your past and future events here. 
// The `isActive` flag is automatically controlled by `ACTIVE_EVENT_ID` in `activeEvent.ts`!
export const mentorEvents: MentorSection[] = [
  {
    header: "MENTORSHIP COFFEEHOUSE MENTOR SIGN UP",
    text: `The Mentorship Coffeehouse is an amazing opportunity to connect with high-school students, share your experiences on UofT Engineering design teams, and help them participate in fun engineering activities. Sign up as a mentor to inspire the next generation!`,
    buttons: [{ label: "SIGN UP ON GOOGLE FORMS", link: '' }],
    image: { src: coffee.coffeehouseImages.mentors[0], type: "horizontal", position: "left" },
    isActive: ACTIVE_EVENT_ID === "COFFEEHOUSE", 
  },
  {
    header: "UTHSDC MENTOR SIGN UP",
    text: `Join us as a mentor for the University of Toronto High School Design Competition (UTHSDC)! Guide high school students as they take on real-world engineering problems, helping them refine their solutions and build problem-solving skills.`,
    buttons: [{ label: "SIGN UP ON GOOGLE FORMS", link: '' }],
    image: { src: DC.uthsdcImages.mentors[0], type: "horizontal", position: "left" },
    isActive: ACTIVE_EVENT_ID === "UTHSDC", 
  },
  {
    header: "DESIGNAPALOOZA MENTOR SIGN UP",
    text: `Want to be a mentor for <strong>Hi-Skule™</strong>’s most technical event of the year? Lead hands-on workshops across different engineering fields and help high school students tackle real-world challenges at Designapalooza!`,
    buttons: [{ label: "SIGN UP ON GOOGLE FORMS", link: '' }],
    image: { src: design.designapaloozaImages.mentors[0], type: "horizontal", position: "left" },
    isActive: ACTIVE_EVENT_ID === "DESIGNAPALOOZA",
  },
  {
    header: "PRE-FROSH MENTOR SIGN UP",
    text: `HEY FUTURE ENGINEERS! 🎉💜 Help us welcome the incoming class at PRE-FROSH! We need enthusiastic mentors to lead games, activities, and show off our nonstop Skule spirit. Join us in making this an unforgettable experience!`,
    buttons: [{ label: "SIGN UP ON GOOGLE FORMS", link: '' }],
    image: { src: prefrosh.first, type: "horizontal", position: "left" },
    isActive: ACTIVE_EVENT_ID === "PREFROSH", 
  }
];
