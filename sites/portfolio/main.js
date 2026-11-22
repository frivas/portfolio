/**
 * One row of the htop table and its detail panel.
 * @typedef {{c:string, st:[string,string], since:string, role:string, h:string, p:string,
 *   quiet?:string, img?:string, url?:string, pre?:string, f?:[string,string][], link?:[string,string], more?:[string,string], gap?:boolean}} Row
 */
/** @param {string} id */
const $=id=>/** @type {HTMLElement} */(document.getElementById(id));
/** @param {string} n */
const pj=n=>{const p=PROJECTS.find(p=>p.name===n);if(!p)throw new Error(`unknown project ${n}`);return p};
const base="";
/** Attributes that open a link in a new tab when it leaves the site. @param {string} href */
const ext=href=>/^https?:/.test(href)?' target="_blank" rel="noopener"':"";
// status: prod = real users in production, live = public app/site, rel = released software, al = always
/** @type {Row[]} */
const P=[
 {c:"family",st:["al","always"],since:"—",role:"husband, father of two",quiet:"nice -20<br>nothing gets scheduled ahead of this",
  h:"Family",p:"First, always. Everything else on this list runs around it."},
 {c:"faith",st:["al","always"],since:"—",role:"part of everything",quiet:"systemctl is-enabled faith<br><span style='color:var(--accent)'>enabled</span>",
  h:"Faith",p:"It shapes how I work, how I treat people and what I choose to spend my time on.",gap:true},
 {c:"cash-forecast",st:["prod","in production"],since:"2026",role:"led it, end to end",img:"img/1-dashboard.png",url:"cash-forecast · demo data",
  h:"Cash Flow Forecast",p:"Cash forecasting for a US water utility's Finance team: five years ahead, checked against its covenants every month.",
  f:[["Live since November 2026","SaaS, run on Navteca's Azure"],["52 releases in 11 weeks","about five a week, each security-checked"],["1,500+ automated backend tests","plus end-to-end tests of the key screens"]],
  link:["#work-case","→ read the case study"]},
 {c:"voice-atlas",st:["prod","in production"],since:"2019",role:"Navteca product",img:"img/voice-atlas.jpg",url:"voiceatlas.com",
  h:"Voice Atlas",p:"Navteca's generative-AI search for enterprise, government and science. It answers only from the documents you give it, in Teams, Slack, Zoom or any website.",
  f:[["In production since 2019","seven years, now on its second generation"],["Answers only from your sources","designed against made-up answers"]],
  link:["https://www.voiceatlas.com","→ voiceatlas.com"]},
 {c:"open-science-studio",st:["prod","in production"],since:"2023",role:"Navteca platform",img:"img/open-science-studio.jpg",url:"opensciencestudio.com",
  h:"Open Science Studio",p:"Navteca's JupyterHub platform for science: notebooks, Dask and shared tools that help researchers work together, with AI support powered by Voice Atlas.",
  f:[["In production","for research teams"],["Built on open source","JupyterHub, Dask and our own extensions"]],
  link:["https://www.opensciencestudio.com","→ opensciencestudio.com"]},
 {c:"jupyterlab-ext",st:["live","on PyPI"],since:"2023",role:"Navteca open source",url:"pypi.org · jupyterlab extensions",
  pre:`$ pip install jupyterlab-nbqueue\n\n<span class="ok">✓</span> jupyterlab-nbqueue      v0.1.47  35 releases\n<span class="ok">✓</span> resource-tracker        v0.2.25  25 releases\n<span class="ok">✓</span> jupyterlab-bxplorer     v0.2.32  17 releases\n<span class="ok">✓</span> jupyterlab-apibaker     v0.1.15  16 releases`,
  h:"JupyterLab extensions",p:"Open-source add-ons for Open Science Studio and any JupyterLab: browse cloud datasets, queue notebook runs, turn a notebook function into a secured API, and track resource use.",
  f:[["93 releases on PyPI","across four extensions"],["Install with one command","pip install, no setup"]],
  link:["https://github.com/Navteca/jupyterlab-nbqueue","→ source on GitHub"],gap:true},
 {c:"open-source",st:["live","merged"],since:"2026",role:"contributor",url:"github.com/agentregistry-dev",
  pre:`<span class="ok">✓</span> agentregistry  Helm chart (install on Kubernetes)\n<span class="ok">✓</span> agentregistry  Helm chart follow-ups\n<span class="ok">✓</span> agentregistry  Fix image version in the chart\n<span class="ok">✓</span> agentevals     Pydantic AI example\n<span class="ok">✓</span> agentevals     Request fix\n<span class="ok">✓</span> agentevals     README fix for PyPI`,
  h:"Open source",p:"Tools we use at work, improved in the open so others benefit too.",
  f:[["6 changes merged","by the projects' own maintainers"],["Helm chart for Agent Registry","lets teams install it on Kubernetes"]],
  link:["https://github.com/agentregistry-dev/agentregistry","→ agentregistry on GitHub"],gap:true},
 ...[["Roots","live","live app","2025"],["Gapwire","live","live app","2026"],["Reviewer","live","live app","2026"],
     ["Nestplay","rel","released","2026"],["Turnsmith","rel","v0.3.0","2026"],["Go Git Swap","rel","v0.1.0","2025"]].map(([n,k,s,y])=>{const p=pj(n);
   /** @type {Row} */
   const row={c:n.toLowerCase().replace(/ /g,"-"),st:[k,s],since:y,role:"built solo",img:base+p.shot,url:p.url.replace("https://",""),h:p.name,p:p.description,
     f:[[p.tagline,""]],link:[p.url,"→ "+(p.kind==="site"?"open the app":"open the site")]};
   if(n==="Roots")Object.assign(row,{role:"built with Juan González",
     p:"An open-source replacement for Raíces, the Community of Madrid's school system that families, teachers and students use every day, and that crashes at exam time. Built by two Madrid parents and free for the community.",
     f:[["Regional winner, EMEA","World's Largest Hackathon presented by Bolt, 2025, 130,000+ builders"],
        ["Built with Juan González",'<a href="https://portfolio.thecreativetoken.com" target="_blank" rel="noopener">portfolio.thecreativetoken.com</a>'],
        ["Free and open source","in English and Spanish"]],
     more:["https://devpost.com/software/roots-wpsx9u","→ see it on Devpost"]});
   return row})
];
const ps=$("ps"),dt=$("detail");
ps.innerHTML=P.map((p,i)=>`<tr data-i="${i}" tabindex="${i===2?0:-1}" class="${p.gap?"gap":""}"><td class="p">${p.c}</td><td><span class="st ${p.st[0]}">${p.st[1]}</span></td><td>${p.since}</td><td class="role">${p.role}</td></tr>`).join("");
const rows=/** @type {HTMLElement[]} */([...ps.children]);let cur=2;
/** @param {number} i @param {boolean} [focus] */
function sel(i,focus){cur=(i+P.length)%P.length;const p=P[cur];rows.forEach((r,j)=>{r.classList.toggle("sel",j===cur);r.tabIndex=j===cur?0:-1});if(focus)rows[cur].focus();
  const media=p.quiet?`<div class="quiet">${p.quiet}</div>`:`<div class="shot"><div class="addr"><span><svg viewBox="0 0 10 12" aria-hidden="true"><path d="M2.5 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="1" y="5" width="8" height="6.5" rx="1.2" fill="currentColor"/></svg>${p.url}</span></div>${p.pre?`<pre>${p.pre}</pre>`:`<img src="${p.img}" alt="${p.h} screenshot">`}</div>`;
  dt.innerHTML=`${media}<h3>${p.h}</h3><p>${p.p}</p>${p.f?`<ul class="facts">${p.f.map(([a,b])=>`<li><b>${a}</b>${b?` · ${b}`:""}</li>`).join("")}</ul>`:""}${[p.link,p.more].map(l=>l?`<a href="${l[0]}"${ext(l[0])}>${l[1]}</a>`:"").join(" ")}`}
