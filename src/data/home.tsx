
import {mentor} from '../assets/designapalooza'
import {team} from '../assets/coffeehouse'
import {event1, event2, event3} from '../assets/UTHSDC'


export const aboutUsSection = [
  {
    id: "about",
    content: " <strong>Hi-Skule™</strong> is an engineering outreach and mentorship club at the University of Toronto. We organize design challenges and networking events for high school students interested in engineering at UofT. We understand that choosing programs and universities is tough (we’ve been there as well!), so we aim to provide accurate and thorough information about engineering at UofT. ",
    imageSrc: team,
  },
  {
    id: "team",
    content:` We aim to:
    <br /><br />
    <strong>Explaining and Promoting the Engineering Profession: </strong>We work to raise awareness about what engineering entails, showcasing its importance and relevance in today’s world.<br /><br />
    <strong>Facilitating Opportunities for Mentorship:</strong> We connect young students with current engineering students and professors to foster relationships that can guide their educational journeys.<br /><br />
    <strong>Building an Engineering Mindset:</strong> Through innovative content created by current engineering students, we aim to instill a strong foundation of engineering principles in youth.`,
    imageSrc: mentor,
  },
];

export const eventData = {
  images: [event1, event2, event3],
  link: ' https://www.zeffy.com/en-CA/ticketing/university-of-toronto-high-school-design-competition-2t5',
}
