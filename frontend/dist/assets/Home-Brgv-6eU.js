import{d as n,j as e,r as s,u as w}from"./index-ejFROgez.js";import{L as v}from"./hiskule_full-CSxDoxSR.js";import{t as b}from"./team-8MUwg6L8.js";import{C as j}from"./carousel-Dr-6OAqF.js";const y="/assets/mentor-BwUZUT86.webp",S=n.div`
  width: 100%;
  min-height: 80vh; 
  position: relative;
  background: linear-gradient(180deg, #000063 0%, #D9D9D9 100%);
  overflow: hidden; 
  flex-wrap: wrap;

  @media (max-width: 760px) {
    min-height: 50vh; 
  }
`,k=n.img`
  width: 60vw;
  max-width: 600px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`,E=()=>e.jsx(S,{children:e.jsx(k,{src:v})}),c=n.div`
  color: #000063;
  font-size: 3rem;
  font-weight: 700;
  font-family: "Inter", sans-serif;

  @media (max-width: 760px) {
    font-size: 2rem;
  }

`,T=n.div`
  padding: 50px 60px;

  @media (max-width: 760px) {
    padding-bottom: 0px;
  }
`,z=n.div`
  position: sticky;
  top: 100px;
  z-index: 10;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  
  @media (max-width: 760px) {
    display: none;
  }

`,g=n.div`
  disply: flex;
  flex-direction: column;
  width: 40%;

  @media (max-width: 760px) {
    width: 100%;
  }

`,x=n.div`
  font-size: 1.5rem;
  font-family: "Inter", sans-serif;
  width: 100%;

  @media (max-width: 760px) {
    font-size: 1rem;
  }
`,I=n.div`
  height: 100vh;
  @media (max-width: 760px) {
    display: none;
  }
`,h=n.img`
  width: 40%;
  height: auto;
  object-fit: contain;

  @media (max-width: 760px) {
    width: 100%;
    border-radius: 10px;
    margin: 10px 0;
  }


`,U=n.div`
  display: none;

  @media (max-width: 760px) {
    display: flex ;
    flex-direction: column;
  }
`,C="/assets/conference1-Ba3extzv.webp",H="/assets/conference2-DrHijDZy.webp",a=[{id:"about",content:" <strong>Hi-Skule™</strong> is an engineering outreach and mentorship club at the University of Toronto. We organize design challenges and networking events for high school students interested in engineering at UofT. We understand that choosing programs and universities is tough (we’ve been there as well!), so we aim to provide accurate and thorough information about engineering at UofT. ",imageSrc:b},{id:"team",content:` We aim to:
    <br /><br />
    <strong>Explaining and Promoting the Engineering Profession: </strong>We work to raise awareness about what engineering entails, showcasing its importance and relevance in today’s world.<br /><br />
    <strong>Facilitating Opportunities for Mentorship:</strong> We connect young students with current engineering students and professors to foster relationships that can guide their educational journeys.<br /><br />
    <strong>Building an Engineering Mindset:</strong> Through innovative content created by current engineering students, we aim to instill a strong foundation of engineering principles in youth.`,imageSrc:y}],l={images:[C,H],link:"https://www.zeffy.com/en-CA/ticketing/utechs-university-of-toronto-engineering-conference-for-high-schoolers"},B=()=>{const[r,p]=s.useState(0),d=s.useRef([]);s.useEffect(()=>{const i=new IntersectionObserver(t=>{for(const o of t)if(o.isIntersecting){const u=Number(o.target.getAttribute("data-index"));p(u);break}},{threshold:.6});return d.current.forEach(t=>{t&&i.observe(t)}),()=>i.disconnect()},[]);const{content:m,imageSrc:f}=a[r];return e.jsxs(T,{children:[e.jsxs(z,{children:[e.jsxs(g,{children:[e.jsx(c,{children:"ABOUT US"}),e.jsx(x,{dangerouslySetInnerHTML:{__html:m}})]}),e.jsx(h,{src:f})]}),a.map((i,t)=>e.jsx(I,{"data-index":t,ref:o=>{d.current[t]=o}},t)),e.jsxs(U,{children:[e.jsx(c,{children:"ABOUT US"}),a.map((i,t)=>e.jsxs("div",{children:[e.jsx(g,{children:e.jsx(x,{dangerouslySetInnerHTML:{__html:i.content}})}),e.jsx(h,{src:i.imageSrc})]},t))]})]})},M=n.div`
  margin: 0 auto;
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    padding: 50px 40px;
  }
`,R=n.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`,D=n.h2`
  color: #000063;
  font-size: 2.5rem;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;

  @media (max-width: 760px) {
    font-size: 2rem;
  }
`,N=n.div`
  width: 12px;
  height: 12px;
  background: #e50e32;
  border-radius: 50%;

  @media (max-width: 760px) {
    display: none;
  }
`,A=n.div`
  width: 60%;
  padding: 24px;
  background: #d9d9d9;
  border-radius: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    width: 100%;
  }

`,O=n.div`
  width: 80%;
  padding-right: 8%;

  @media (max-width: 760px) {
    width: 100%;
    padding-right: 15%;
  }

`,W=n.button`
  background: #000063;
  border: none;
  border-radius: 48px;
  padding: 12px 32px;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #001199;
  }
`,_=n.button`
  background: #000063;
  color: #ffd712;
  border: none;
  border-radius: 48px;
  padding: 12px 32px;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 32px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`,L=()=>{const r=w();return e.jsxs(M,{children:[e.jsxs(R,{children:[e.jsx(D,{children:"UPCOMING EVENTS"}),e.jsx(N,{})]}),e.jsxs(A,{children:[e.jsx(O,{children:e.jsx(j,{images:l.images})}),e.jsx(W,{onClick:()=>{window.open(l.link,"_blank")},children:"REGISTER"})]}),e.jsx(_,{onClick:()=>r("/event"),children:"MORE EVENTS"})]})},P=n.div`
  width: 100vw;
  min-height: 100vh;    
  position: relative;
  background: linear-gradient(180deg, white 15%, #c9ecffff 100%);
  padding-top: 60px;  
`,Y=()=>e.jsxs(P,{children:[e.jsx(E,{}),e.jsx(B,{}),e.jsx(L,{})]});export{Y as default};