rows.forEach((r,i)=>r.onclick=()=>sel(i));
ps.onkeydown=e=>{if(e.key==="ArrowDown"){sel(cur+1,true);e.preventDefault()}if(e.key==="ArrowUp"){sel(cur-1,true);e.preventDefault()}};
// hold the panel at its tallest row so the page below never moves
function fit(){const c=cur;dt.style.minHeight="";let m=0;for(let i=0;i<P.length;i++){sel(i);m=Math.max(m,dt.offsetHeight)}dt.style.minHeight=m+"px";sel(c)}
fit();document.fonts.ready.then(fit);addEventListener("resize",fit);
/** @type {Record<string,string>} */
const STATUS={Roots:"live app · EMEA winner",Gapwire:"live app · v1.0.0",Reviewer:"live app · works offline",Nestplay:"self-hosted · Go + tvOS",Turnsmith:"v0.3.0 · macOS, Linux, Windows","Go Git Swap":"v0.1.0 · CLI"};
$("mini").innerHTML=PROJECTS.map(p=>`<a class="mi" href="${p.url}"${ext(p.url)}><img src="${base+p.shot}" alt="${p.name} screenshot" loading="lazy"><div><h3>${p.name}</h3><p>${p.tagline}</p><small>${STATUS[p.name]}</small></div></a>`).join("");
