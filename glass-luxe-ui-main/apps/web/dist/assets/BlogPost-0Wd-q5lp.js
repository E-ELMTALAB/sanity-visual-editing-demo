import{am as B,a6 as U,r as l,j as e,an as b,aI as T,n as M,aH as q,m as V,aR as _,aS as O,aT as J,aU as Y,aV as Z,ai as K}from"./vendor-CwRQx74n.js";import{u as Q,d as P,S as C,H as W,c as j,v as X,w as ee,s as te}from"./index-LBGE2-cK.js";import{Footer as F}from"./Footer-DJk1lISp.js";import{B as re}from"./BlogCard-TmUSQ1_w.js";import oe from"./EnhancedMarkdownRenderer-yPgNMRRu.js";import"./use-image-fallback-CjPnrrL5.js";const ae={block:{normal:({children:o})=>e.jsx("p",{className:"font-vazirmatn text-lg font-normal leading-[1.9] text-muted-foreground mb-6",children:o}),h2:({children:o})=>{const n=`heading-${o?.toString().toLowerCase().replace(/\s+/g,"-")}`;return e.jsx("h2",{id:n,className:"font-vazirmatn text-[28px] font-extrabold leading-[1.3] text-foreground mt-12 mb-6 scroll-mt-24",children:o})},h3:({children:o})=>{const n=`heading-${o?.toString().toLowerCase().replace(/\s+/g,"-")}`;return e.jsx("h3",{id:n,className:"font-vazirmatn text-[22px] font-bold leading-[1.35] text-foreground mt-8 mb-4 scroll-mt-24",children:o})},blockquote:({children:o})=>e.jsx("blockquote",{className:"font-vazirmatn border-r-4 border-primary pr-6 py-4 my-8 rounded-xl bg-primary/10 italic text-foreground",children:o})},list:{bullet:({children:o})=>e.jsx("ul",{className:"font-vazirmatn list-disc pr-5 space-y-2 text-lg text-muted-foreground leading-[1.7] mb-6",children:o}),number:({children:o})=>e.jsx("ol",{className:"font-vazirmatn list-decimal pr-5 space-y-2 text-lg text-muted-foreground leading-[1.7] mb-6",children:o})},marks:{link:({children:o,value:n})=>e.jsx("a",{href:n?.href,target:"_blank",rel:"noopener noreferrer",className:"font-vazirmatn text-primary underline underline-offset-2 hover:no-underline",children:o})},types:{image:({value:o})=>{const n=o?.asset?.url,h=o?.alt||"";return n?e.jsx("img",{src:n,alt:h,className:"rounded-2xl my-8 ring-1 ring-white/10 w-full object-cover",loading:"lazy"}):null}}};function pe(){const{slug:o}=B();U();const{isRTL:n}=Q(),[h,A]=l.useState(0),[G,E]=l.useState(""),[w,v]=l.useState([]),[t,H]=l.useState(null),[y,L]=l.useState([]),[I,f]=l.useState(!0),[N,p]=l.useState(null),d=l.useRef(null);l.useEffect(()=>{if(!o){f(!1),p("آدرس مقاله نامعتبر است");return}let r=!0;async function a(){try{f(!0);const i=await X(o);if(!r)return;if(!i){p("مقاله مورد نظر یافت نشد");return}H(ee(i));const c=Array.isArray(i?.relatedPosts)?i.relatedPosts.map((s,m)=>te(s,m)):[];L(c),p(null)}catch(i){console.error("[BLOG POST] Failed to fetch article",i),r&&p("خطا در بارگذاری مقاله")}finally{r&&f(!1)}}return a(),()=>{r=!1}},[o]),l.useEffect(()=>{if(!t){v([]);return}const a=setTimeout(()=>{if(!d.current)return;const i=d.current.querySelectorAll("h2, h3"),c=Array.from(i).map((s,m)=>{if(!s.id){const g=(s.textContent?.trim()||"").toLowerCase().replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim()||`heading-${m}`;s.id=g}return{id:s.id,text:s.textContent?.trim()||"",level:parseInt(s.tagName[1])}}).filter(s=>s.text);v(c)},200);return()=>clearTimeout(a)},[t]),l.useEffect(()=>{const r=()=>{if(!d.current)return;const a=window.innerHeight,i=document.documentElement.scrollHeight,c=window.scrollY,s=i-a,m=Math.min(c/s*100,100);A(m);const z=d.current.querySelectorAll("h2, h3");let g="";z.forEach(S=>{S.getBoundingClientRect().top<=150&&(g=S.id)}),E(g)};return window.addEventListener("scroll",r,{passive:!0}),r(),()=>window.removeEventListener("scroll",r)},[t]);const R=r=>{const a=document.getElementById(r);if(a){const c=a.offsetTop-100;window.scrollTo({top:c,behavior:"smooth"})}},D=r=>new Date(r).toLocaleDateString("fa-IR",{year:"numeric",month:"long",day:"numeric"}),u=typeof window<"u"?window.location.href:"",$=t?.title||"",x=r=>{let a="";switch(r){case"twitter":a=`https://twitter.com/intent/tweet?text=${encodeURIComponent($)}&url=${encodeURIComponent(u)}`;break;case"facebook":a=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`;break;case"linkedin":a=`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`;break;case"copy":navigator.clipboard.writeText(u),K.success("لینک کپی شد");return}a&&window.open(a,"_blank","width=600,height=400")},k=t?{"@context":"https://schema.org","@type":"Article",headline:t.title,image:t.cover,datePublished:t.publishedAt,dateModified:t.publishedAt,author:{"@type":"Person",name:t.author?.name||"SharifGPT",image:t.author?.avatar},publisher:{"@type":"Organization",name:"SharifGPT",logo:{"@type":"ImageObject",url:"https://sharifgpt.ai/logo.png"}},description:t.excerpt||t.title}:null;return I?e.jsx("div",{className:"min-h-screen flex items-center justify-center",children:e.jsx("div",{className:"animate-pulse text-muted-foreground font-vazirmatn",children:"در حال بارگذاری..."})}):!t||N?e.jsxs("div",{dir:"rtl",className:"min-h-screen flex flex-col",children:[e.jsx(P,{onSearch:()=>{},active:"blog"}),e.jsx("main",{className:"flex-1 flex items-center justify-center pt-[84px] px-4",children:e.jsxs("div",{className:"text-center max-w-md",children:[e.jsx("h1",{className:"font-vazirmatn text-2xl font-bold text-foreground mb-4",children:"مقاله یافت نشد"}),e.jsx("p",{className:"font-vazirmatn text-muted-foreground mb-6",children:N||"مقاله مورد نظر وجود ندارد."}),e.jsx(C,{className:"inline-block",children:e.jsx(b,{to:"/blog",className:"font-vazirmatn px-6 py-3 rounded-lg hover:bg-surface-glass/50 transition-colors block",children:"بازگشت به مقالات"})})]})}),e.jsx(F,{links:{products:"/products",magazine:"/blog",courses:"/courses",pricing:"/pricing",support:"/support"},socials:[]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(W,{children:[e.jsx("title",{children:t?.seo?.metaTitle||`${t.title} - مجله SharifGPT`}),e.jsx("meta",{name:"description",content:t?.seo?.metaDescription||t?.excerpt||"مقاله‌ای از مجله SharifGPT"}),e.jsx("link",{rel:"canonical",href:t?.seo?.canonicalUrl||`${window.location.origin}/blog/${o}`}),t?.seo?.robotsMeta&&e.jsx("meta",{name:"robots",content:t.seo.robotsMeta}),e.jsx("meta",{property:"og:type",content:"article"}),e.jsx("meta",{property:"og:title",content:t?.seo?.openGraphTitle||t?.seo?.metaTitle||t?.title||"SharifGPT"}),e.jsx("meta",{property:"og:description",content:t?.seo?.openGraphDescription||t?.seo?.metaDescription||t?.excerpt||"مقاله‌ای از مجله SharifGPT"}),e.jsx("meta",{property:"og:url",content:t?.seo?.canonicalUrl||`${window.location.origin}/blog/${o}`}),(t?.seo?.openGraphImage||t?.cover)&&e.jsx("meta",{property:"og:image",content:t?.seo?.openGraphImage||t?.cover}),e.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),e.jsx("meta",{name:"twitter:title",content:t?.seo?.openGraphTitle||t?.seo?.metaTitle||t?.title||"SharifGPT"}),e.jsx("meta",{name:"twitter:description",content:t?.seo?.openGraphDescription||t?.seo?.metaDescription||t?.excerpt||"مقاله‌ای از مجله SharifGPT"}),(t?.seo?.openGraphImage||t?.cover)&&e.jsx("meta",{name:"twitter:image",content:t?.seo?.openGraphImage||t?.cover}),t?.publishedAt&&e.jsx("meta",{property:"article:published_time",content:t.publishedAt}),t?.author?.name&&e.jsx("meta",{property:"article:author",content:t.author.name}),(t?.tags??[]).map(r=>e.jsx("meta",{property:"article:tag",content:r},r)),k&&e.jsx("script",{type:"application/ld+json",children:JSON.stringify(k)}),t?.seo?.structuredData&&e.jsx("script",{type:"application/ld+json",children:t.seo.structuredData})]}),e.jsx("div",{className:"fixed top-0 left-0 h-1 z-50 transition-all duration-150",style:{width:`${h}%`,background:"linear-gradient(to right, hsl(var(--primary)), hsl(217 91% 60%))"}}),e.jsxs("div",{dir:"rtl",className:"min-h-screen flex flex-col",children:[e.jsx(P,{onSearch:()=>{},active:"blog"}),e.jsx("main",{className:"flex-1 pt-[84px]",children:e.jsxs("div",{className:"max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8",children:[e.jsxs("nav",{className:"mb-6 flex items-center gap-2 font-vazirmatn text-sm font-normal leading-[1.4]",children:[e.jsx(b,{to:"/",className:"text-muted-foreground hover:text-foreground transition-colors max-w-[200px] md:max-w-[400px] truncate",children:"خانه"}),e.jsx(T,{className:j("w-4 h-4 text-muted-foreground",n&&"rotate-180")}),e.jsx(b,{to:"/blog",className:"text-muted-foreground hover:text-foreground transition-colors max-w-[200px] md:max-w-[400px] truncate",children:"مقالات"}),e.jsx(T,{className:j("w-4 h-4 text-muted-foreground",n&&"rotate-180")}),e.jsx("span",{className:"text-foreground max-w-[200px] md:max-w-[400px] truncate",children:t.title})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12",children:[e.jsxs("article",{children:[t.cover&&e.jsxs(M.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"relative mb-8 rounded-3xl overflow-hidden ring-1 ring-white/12",children:[e.jsx("img",{src:t.cover,alt:t.title,className:"w-full aspect-[2/1] object-cover",loading:"lazy"}),e.jsx("div",{className:"absolute inset-0 pointer-events-none",style:{background:"linear-gradient(to top, rgba(0,0,0,0.4), transparent, rgba(0,0,0,0.2))"}})]}),e.jsx("h1",{className:"font-vazirmatn text-[30px] md:text-[36px] lg:text-[48px] font-black leading-[1.2] text-foreground mb-6",children:t.title}),e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[t.author?.avatar?e.jsx("img",{src:t.author.avatar,alt:t.author?.name||"",className:"w-10 h-10 rounded-full ring-1 ring-white/20 bg-white/10 object-cover",loading:"lazy"}):e.jsx("div",{className:"w-10 h-10 rounded-full ring-1 ring-white/20 bg-white/10 flex items-center justify-center",children:e.jsx(q,{className:"w-5 h-5 text-muted-foreground"})}),e.jsx("span",{className:"font-vazirmatn text-base font-medium leading-[1.4] text-foreground",children:t.author?.name||"SharifGPT"})]}),e.jsxs("div",{className:"flex items-center gap-4 mb-6 font-vazirmatn text-sm font-normal leading-[1.4] text-muted-foreground",children:[t.publishedAt&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:D(t.publishedAt)}),e.jsx("span",{className:"text-white/30",children:"•"})]}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(V,{className:"w-4 h-4"}),t.readTime??0," دقیقه"]})]}),e.jsxs("div",{className:"flex items-center gap-3 pb-8 mb-8 border-b border-white/10",children:[e.jsx("span",{className:"font-vazirmatn text-sm font-normal leading-[1.4] text-muted-foreground",children:"اشتراک:"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{onClick:()=>x("twitter"),className:"w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center","aria-label":"Share on Twitter",children:e.jsx(_,{className:"w-4 h-4 text-foreground"})}),e.jsx("button",{onClick:()=>x("facebook"),className:"w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center","aria-label":"Share on Facebook",children:e.jsx(O,{className:"w-4 h-4 text-foreground"})}),e.jsx("button",{onClick:()=>x("linkedin"),className:"w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center","aria-label":"Share on LinkedIn",children:e.jsx(J,{className:"w-4 h-4 text-foreground"})}),e.jsx("button",{onClick:()=>x("copy"),className:"w-9 h-9 rounded-full glass border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center","aria-label":"Copy link",children:e.jsx(Y,{className:"w-4 h-4 text-foreground"})})]})]}),t.tags&&t.tags.length>0&&e.jsx("div",{className:"flex flex-wrap gap-2 mb-8",children:t.tags.map(r=>e.jsx("span",{className:"font-vazirmatn text-sm font-normal leading-[1.4] text-foreground px-4 py-1.5 rounded-full glass border border-white/20",children:r},r))}),e.jsx("div",{ref:d,className:"prose prose-lg max-w-none font-vazirmatn",dir:"rtl",children:t.bodyMarkdown&&t.bodyMarkdown.trim()?e.jsx(oe,{content:t.bodyMarkdown}):t.body&&Array.isArray(t.body)&&t.body.length>0?e.jsx(Z,{value:t.body,components:ae}):e.jsx("p",{className:"font-vazirmatn text-muted-foreground text-center py-8",children:"محتوای این مقاله در دسترس نیست."})})]}),e.jsx("aside",{className:"hidden lg:block",children:e.jsx("div",{className:"sticky top-24",children:e.jsxs(C,{className:"p-6 rounded-2xl border border-white/20",children:[e.jsx("h3",{className:"font-vazirmatn text-lg font-bold leading-[1.4] text-foreground mb-4",children:"فهرست مطالب"}),e.jsx("nav",{className:"space-y-1",dir:"rtl",children:w.length>0?w.map(r=>e.jsx("button",{onClick:()=>R(r.id),className:j("block w-full text-right py-2 px-3 rounded-lg transition-colors font-vazirmatn text-sm leading-[1.4]",r.level===1?"font-bold":r.level===2?"pr-3":"pr-6 text-xs",G===r.id?"bg-primary/20 text-primary font-semibold":"text-muted-foreground hover:bg-white/5 hover:text-foreground"),children:r.text},r.id)):e.jsx("p",{className:"font-vazirmatn text-sm text-muted-foreground text-right",children:"فهرست مطالب در دسترس نیست"})})]})})})]}),y.length>0&&e.jsxs("section",{className:"mt-16 pt-12 border-t border-white/10",children:[e.jsx("h2",{className:"font-vazirmatn text-2xl md:text-[30px] font-bold leading-[1.3] text-foreground mb-8",children:"مقالات مرتبط"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:y.map(r=>e.jsx(re,{post:r},r.slug))})]})]})}),e.jsx(F,{links:{products:"/products",magazine:"/blog",courses:"/courses",pricing:"/pricing",support:"/support"},socials:[]})]}),e.jsx("style",{children:`
        .prose {
          color: hsl(var(--muted-foreground));
        }

        .prose h2 {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.3;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: hsl(var(--foreground));
          scroll-margin-top: 6rem;
        }

        .prose h3 {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
          scroll-margin-top: 6rem;
        }

        .prose p {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          color: hsl(var(--muted-foreground));
        }

        .prose ul,
        .prose ol {
          font-family: 'Vazirmatn', sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          padding-right: 1.25rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
          color: hsl(var(--muted-foreground));
        }

        .prose blockquote {
          font-family: 'Vazirmatn', sans-serif;
          border-right: 4px solid hsl(var(--primary));
          padding-right: 1.5rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
          margin: 2rem 0;
          background: hsl(var(--primary) / 0.1);
          border-radius: 12px;
          font-style: italic;
        }

        .prose blockquote p {
          margin: 0;
          color: hsl(var(--foreground));
        }

        .prose pre {
          font-family: 'Courier New', monospace;
          background: hsl(var(--surface-glass));
          border: 1px solid hsl(var(--border-glass));
          border-radius: 16px;
          padding: 1.5rem;
          margin: 2rem 0;
          overflow-x: auto;
        }

        .prose code {
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
          color: hsl(var(--primary));
        }

        .prose pre code {
          color: hsl(var(--foreground));
        }

        .prose a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .prose a:hover {
          text-decoration: none;
        }
      `})]})}export{pe as default};
