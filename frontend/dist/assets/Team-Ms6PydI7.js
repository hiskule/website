import{d as i,j as e,c as r,k as l,l as h}from"./index-ejFROgez.js";const c="/assets/team-CS6H2QrP.webp",d=i.div`
  background: white;
  border-radius: 2rem;
  margin: 0 auto;
  width: 70%;
  margin-top: 40px ;

  @media (max-width: 760px) {
   width: 90%;
  }

`,m=i.div`
  padding: 2rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,g=i.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
`,p=i.p`
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 100%;
`,u=({imageSrc:n,description:t})=>e.jsx(d,{children:e.jsxs(m,{children:[e.jsx("img",{src:n,alt:"Team Logo"}),e.jsx(g,{children:"OUR MISSION"}),e.jsx(p,{dangerouslySetInnerHTML:{__html:t}})]})}),w=i.div`
  background: white;
  border-radius: 2rem;
  width: 25%;
  min-width: 280px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: relative;
  max-width: 350px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 80%;
    min-width: 300px;
  }
`,k=i.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`,x=i.div`
  font-size: 1.5rem;
  font-weight: 700;
`,f=i.div`
  font-size: 1.2rem;
  font-weight: 600;
`,b=i.div`
  display: flex;
  flex-direction: column;
`,y=({data:n,onClick:t})=>{const o=s=>{s.stopPropagation()};return e.jsxs(w,{onClick:t,tabIndex:t?0:void 0,onKeyDown:s=>{s.key==="Enter"&&t&&t()},children:[e.jsx("img",{src:n.img,style:{borderRadius:"10px"}}),e.jsxs(b,{children:[e.jsx(x,{children:n.name}),e.jsx(f,{children:n.role})]}),e.jsxs(k,{children:[e.jsx("a",{href:n.emaillink,target:"_blank",rel:"noopener noreferrer",onClick:o,children:e.jsx(r,{size:48,color:"#000063"})}),e.jsx("a",{href:n.link,target:"_blank",rel:"noopener noreferrer",onClick:o,children:e.jsx(l,{size:48,color:"#000063"})})]})]})},v=i.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;

  > div {
    width: 80%;
    height: 60%;
    background: linear-gradient(198deg, #000063 0%, white 70%);
    border-radius: 2rem;
    padding: 1rem;

    @media (max-width: 760px) {
      height: 80%;
    }
  }
`,S=i.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 10px;
  

  @media (max-width: 760px) {
    flex-direction: column;
  }
`,j=i.div`
  width: 95%;
  max-width: 600px;
  border-radius: 1.5rem;
  padding: 1rem;
  text-align: left;
  gap: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 760px) {
    gap: 10px;
  }
