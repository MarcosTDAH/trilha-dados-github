'use strict';
const paths={painel:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',trilhas:'M3 5h7l2 2 2-2h7v14h-7l-2 2-2-2H3zM12 7v14',revisoes:'M3 12a9 9 0 1 1 3 7M3 5v7h7M12 7v5l4 2',historico:'M3 3v18h18M7 16l4-5 4 2 5-7',certificados:'M8 14l-2 8 6-3 6 3-2-8M12 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14',tempo:'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18M12 7v5l4 2',check:'m5 12 4 4L19 6',cal:'M3 5h18v16H3zM3 10h18M7 3v4M17 3v4'};
const icon=k=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+paths[k]+'"/></svg>';
const tabs={painel:'Visão geral',trilhas:'Certificações',revisoes:'Revisões',historico:'Histórico',certificados:'Certificados'};
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=v=>{try{const u=new URL(v);return /^https?:$/.test(u.protocol)?esc(u.href):''}catch{return ''}};
const link=(v,label)=>url(v)?'<a href="'+url(v)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>':'';
const day=(t=Date.now())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo',dateStyle:'short'}).format(t);
const plus=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const fmt=d=>d?d.split('-').reverse().join('/'):'Sem prazo';
const hrs=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:2})+' h';
const uid=()=>crypto.randomUUID();
const ibm='https://www.coursera.org/professional-certificates/ibm-data-analyst';
const pl='https://learn.microsoft.com/pt-br/credentials/certifications/power-bi-data-analyst-associate/';
const plan=[
 ['Fundamentos de análise de dados',12,4,'introduction-to-data-analytics','Faça o diagnóstico e avance pelas avaliações disponíveis. Relacione o ciclo de análise aos seus relatórios de operações.'],
 ['Excel para análise de dados',13,6,'excel-basics-data-analysis-ibm','Use sua experiência em Excel para ir direto aos exercícios de limpeza, fórmulas e tabelas dinâmicas.'],
 ['Visualização e dashboards com Excel e Cognos',16,12,'data-visualization-dashboards-excel-cognos','Transfira sua experiência em Power BI para o laboratório de Cognos. Priorize aprender a ferramenta.'],
 ['Python para ciência de dados e IA',24,12,'python-for-applied-data-science-ai','Valide fundamentos nos exercícios e dedique mais tempo a NumPy, APIs e notebooks.'],
 ['Projeto de Python para ciência de dados',7,7,'python-project-for-data-science','Entregue um notebook reproduzível com coleta, limpeza e visualização.'],
 ['Bancos de dados e SQL com Python',18,10,'sql-data-science','Faça os laboratórios de JOINs, subconsultas, transações e integração com Python.'],
 ['Análise de dados com Python',16,13,'data-analysis-with-python','Priorize análise exploratória e interpretação de regressões.'],
 ['Visualização de dados com Python',19,14,'python-for-data-visualization','Use sua base em matplotlib e teste Plotly e dashboards interativos.'],
 ['Projeto final IBM Data Analyst',26,26,'ibm-data-analyst-capstone-project','Reserve tempo para coleta, tratamento, análise e apresentação. Prepare uma versão para o portfólio.'],
 ['IA generativa para análise de dados',16,8,'generative-ai-enhance-your-data-analytics-career','Compare saídas da IA com verificações em SQL ou Python.'],
 ['Carreira e preparação para entrevistas',13,6,'data-analyst-career-guide-and-interview-preparation','Transforme seus projetos de automação e análise em casos de entrevista.']
];
let acc=0;
const courses=plan.map(([name,official,h,slug,next],i)=>{acc+=h;return {id:'ibm-'+i,name,official,h,next,url:'https://www.coursera.org/learn/'+slug,deadline:plus(day(),Math.ceil(acc/4)-1),order:i+1,pct:0,hard:'',known:'',gap:''}});
const seed={hours:4,certs:[{id:'ibm',name:'IBM Data Analyst Professional Certificate',provider:'IBM · Coursera',url:ibm,access:'Acesso gratuito',deadline:plus(day(),Math.ceil(acc/4)-1),order:1,status:'Em andamento',credential:'',courses}],sessions:[],reviews:[],history:[]};
const storage='trilha-dados-v1';
let s;try{s=JSON.parse(localStorage.getItem(storage))||seed}catch{s=seed}
const ordered=items=>[...items].sort((a,b)=>a.order-b.order);
const active=()=>ordered(s.certs).find(c=>c.status==='Em andamento')??ordered(s.certs).find(c=>c.status==='Planejada');
const pct=c=>c.status==='Concluída'?100:c.courses.length?Math.round(c.courses.reduce((a,b)=>a+b.pct,0)/c.courses.length):0;
const hours=d=>s.sessions.filter(x=>x.date===d).reduce((a,b)=>a+b.hours,0);
const pending=()=>s.reviews.filter(x=>!x.done).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));
const deadlines=d=>d&&d<day()?'Prazo vencido · '+fmt(d):fmt(d);
const bar=p=>'<div class="bar" role="progressbar" aria-label="Progresso" aria-valuenow="'+p+'"><i style="width:'+p+'%"></i></div>';
const button=(a,l,id='',cls='outline')=>'<button class="'+cls+'" data-act="'+a+'" data-id="'+esc(id)+'">'+esc(l)+'</button>';
const intro=(title,sub,action='')=>'<div class="intro"><div><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div>'+action+'</div>';
const section=(title,action='')=>'<div class="section-head"><h2>'+esc(title)+'</h2>'+action+'</div>';
const stat=(i,l,v)=>'<div class="stat">'+icon(i)+'<span>'+l+'</span><strong>'+v+'</strong></div>';
const row=(name,detail,action='')=>'<div class="row"><div><strong>'+esc(name)+'</strong><p>'+esc(detail)+'</p></div>'+action+'</div>';
const certLink=c=>link(c.url,'Página oficial');
const total=c=>c.courses.reduce((a,b)=>a+b.h,0);
const remaining=c=>c.courses.reduce((a,b)=>a+b.h*(1-b.pct/100),0);
function dashboard(){
 const c=active(), n=c&&ordered(c.courses).find(x=>x.pct<100), r=pending(), done=hours(day()), left=Math.max(0,s.hours-done), review=r.find(x=>!x.date||x.date<=day()), reviewHours=review?Math.min(left,.5):0, studyHours=n?Math.min(left-reviewHours,Math.ceil(n.h*(1-n.pct/100)*4)/4):0, extra=Math.max(0,left-reviewHours-studyHours);
 const task=(i,t,desc,h)=>'<div class="row"><div class="task"><span class="item-icon">'+icon(i)+'</span><div><strong>'+esc(t)+'</strong><p>'+esc(desc)+'</p></div></div><span class="pill nowrap">'+hrs(h)+'</span></div>';
 return intro('Olá, Marcos!','Acompanhe seus estudos e saiba qual é o próximo passo.',button('session','+ Registrar estudo','','primary'))+
 (c?'<section class="hero"><div><span class="pill">Certificação em foco</span><h2>'+esc(c.name)+'</h2><p>'+esc(c.provider)+' · '+c.courses.filter(x=>x.pct===100).length+' de '+c.courses.length+' cursos concluídos</p><p>'+esc(c.access)+' · '+esc(deadlines(c.deadline))+'</p>'+button('open','Ver certificação',c.id)+'</div><div class="ring" style="--pct:'+pct(c)+'%"><div><strong>'+pct(c)+'%</strong><small>progresso</small></div></div></section>':'')+
 '<div class="stats">'+stat('tempo','Estudo hoje',hrs(done)+' / '+hrs(s.hours))+stat('trilhas','Cursos concluídos',s.certs.flatMap(c=>c.courses).filter(x=>x.pct===100).length)+stat('revisoes','Revisões pendentes',r.length)+stat('certificados','Certificados obtidos',s.certs.filter(c=>c.status==='Concluída').length)+'</div>'+
 '<div class="columns"><section class="card">'+section('O que estudar hoje',button('session','Registrar horas','','link'))+bar(Math.min(100,100*done/s.hours))+
 (left===0?'<p>Meta de hoje atingida.</p>':(studyHours?task('trilhas',n.name,n.next||'Avance nas atividades do curso e registre o progresso.',studyHours):'')+(reviewHours?task('revisoes',review.title,'Revisão pendente',reviewHours):'')+(extra?task('check',n?'Próximas atividades da trilha':'Preparação para a próxima certificação',n?'Comece o curso seguinte ou finalize entregas e avaliações.':'Confira o programa oficial e defina o próximo passo.',extra):''))+
 '</section><section class="card">'+section('Prioridades')+
 (n?row('Avançar no próximo curso',n.name,button('course','Atualizar',c.id+'|'+n.id)):(c?row('Confirmar a credencial','Verifique a emissão na plataforma oficial.',button('cert','Editar',c.id)):'<p>Adicione uma certificação para planejar o próximo objetivo.</p>'))+
 (c?.id==='ibm'&&c.access==='Acesso gratuito'?'<div class="note">Avance no conteúdo liberado. Antes de assinar, confira as avaliações e os projetos bloqueados, as condições da assinatura e os requisitos do certificado na Coursera.</div>':'')+
 (r.length?row('Próxima revisão',r[0].title+' · '+deadlines(r[0].date),'<a href="#revisoes">Ver</a>'):'')+'</section></div>'+
 '<section class="card">'+section('Ordem recomendada','<a href="#trilhas">Ver certificações</a>')+
 ordered(s.certs).map(c=>row(c.order+'. '+c.name,c.status+' · '+deadlines(c.deadline),button('open','Detalhes',c.id))).join('')+
 (!s.certs.some(c=>c.url.replace(/\/$/,'')===pl.slice(0,-1))?row('Próxima sugestão · Microsoft PL-300','Aproveite sua experiência com Power BI. Valide DAX, modelagem e segurança.',button('pl','Adicionar')):'')+'</section>';
}
function list(){
 return intro('Certificações','Gerencie a sequência, as metas e os prazos de cada trilha.',button('cert','+ Nova certificação','','primary'))+
 '<div class="stack">'+ordered(s.certs).map(c=>'<section class="card">'+section(c.name,'<span class="pill green">'+esc(c.status)+'</span>')+'<p>'+esc(c.provider)+' · '+esc(c.access)+' · '+esc(deadlines(c.deadline))+'</p>'+bar(pct(c))+'<div class="row"><div>'+pct(c)+'% · '+c.courses.length+' cursos ou etapas</div><div class="actions">'+certLink(c)+button('open','Ver cursos',c.id)+'</div></div></section>').join('')+'</div>';
}
function detail(c){
 return intro(c.name,c.provider+' · '+c.access+' · '+deadlines(c.deadline),button('cert','Editar certificação',c.id))+
 '<section class="card"><div class="actions">'+certLink(c)+link(c.credential,'Ver credencial')+button('course','+ Adicionar curso',c.id+'|')+'</div><p>'+pct(c)+'% concluído · '+hrs(total(c))+' planejadas · '+hrs(remaining(c))+' estimadas restantes ('+Math.ceil(remaining(c)/s.hours)+' dias de estudo)</p>'+bar(pct(c))+'</section><br>'+
 '<section class="card">'+section('Cursos e etapas')+(c.courses.length?'':'<p>Adicione um curso, módulo ou etapa de preparação.</p>')+
 ordered(c.courses).map(x=>'<div class="row"><div><strong>'+x.order+'. '+esc(x.name)+'</strong><p>'+x.pct+'% · '+hrs(x.h)+' planejadas'+(x.official?' · '+hrs(x.official)+' no catálogo':'')+' · '+esc(deadlines(x.deadline))+'</p>'+bar(x.pct)+(x.next?'<p>'+esc(x.next)+'</p>':'')+[ ['Dificuldades',x.hard],['Conteúdos dominados',x.known],['Lacunas',x.gap] ].filter(([,v])=>v).map(([k,v])=>'<p><strong>'+k+'</strong> · '+esc(v)+'</p>').join('')+'</div><div class="actions">'+link(x.url,'Abrir curso')+button('course','Atualizar',c.id+'|'+x.id)+button('review','Agendar revisão',c.id+'|'+x.id,'link')+'</div></div>').join('')+'</section>';
}
function reviews(){
 return intro('Revisões','Agende a retomada de conteúdos e acompanhe as pendências.',button('review','+ Nova revisão','','primary'))+
 '<div class="stack"><section class="card">'+section('Pendentes')+(pending().length?pending().map(r=>row(r.title,[deadlines(r.date),r.note].filter(Boolean).join(' · '),'<div class="actions">'+button('review','Editar',r.id)+button('toggle','Concluir',r.id)+'</div>')).join(''):'<p>Nenhuma revisão pendente.</p>')+
 '</section><section class="card">'+section('Concluídas')+(s.reviews.filter(r=>r.done).map(r=>row(r.title,fmt(r.date),button('toggle','Reabrir',r.id))).join('')||'<p>Nenhuma revisão concluída.</p>')+'</section></div>';
}
function history(){
 const days=Array.from({length:7},(_,i)=>plus(day(),i-6));const scale=Math.max(s.hours,...days.map(hours));
 return intro('Histórico de evolução','Consulte suas horas de estudo e as atualizações do plano.',button('session','+ Registrar estudo','','primary'))+
 '<div class="stack"><section class="card">'+section('Horas nos últimos 7 dias')+'<div class="chart">'+days.map(d=>'<div><b>'+hrs(hours(d))+'</b><i style="height:'+Math.round(hours(d)/scale*104+2)+'px"></i><small>'+fmt(d).slice(0,5)+'</small></div>').join('')+'</div></section>'+
 '<section class="card">'+section('Sessões de estudo')+(s.sessions.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(x=>row(hrs(x.hours)+' · '+x.topic,fmt(x.date)+(x.note?' · '+x.note:''),button('session','Editar',x.id))).join('')||'<p>Nenhuma sessão registrada.</p>')+'</section><section class="card">'+section('Atualizações do plano')+(s.history.map(x=>row(x.title,fmt(x.date))).join('')||'<p>As mudanças de progresso, prazos e revisões aparecerão aqui.</p>')+'</section></div>';
}
function credentials(){
 return intro('Certificados concluídos','Guarde suas credenciais e os links para usar no currículo.')+
 '<section class="card">'+(s.certs.filter(c=>c.status==='Concluída').map(c=>row(c.name,[c.provider,c.finished&&fmt(c.finished)].filter(Boolean).join(' · '),'<div class="actions">'+link(c.credential,'Ver certificado')+button('cert','Editar',c.id)+'</div>')).join('')||'<p>Quando receber uma credencial, edite a certificação, selecione “Concluída” e registre o link.</p><p><a href="#trilhas">Ver certificações</a></p>')+'</section>';
}
function render(){
 const [page,id]=location.hash.slice(1).split('/');const tab=tabs[page]?page:'painel';
 $('nav').innerHTML=Object.entries(tabs).map(([k,v])=>'<a href="#'+k+'" '+(k===tab?'aria-current="page"':'')+'>'+icon(k)+v+'</a>').join('');
 $('#crumb').textContent=tabs[tab];$('#date').textContent=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',weekday:'short',day:'numeric',month:'short'}).format();
 const c=s.certs.find(x=>x.id===id);
 $('#content').innerHTML=tab==='trilhas'&&c?detail(c):({painel:dashboard,trilhas:list,revisoes:reviews,historico:history,certificados:credentials}[tab])();
}
const dialog=$('#modal'),form=$('#form');
const inp=(title,name,value='',type='text',attrs='')=>'<label>'+title+'<input name="'+name+'" type="'+type+'" value="'+esc(value)+'" '+attrs+'></label>';
const area=(title,name,value='')=>'<label>'+title+'<textarea name="'+name+'">'+esc(value)+'</textarea></label>';
const select=(title,name,opts,current)=>'<label>'+title+'<select name="'+name+'">'+opts.map(v=>'<option'+(current===v?' selected':'')+'>'+esc(v)+'</option>').join('')+'</select></label>';
let timer;
function save(title){
 s.history.unshift({title,date:day()});
 try{localStorage.setItem(storage,JSON.stringify(s));$('#toast').textContent='Alterações salvas.'}catch{$('#toast').textContent='Falha ao salvar no navegador. Os dados desta sessão podem ser perdidos.'}
 clearTimeout(timer);timer=setTimeout(()=>$('#toast').textContent='',4000);render();
}
function modal(title,fields,apply){
 form.innerHTML='<h2 id="modal-title">'+title+'</h2>'+fields+'<div class="actions"><button type="button" class="outline" id="cancel">Cancelar</button><button type="submit">Salvar</button></div>';
 dialog.setAttribute('aria-labelledby','modal-title');
 $('#cancel').onclick=()=>dialog.close();
 form.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(form));if(Object.values(d).some(v=>typeof v!=='string'))return;dialog.close();save(apply(d))};
 dialog.showModal();
}
function upsert(list,item){const i=list.findIndex(x=>x.id===item.id);if(i<0)list.push(item);else list[i]=item}
function handle(a,id){
 if(a==='open'){location.hash='trilhas/'+id;return}
 if(a==='settings'){modal('Ajustar plano',inp('Meta diária (horas)','hours',s.hours,'number','required min="4" max="24" step="0.25"')+'<p>O painel recalcula as metas diárias. Os prazos de cada curso podem ser ajustados na certificação.</p><p>O plano fica salvo neste navegador.</p>',d=>{s.hours=+d.hours;return 'Meta diária atualizada para '+hrs(s.hours)});return}
 if(a==='session'){
  const x=s.sessions.find(x=>x.id===id), c=active(), next=c&&ordered(c.courses).find(x=>x.pct<100);
  modal(x?'Editar sessão':'Registrar estudo','<div class="split">'+inp('Data','date',x?.date??day(),'date','required max="'+day()+'"')+inp('Horas estudadas','hours',x?.hours??1,'number','required min="0.25" max="24" step="0.25"')+'</div>'+inp('Curso ou assunto','topic',x?.topic??next?.name??'','text','required')+area('Notas da sessão','note',x?.note),d=>{upsert(s.sessions,{...d,id:x?.id??uid(),hours:+d.hours});return (x?'Sessão atualizada · ':'Estudo registrado · ')+d.topic});return
 }
 if(a==='cert'||a==='pl'){
  const x=s.certs.find(x=>x.id===id), plPreset=a==='pl';
  modal(x?'Editar certificação':'Nova certificação',inp('Nome','name',x?.name??(plPreset?'Microsoft PL-300 · Power BI Data Analyst Associate':''),'text','required')+inp('Instituição ou plataforma','provider',x?.provider??(plPreset?'Microsoft Learn':''))+inp('Link oficial','url',x?.url??(plPreset?pl:''),'url')+
  '<div class="split">'+inp('Ordem recomendada','order',x?.order??Math.max(0,...s.certs.map(c=>c.order))+1,'number','required min="1"')+inp('Prazo da meta','deadline',x?.deadline,'date')+
  select('Tipo de acesso','access',['Acesso gratuito','Assinatura paga','Exame avulso','A definir'],x?.access??(plPreset?'Acesso gratuito':'A definir'))+
  select('Situação','status',['Planejada','Em andamento','Concluída'],x?.status)+'</div>'+inp('Data de conclusão','finished',x?.finished,'date')+inp('Link do certificado','credential',x?.credential,'url'),d=>{
   const modules=plPreset?['Preparar dados com Power Query','Modelar dados e praticar DAX','Visualizar e analisar dados','Gerenciar e proteger o Power BI','Simulado e exame PL-300'].map((name,i)=>({id:uid(),order:i+1,name,pct:0,h:4,url:'https://learn.microsoft.com/pt-br/credentials/certifications/resources/study-guides/pl-300'})):[];
   upsert(s.certs,{...d,id:x?.id??uid(),order:+d.order,finished:d.status==='Concluída'?(d.finished||day()):'',courses:x?.courses??modules});
   return d.name+' · '+d.status
  });return
 }
 if(a==='course'){
  const [cid,xid]=id.split('|'),c=s.certs.find(x=>x.id===cid);if(!c)return;const x=c.courses.find(x=>x.id===xid);
  modal(x?'Atualizar curso':'Adicionar curso',inp('Nome do curso','name',x?.name,'text','required')+inp('Link oficial','url',x?.url,'url')+
  '<div class="split">'+inp('Progresso (%)','pct',x?.pct??0,'number','required min="0" max="100"')+inp('Horas planejadas','h',x?.h??4,'number','required min="0.25" step="0.25"')+inp('Ordem','order',x?.order??Math.max(0,...c.courses.map(x=>x.order))+1,'number','required min="1"')+inp('Prazo','deadline',x?.deadline,'date')+'</div>'+
  area('Próximo passo','next',x?.next)+area('Dificuldades','hard',x?.hard)+area('Conteúdos dominados','known',x?.known)+area('Lacunas de conhecimento','gap',x?.gap),d=>{upsert(c.courses,{...x,...d,id:x?.id??uid(),pct:+d.pct,h:+d.h,order:+d.order});return d.name+' · '+d.pct+'% concluído'});return
 }
 if(a==='review'){
  const x=s.reviews.find(x=>x.id===id),[cid,xid]=id.split('|'), course=s.certs.find(c=>c.id===cid)?.courses.find(y=>y.id===xid);
  modal(x?'Editar revisão':'Agendar revisão',inp('Conteúdo','title',x?.title??course?.name,'text','required')+inp('Data prevista','date',x?.date??plus(day(),1),'date')+area('O que revisar','note',x?.note??course?.gap),d=>{upsert(s.reviews,{...d,done:x?.done??false,id:x?.id??uid()});return 'Revisão '+(x?'atualizada':'agendada')+' · '+d.title});return
 }
 if(a==='toggle'){const x=s.reviews.find(x=>x.id===id);if(x){x.done=!x.done;save('Revisão '+(x.done?'concluída':'reaberta')+' · '+x.title)}}
}
document.addEventListener('click',e=>{const b=e.target.closest('button[data-act]');if(b)handle(b.dataset.act,b.dataset.id)});
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});
window.addEventListener('storage',e=>{if(e.key===storage&&e.newValue){s=JSON.parse(e.newValue);render()}});
window.addEventListener('focus',()=>{if(!dialog.open)render()});
render();
