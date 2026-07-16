import{d as i,j as t}from"./index-ejFROgez.js";import{t as a}from"./team-8MUwg6L8.js";import{f as l}from"./1-DQPXfM0I.js";const d="/assets/mentor-B7xd8GC9.webp",m="/assets/8-B2flr7yz.webp",c="/assets/10-D6V527KT.webp",h=[{header:"Designapalooza 2T6 MENTOR SIGN UP",text:"Want to be a mentor for <strong>Hi-Skule™</strong>’s most technical event of the year? Sign up as a Designapalooza Mentor and help us run this event smoothly on February 28!",buttons:[{label:"SIGN UP",link:""}],image:{src:l,type:"horizontal",position:"left"}},{header:"MENTOR MAILING LIST SIGN UP",text:"Become a mentor today and have the opportunity to guide young students who are curious about pursuing a career in STEM. By signing up to be a <strong>Hi-Skule™</strong> mentor you’ll be notified when volunteer signup is available for all <strong>Hi-Skule™</strong> Mentorship Events.",buttons:[{label:"SIGN UP",link:"https://docs.google.com/forms/d/e/1FAIpQLSdM_ZME1zqUSYguJBbzbUHJrsWxeS6MwKpEMrgXzfxXadv_Ig/viewform"}],image:{src:d,type:"horizontal",position:"right"}},{header:"First Year Executive",text:"Ready to make an impact as a first year? Join the 2T5-2T6 <strong>Hi-Skule™</strong> exec team today! Help recruit mentors and inspire the next generation of engineers",buttons:[{label:"SIGN UP",link:""}],image:{src:m,type:"vertical",position:"left"}},{header:"STAY INVOLVED",text:"Want to help out? Join our Discord to stay in the loop with all things <strong>Hi-Skule™</strong>!",buttons:[{label:"JOIN DISCORD",link:"https://discord.gg/YsKmdBKRwD"}],image:{src:c,type:"vertical",position:"right"}}],n=i.img`
  width: 30%;
  height: auto;
  border-radius: 25px;

  @media (max-width: 760px) {
    width: 80%;
  }
`,r=i.img`
  width: 40%;
  height: auto;
  border-radius: 25px;

  @media (max-width: 760px) {
    width: 80%;
  }
`,g=i.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
  text-align: left;

  @media (max-width: 760px) {
    width: 80%;
  }
`,p=i.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 40px;


  @media (max-width: 760px) {
    flex-direction: column;
    gap: 20px;
  }
`,x=i.p`
  color: black;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 800px;
  margin: 0 auto;

    @media (max-width: 760px) {
   font-size: 1rem;
  }
`,u=i.h1`
  color: #000063;
  font-size: 2.5rem;
  font-weight: 700;
  margin-top:0;

  @media (max-width: 760px) {
   font-size: 2rem;
  }
`,f=i.button`
  background: ${({$hasLink:e})=>e?"#000063":"#fff"};
  color: ${({$hasLink:e})=>e?"#ffd712":"#000"};
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.6rem 2rem;
  border-radius: 2rem;
  border: 1px #000063 solid;
  cursor: ${({$hasLink:e})=>e?"pointer":"default"};
  margin-top: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    opacity: ${({$hasLink:e})=>e?.8:1};
  }
`,w=({data:e})=>t.jsxs(p,{children:[e.image?.position==="left"&&(e.image.type==="horizontal"?t.jsx(r,{src:e.image.src}):t.jsx(n,{src:e.image.src})),t.jsxs(g,{children:[t.jsx(u,{children:e.header}),t.jsx(x,{dangerouslySetInnerHTML:{__html:e.text}}),e.buttons.map((o,s)=>t.jsx(f,{$hasLink:!!o.link,onClick:()=>{o.link&&window.open(o.link,"_blank")},children:o.label},s))]}),e.image?.position==="right"&&(e.image.type==="horizontal"?t.jsx(r,{src:e.image.src}):t.jsx(n,{src:e.image.src}))]}),b=i.div`
  width: 100vw;
  min-height: 100vh;    
  position: relative;
  background: linear-gradient(180deg, white 15%, #DBF1FD 100%);
  padding-top: 60px;  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,S=i.h1`
  color: #000063;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  @media (max-width: 760px) {
    font-size: 2rem;
  }
`,y=i.h2`
  color: black;
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  @media (max-width: 760px) {
    font-size: 1.2rem;
  }
`,v=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  padding: 20px;
  margin: 25px 0;
`,k=i.img`
  width: 60%;
  height: auto;
  border-radius: 30px;

  @media (max-width: 760px) {
    width: 90%;
  }
`,M=()=>t.jsxs(b,{children:[t.jsxs(v,{children:[t.jsx(S,{children:"MENTORS ARE OUR BACKBONE"}),t.jsxs(y,{children:["Volunteer mentors are the lifeblood of our events. Without them, ",t.jsx("strong",{children:"Hi-Skule™"})," would be unable to run events at the scale we do."]}),t.jsx(k,{src:a})]}),h.map((e,o)=>t.jsx(w,{data:e},o))]});export{M as default};