`,C=i.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: black;
  margin: 0;

  @media (max-width: 760px) {
    font-size: 1.5rem;
  }
`,T=i.p`
  font-size: 1.2rem;
  font-weight: 400;
  color: black;
  line-height: 1.6;
  text-align: flex-start;
  margin: 0;

  @media (max-width: 760px) {
    font-size: 0.8rem;
  }
`,D=i.h2`
  font-size: 2rem;
  font-weight: 700;
  color: black;
  margin: 0;
  @media (max-width: 760px) {
    font-size: 1.2rem;
  }
`,H=i.img`
  height: 70%;
  border-radius: 10px;
  @media (max-width: 760px) {
    height: 60%;
  }
`,z=({data:n,onClose:t})=>n?e.jsx(v,{onClick:t,children:e.jsxs(S,{onClick:o=>o.stopPropagation(),children:[e.jsx(H,{src:n.img}),e.jsxs(j,{children:[e.jsx(C,{children:n.name}),e.jsx(D,{children:n.role}),e.jsx(T,{dangerouslySetInnerHTML:{__html:n.bio}})]})]})}):null,F="/assets/Abby-CBJRldlF.webp",M="/assets/Ashlee-3YuuCfF2.webp",A="/assets/Chris-B6NUAWt6.webp",E="/assets/Ivan-TYsMsmtI.webp",R="/assets/Justin-CA3SGQa8.webp",P="/assets/Melanie-44tnYbGf.webp",I="/assets/RyanG-ebP_jSKx.webp",L="/assets/RyanX-Da25Nwzk.webp",U="/assets/Saniya-DIwP6CNh.webp",Y="/assets/Tej-D0kjwGoj.webp",G="/assets/Tristan-Zm-PVBnf.webp",O="/assets/Anna-C-G3UjQt.webp",N="/assets/Roderick-BF5CxwOh.webp",a={imageSrc:c,description:"The <strong>Hi-Skule™</strong> directorship serves as the Engineering Society’s bridge between secondary and primary school students and the SKULE community. Our outreach efforts are designed to be engaging, enlightening, empowering, and invigorating for both students and executives alike."},_=[{name:"Justin Fang",role:"Director",bio:"This is Justin’s second year as an executive member of  <strong>Hi-Skule™</strong>. As this year’s Director, he's incredibly excited to engage with high school students, promote his passion for STEM, and curate opportunities for students to learn and experience engineering design while connecting them with awesome UofT mentors!",emaillink:"mailto:hiskule@skule.ca",link:"https://www.linkedin.com/in/justin-f-215093292/",img:R},{name:"Christopher Lee",role:"Vice Director of Operations",bio:"As the previous First Year Executive, Chris is determined to make his second year with  <strong>Hi-Skule™</strong> more impactful as the Vice Director of Operations. Using his past experience and knowledge, Chris aims to make  <strong>Hi-Skule™</strong> more engaging, helpful, and memorable for both mentors and prospective engineering students. Feel free to reach out for anything, he's always happy to share a conversation and can't wait to connect with you :)",emaillink:"mailto:operations@hiskule.skule.ca",link:"https://www.linkedin.com/in/christopher-lee-b60b43275/",img:A},{name:"Tristan Seto",role:"Vice Director - Events",bio:"Previously in marketing then logistics, Tristan's third year on the <strong>Hi-Skule™</strong> team is as the Vice-Director Events. From not knowing how to code in high school to specializing in electrical and computer engineering, Tristan is passionate about helping students create memorable experiences, discover the field of engineering, and help them align the discipline with their interests. Feel free to connect with him! ",emaillink:"mailto:events@hiskule.skule.ca",link:"https://www.linkedin.com/in/tristan-seto/",img:G},{name:"Ryan Xu",role:"Outreach Coordinator",bio:"Enjoys meeting new people and socializing, which is basically networking. Seems to be very similar to doing outreach, which makes outreach fun.",emaillink:"mailto:outreach@hiskule.skule.ca",link:"https://www.linkedin.com/in/ryan-xu-3b9809335/",img:L},{name:"Melanie Ye",role:"Logistics Coordinator",bio:"This is Melanie’s second year with <strong>Hi-Skule™</strong>, so she is eager to continue planning exciting events for younger students. She had an amazing time attending  <strong>Hi-Skule™</strong> events in Grade 12, so this is a very fulfilling position for her to be in. ",emaillink:"mailto:logistics@hiskule.skule.ca",link:"https://www.linkedin.com/in/melanie-ye",img:P},{name:"Ryan Goodfellow",role:"Logistics Coordinator",bio:"Ryan is looking forward to being back as the logistics coordinator for <strong>Hi-Skule™</strong> and using last years experience to improve his work for the club. He was inspired by the passion of the team and students from all the events last year and am excited to be back!!!",emaillink:"mailto:logistics@hiskule.skule.ca",link:"www.linkedin.com/in/ryan-goodfellow44",img:I},{name:"Ivan Zhuo",role:"Marketing Director",bio:"Ivan is beyond excited to be the Social Media Coordinator this year. Back in high school, he struggled a lot with choosing which university to attend, and wishes he knew about <strong>Hi-Skule™</strong> before making his decision. Now, as the Social Media Coordinator, he looks forward to finding new ways to engage high school students about upcoming events that <strong>Hi-Skule™</strong> and UofT Engineering have to offer!",emaillink:"mailto:socialmedia@hiskule.skule.ca",link:"https://www.linkedin.com/in/zhuoivan/",img:E},{name:"Ashlee Stone",role:"Content Coordinator",bio:"Ashlee is thrilled to be one of the Content Directors for <strong>Hi-Skule™</strong>! She is extremely excited to share her passion for engineering with the next generation through <strong>Hi-Skule™</strong>'s awesome events.",emaillink:"mailto:content@hiskule.skule.ca",link:"https://www.linkedin.com/in/ashlee-stone/",img:M},{name:"Saniya Veliyil",role:"Content Coordinator",bio:"This is Saniya's first year on <strong>Hi-Skule™</strong> as one of the content-coordinators and she is excited to plan fun and interactive events throughout the year. She looks forward to inspiring high school students to explore engineering and help create engaging experiences for students.",emaillink:"mailto:content@hiskule.skule.ca",link:"https://www.linkedin.com/in/saniya-veliyil-373379366",img:U},{name:"Tej Patel",role:"Finance Director ",bio:"Tej is thrilled to be working as the Finance Director for  <strong>Hi-Skule™</strong>, managing the budget as well as obtaining sponsorships. As a Mentor last year, he's excited to engage with students and promote learning in STEM, showing students what UofT Engineering has to offer.",emaillink:"mailto:finance@hiskule.skule.ca ",link:"https://www.linkedin.com/in/tejrpatel",img:Y},{name:"Abby Lui",role:"Mentorship Director & Webmaster",bio:"Abby is excited to be the Webmaster for <strong>Hi-Skule™</strong> this year. She hopes by creating the website you are currently on, she can help engage high school students and promote engineering in a fun way. She also looks forward to working with all our wonderful mentors to ensure events run smoothly!",emaillink:"mailto:webmaster@hiskule.skule.ca, mentorship@hiskule.skule.ca",link:"https://www.linkedin.com/in/abbylui123",img:F},{name:"Roderick Liao",role:"First-Year Executive",bio:"Roderick is thrilled to be one of the First-Year Executives for  this year. Having participated in Hi-Skule events for 3 years as a high school student, he now hopes to give back by inspiring the next generation of engineers. Don’t hesitate to reach out to him!",emaillink:"mailto:roderickliao25@gmail.com",link:"https://www.linkedin.com/in/roderick-liao-628957283/",img:N},{name:"Anna Wang",role:"First-Year Executive",bio:"Anna is thrilled to be one of this year’s First Year Executives at <strong>Hi-Skule™</strong>! She’s excited to bring new ideas, explore different departments, and learn along the way. She aims to make every event fun and memorable for students, mentors, and the team.",emaillink:"mailto:annaa.wangg1@gmail.com",link:"https://www.linkedin.com/in/anna-wang-9970a4367/",img:O}],B=i.div`
  width: 100vw;
  min-height: 100vh;    
  background: linear-gradient(180deg, #DBF1FD 15%, #000063 100%);
  padding-top: 60px;  
  display: flex;
  flex-direction: column;
  align-items: center;
`,V=i.h2`
  font-size: 3.5rem;
  color: #000063;
  font-weight: 700;
  margin-top: 4rem;
  margin-bottom: 2rem;
  text-align: center;
  width: 90%;

  @media (max-width: 760px) {
    font-size: 2.5rem;
  }
  
`,W=i.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`,K=()=>{const[n,t]=h.useState(null);return e.jsxs(B,{children:[e.jsx(u,{imageSrc:a.imageSrc,description:a.description}),e.jsx(V,{children:"Meet the Team"}),e.jsx(W,{children:_.map(o=>e.jsx(y,{data:o,onClick:()=>t(o)},o.name))}),n&&e.jsx(z,{data:n,onClose:()=>t(null)})]})};export{K as default};
