(function(){
const projects = [
{id:'elop',name:'ELOP',subtitle:'Purchasing, equipment & logistics',color:'#527e70',tint:'#edf5ef',icon:'◈'},
{id:'launch',name:'LAUNCH LA',subtitle:'School orders & innovation carts',color:'#547d9d',tint:'#edf3fa',icon:'↗'},
{id:'warehouse',name:'Pico Warehouse',subtitle:'Inventory, receiving & analysis',color:'#7d8057',tint:'#f3f4e9',icon:'▦'},
{id:'transfers',name:'School Transfers',subtitle:'Equipment moving between schools',color:'#51858b',tint:'#eaf5f5',icon:'⇄'},
{id:'vr',name:'ClassVR',subtitle:'Deployment, access & device tracking',color:'#847398',tint:'#f3eef8',icon:'◎'},
{id:'apps',name:'Apps & Tools',subtitle:'Scanners, lookup tools & job aids',color:'#637d96',tint:'#edf2f7',icon:'⌘'},
{id:'edtech',name:'EdTech Inventory',subtitle:'Asset management & school inventory',color:'#64856e',tint:'#eef5e9',icon:'▤'},
{id:'pd',name:'PD Devices',subtitle:'Professional development laptops',color:'#a07883',tint:'#faeff2',icon:'▣'},
{id:'support',name:'25th Floor Support',subtitle:'Licensing, devices & office technology',color:'#a0845d',tint:'#faf3e9',icon:'⊞'},
{id:'its',name:'ITS Projects',subtitle:'System upgrades & infrastructure',color:'#6e7b9c',tint:'#eff0f9',icon:'⚙'}
];
const resources = [];
function add(title,url,groups,category='Reference',note='',flag=''){resources.push({id:'r'+(resources.length+1),title,url,projects:groups.split(','),category,note,flag});}
function sheet(title,book,gid,groups,category='Inventory',note='',flag=''){add(title,`https://docs.google.com/spreadsheets/d/${book}/edit?gid=${gid}#gid=${gid}`,groups,category,note,flag);}
const E='1dr570VJvddxzsTAERRUUeKRuE27WSFIWttpO-rvNmo0', L='1jWrPNLyDg8dGBs95ru5GiwIWovEMeAME-10kKH09odg', A='11QIVTBS1XOscOOvDWKYEtSnTLCCPewO2qKQo8S3b5f4', V='1vHcJfBZE1wdyaxRCG9tk-9OH73kcOLIifMJYGh4yjdI', H='1ypjdDcVAtarabWLasEoWvJN3YM4k_Pe7RNnR4K4eeTw';
sheet('2023–24 ELOP Purchases',E,'1056956109','elop','Purchasing');
sheet('2024–25 ELOP Purchases','1AE2uDe7lAH5buWjJNWkWWyWkLOAr0DbtnjLP3mm6qjw','135262776','elop','Purchasing');
sheet('Warehouse Inventory',E,'28156567','elop,warehouse','Inventory');
sheet('WH Inventory · 6.29.26',E,'877900497','elop,warehouse','Inventory','ELOP workbook tab; separate from the LAUNCH LA warehouse inventory.');
sheet('Non-Beaudry Items at Pico Warehouse',E,'306051168','elop,warehouse','Inventory');
sheet('Bundling Master',E,'306739542','elop','Operations');
sheet('Scanned Serials of Returned Items',E,'1405553675','elop','Devices');
sheet('Devices to Provision at Pico WH',E,'1504267254','elop','Devices');
sheet('Devices that Need Attention',E,'2013447275','elop','Devices','Repair / salvage');
sheet('Checklist / PRN',E,'1617121443','elop','Operations');
sheet('Pallets · Request / Drop / Return',E,'1471723518','elop','Operations');
sheet('ISTE Books Inventory',E,'1918676138','elop');
sheet('Beaudry to Pico · July 2026',E,'1514714467','elop','Transfers','Sol');
sheet('BD Mail Room to Pico · July 2026',E,'362753887','elop','Transfers','Sol');
sheet('Master Lookup',L,'658953664','launch','Reference');
sheet('School List',L,'1879552878','launch','Reference');
sheet('School Template',L,'201719541','launch','Reference');
add('Launch LA E-Shop','https://sites.google.com/lausd.net/launchlashop/home','launch','Web app','Customer facing');
sheet('Launch LA Inventory',L,'0','launch,warehouse');
sheet('Launch LA Orders',L,'354757045','launch','Orders');
sheet('LAUNCHLA Dashboard',L,'1173796555','launch','Dashboard');
sheet('Launch LA Approvals / School Orders Pallet Locations',L,'1780046857','launch','Orders','Both supplied labels point to this same tab.','Confirm whether approvals and pallet locations should have different links.');
sheet('After-School Innovation Cart Application · Responses','10SCbnlQnHJXf0T-KWjzeyskcqrw_KRmjujuF7XgZJ4w','534965077','launch','Forms & responses');
sheet('Materials Received from Schools',L,'1325314964','warehouse','Transfers');
sheet('Warehouse Inventory · 6.29.26',L,'1466500137','warehouse');
sheet('Plasencia Inventory',E,'1209279419','warehouse');
add("Pico Warehouse Inventory · Isabel’s",'https://lausd.sharepoint.com/:x:/r/sites/psd/_layouts/15/Doc.aspx?sourcedoc=%7B81c6fe55-352b-4b72-9ef2-d1b0d2ae184e%7D&action=edit&activeCell=%276.29.26%27!D736','warehouse','Inventory','SharePoint workbook; session-specific parameters removed.');
sheet('Warehouse Inventory Analysis · EdTech',A,'0','warehouse,edtech','Analysis');
sheet('Warehouse Inventory Analysis · 10.6.25',A,'690869186','warehouse','Analysis');
sheet('Warehouse Inventory Analysis · 6.29.26',A,'2048925685','warehouse','Analysis');
sheet('Warehouse Inventory Analysis · Consolidated',A,'223162966','warehouse','Analysis');
add('School-to-School Equipment Transfers · Old Forms','https://drive.google.com/drive/u/0/folders/1GR9zXek2GSvt6WLInMiaKASpE9Ge_WiE','transfers','Folder','Legacy Google Forms');
sheet('ELOP Equipment Bulk Transfers','1rfd9vKtDhD4UeYtFOi1GD2Mb3osIcKTiLR3fiQlc--Y','866466855','transfers,elop','Transfers');
add('LAUSD ELOP Equipment Scanner','https://script.google.com/macros/s/AKfycby5YeTlxXEepyuRL0-mfXeiUNFwWtzeOPIJtQENDqaNSwcAZI7OhsWTFW5sVDcoWk1I/exec','transfers,apps,elop','Web app','ELOP barcode scanner and inventory application');
add('ClassVR Deployment Plan','https://docs.google.com/document/d/1o-4bo-VWzD2l2d_llvqijNGUXkJIgb5sRIMlg608N1E/edit?tab=t.0','vr','Deployment');
sheet('ClassVR MAC Addresses & Serials / Dashboard',V,'209414636','vr','Devices','Received from Avantis. “Class VR Dashboard” uses this same tab.','Confirm whether the dashboard should have a different link.');
sheet('ClassVR Report · Master Data',V,'1268037393','vr','Inventory');
add('ClassVR Tracker & Notes','https://docs.google.com/document/d/1SslKDS-8AtIrgrGlgCoUatQnMGytrLFrB6RdeZoaLHc/edit?usp=drive_link','vr','Deployment','TRR / deployment');
add('ClassVR Login','https://portal.classvr.com/classvr/login.cfm','vr','Web app');
sheet('ClassVR Access · Responses','1ctpIBR2oXiwdZPw4Uxr4QsscavE1H53uSAG1OG65lKA','1337716022','vr','Forms & responses','Repeated response links combined.');
sheet('VR Headsets · May 2026 · Form Responses',H,'1012849996','vr','Forms & responses','Sol; repeated links combined.');
sheet('ClassVR Licenses · School List','1uppYZ0sBk0eLFq_g1qG4lmagnb85Nl5c2BabnuSublk','1563957576','vr','Licensing');
add('ClassVR Access · Google Form','https://docs.google.com/forms/d/13qaL-tP8NazNQ3nSib3aighbIlY5wZPfeJ1dvCRde7k/edit?ts=6aa96817','vr','Forms & responses','Form editor');
add('LAUSD–ClassVR Shared Drive','https://drive.google.com/drive/folders/0AKOSnscohEmVUk9PVA','vr','Folder','Iben');
sheet('MAC List · ClassVR IoT','1triGQdVFPEA_s8RGgiWt_u3w82nkEYXEGjoAIIR09f8','0','vr','Devices','Iben / old: both supplied entries use the same destination.');
add('LAUSD–AreyJones Shared Drive','https://drive.google.com/drive/folders/1FOV_otrZjkSyrMhuRWMrlRNmrPUoh7tw?usp=drive_link','vr','Folder','Iben');
add('Action Items · AJ LAUSD ClassVR','https://docs.google.com/document/d/1vCikaqezcZqaA0feXyj8hGD2Cmg8LEB7YpiDEGPqLg8/edit?usp=drive_link','vr','Deployment');
sheet('VR Headsets · May 2026 · Serial Numbers',H,'2129110066','vr','Devices');
add('ClassVR MAC Address Collection','https://drive.google.com/drive/u/0/folders/1x79xz8jYCOc0nGdcmfiW6rKEKqy-3v0E','vr','Folder');
sheet('ClassVR MACs · Master Inventory Database','1sk4XYmvULx5fDtsd-UIB1z84WmVOXocMgIhCx5pyAV4','1254015524','vr','Inventory','8 stations');
add('ClassVR Scanner Application Folder','https://drive.google.com/drive/folders/1MEwz9RJI4LPZXO4qLdk2kVuIkA9-SiQg','vr,apps','Folder','MAC address extraction tool · macOS only');
add('ClassVR Scanner App','https://drive.google.com/file/d/1OqPS3KbTCMfc_AFfS5OLuxBOfbnONyq3/view?usp=drive_link','vr,apps','Download','macOS only');
add('ClassVR Scanner App · Job Aid','https://drive.google.com/file/d/13k5zEC9IKRcjPS1iUXCssBBFCy5bvg0_/view?usp=drive_link','vr,apps','Reference');
add('Platform Tools · Android SDK','https://drive.google.com/file/d/1uXoIgCQ2vb0fIlWRr2vfibgtYJRNquon/view?usp=drive_link','vr,apps','Download');
add('Pico Warehouse Inventory Lookup','https://script.google.com/a/macros/lausd.net/s/AKfycbwp17uPztYzihyUCgMsAnF0uX8fMMDlHjCBupBLWgkq9dVd9xqMIvr7_9_hojsA8J00/exec','apps,warehouse','Web app');
add('EdTech CEI','https://lausd-my.sharepoint.com/:x:/r/personal/sxa3533_lausd_net/_layouts/15/doc2.aspx?sourcedoc=%7Bce7401b2-55ae-4698-9a37-319e8ad6dfdb%7D&action=edit&activeCell=%27School%20Inventory%27!C16','edtech','Inventory','SharePoint workbook; session-specific parameters removed.');
sheet('EdTech Asset Management · Inventory (Active)','1jsrt1P1BqH82FZptT92E0FmAmBPGlujUDl6orU7wtXE','261747403','edtech');
sheet('EdTech PD Laptops','1GLPWrrP9ROwhPU3ZZJUggtvnnHPyUbvb-RUwLZ0nRlw','1943099109','pd','Devices');
sheet('Toshiba Copiers & Network Layout · 25th Floor','1mBfr3N4KsBqgSjo49a-qTRJM5LmQHVzmvIOeEUC7E4w','2072656925','support','Reference');
add('Adobe Licensing','https://drive.google.com/drive/u/0/folders/16BXxTj85YWFV4-o74oD9sovokzreycLm','support','Folder');
add('Adobe Creative Cloud License Request · DOI','https://docs.google.com/forms/d/1GmWy2kggtqOydzYF3nZe7gUFugo6tDzfXEFIDAM_zmo/edit','support','Forms & responses','Form editor');
sheet('DOI Creative Cloud Requests · Responses','1Q31KvRO9rGgxwKDtX8NhPsdZMIOBPX1PjA9aJT6nkhY','964593573','support','Forms & responses');
sheet('Salvage · 25th Floor · 2026–27','1v-U3N4rJqld4PdXd6RDtPMhnA0mhObQLqt0xH4TGk_E','1193289432','support','Devices');
sheet('DOI Device Distribution · 2025–26 Funds','1OxoAQq6hlKF-U2x7tgozycagq3QQ5A1MDBh3dHUYDM8','0','support','Devices');
sheet('Windows 10 to 22 Upgrade','1a29_1nim1Buj_2_3BB6FT0UeRi1UPckli32-HPBJKhc','556864863','its','Deployment','Title preserved from your source list.');

'use strict';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const builtInProjects=projects.map(p=>({...p}));
const builtInResources=resources.slice();
const defaultTypes=['Reference','Inventory','Devices','Web app','Folder','Deployment','Forms & responses','Orders','Analysis','Purchasing','Licensing','Transfers','Operations','Dashboard','Download'];
const workspace='';
let state=validate(window.innovaCloud.initialData||{favorites:[],notes:{},custom:[],customProjects:[],referenceTypes:[],includeBuiltins:false});
let view='home',query='',pinPicker=false;
const sectionStates=new Map();
function validUrl(url){try{return new URL(url).protocol==='https:';}catch{return false;}}
function validate(s){
 if(!s||!Array.isArray(s.favorites)||!s.notes||typeof s.notes!=='object'||Array.isArray(s.notes)||!Array.isArray(s.custom))throw Error('Invalid backup format.');
 if(s.custom.length>2000)throw Error('Backup contains too many resources.');
 const includeBuiltins=s.includeBuiltins!==false;
 const projectIds=new Set(includeBuiltins?builtInProjects.map(p=>p.id):[]);
 const names=new Set(includeBuiltins?builtInProjects.map(p=>p.name.toLowerCase()):[]);
 if(s.customProjects!==undefined&&!Array.isArray(s.customProjects))throw Error('Invalid projects.');
 const customProjects=(s.customProjects||[]).map(p=>{
  if(!p||typeof p.id!=='string'||!/^project-[a-zA-Z0-9-]+$/.test(p.id)||projectIds.has(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>80||names.has(p.name.trim().toLowerCase()))throw Error('Invalid or duplicate project.');
  projectIds.add(p.id);names.add(p.name.trim().toLowerCase());
  return {id:p.id,name:p.name.trim(),subtitle:String(p.subtitle||'').slice(0,180),color:/^#[0-9a-f]{6}$/i.test(p.color)?p.color:'#24756a',icon:'◈',tint:'#edf5ef'};
 });
 if(s.referenceTypes!==undefined&&(!Array.isArray(s.referenceTypes)||s.referenceTypes.some(t=>typeof t!=='string'||!t.trim()||t.length>80)))throw Error('Invalid reference types.');
 const referenceTypes=[...new Map((s.referenceTypes||[]).map(t=>[t.trim().toLowerCase(),t.trim()])).values()];
 const ids=new Set(includeBuiltins?builtInResources.map(r=>r.id):[]);
 const custom=s.custom.map(r=>{if(!r||typeof r.id!=='string'||ids.has(r.id)||typeof r.title!=='string'||!r.title.trim()||!validUrl(r.url)||!Array.isArray(r.projects)||!r.projects.length||r.projects.some(p=>!projectIds.has(p)))throw Error('Backup contains an invalid resource.');ids.add(r.id);return {id:r.id,title:r.title.slice(0,180),url:r.url,projects:[...new Set(r.projects)],category:String(r.category||'Reference').slice(0,80),note:String(r.note||''),flag:''};});
 return {favorites:[...new Set(s.favorites.filter(id=>typeof id==='string'&&ids.has(id)))],notes:Object.fromEntries(Object.entries(s.notes).filter(([id,n])=>ids.has(id)&&typeof n==='string')),custom,customProjects,referenceTypes,includeBuiltins};
}
function syncProjects(){projects.splice(0,projects.length,...(state.includeBuiltins?builtInProjects:[]),...state.customProjects);}
syncProjects();
function all(){return [...(state.includeBuiltins?builtInResources:[]),...state.custom];}
function referenceTypes(){return [...new Map([...(state.includeBuiltins?defaultTypes:[]),...state.referenceTypes,...all().map(r=>r.category)].map(t=>[t.toLowerCase(),t])).values()].sort((a,b)=>a.localeCompare(b));}
function categories(){const types=referenceTypes();$('#resource-form [name=category]').innerHTML=types.length?types.map(t=>`<option>${esc(t)}</option>`).join(''):'<option value="">Add a reference type first</option>';}
function projectOptions(){ $('#project-options').innerHTML=projects.map(p=>`<label><input type="checkbox" name="projects" value="${esc(p.id)}">${esc(p.name)}</label>`).join(''); }
function notify(message){$('#toast').textContent=message;$('#toast').hidden=false;$('#toast').style.display='block';clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#toast').style.display='none',3500);}
function save(){window.innovaCloud.save(state);}

function projectName(id){return projects.find(p=>p.id===id)?.name||id;}
const icons={elop:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',launch:'<path d="M5 19 19 5M5 5h14v14"/>',warehouse:'<path d="m3 9 9-6 9 6v12H3V9ZM8 21V11h8v10M8 16h8"/>',vr:'<rect x="3" y="7" width="18" height="11" rx="4"/><path d="M8 11v3m8-3v3M8 7l1-3h6l1 3"/>'};
function go(id){view=id;pinPicker=false;query='';$('#search').value='';$('#settings').open=false;render();window.scrollTo({top:0,behavior:'smooth'});}
function projectCard(p){const icon=icons[p.id]||'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/>';return `<button class="project-card" data-project="${p.id}" style="--accent:${p.color};--tint:${p.tint}"><span class="project-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg></span><span><strong>${esc(p.name)}</strong><small>${esc(p.subtitle)}</small></span><span class="arrow" aria-hidden="true">→</span></button>`;}
function groupName(r){if(['Orders','Forms & responses'].includes(r.category))return 'Orders & requests';if(['Inventory','Analysis'].includes(r.category))return 'Inventory & reports';if(['Web app','Download'].includes(r.category))return 'Apps & tools';if(['Devices','Deployment','Transfers','Operations'].includes(r.category))return 'Equipment & operations';if(r.category==='Purchasing')return 'Purchasing';if(r.category==='Licensing')return 'Licensing';return r.category||'Documents & reference';}
function resourceRow(r,context){const pinned=state.favorites.includes(r.id);return `<article class="resource" data-resource="${esc(r.id)}"><div class="resource-top"><a class="resource-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><span class="link-label">${esc(r.title)}${r.note?`<span class="resource-description">${esc(r.note)}</span>`:''}${context?`<span class="result-context">${r.projects.map(projectName).map(esc).join(' · ')}</span>`:''}</span><span class="external" aria-hidden="true">↗</span></a><button class="preview-button" data-preview="${esc(r.id)}" aria-label="Preview ${esc(r.title)}" aria-controls="preview-box">Preview</button><details class="resource-menu"><summary aria-label="Options for ${esc(r.title)}" aria-controls="details-${esc(r.id)}">···</summary></details></div><div class="resource-details" id="details-${esc(r.id)}" hidden><div class="detail-actions"><button class="pin-toggle" data-id="${esc(r.id)}" aria-pressed="${pinned}">${pinned?'Unpin shortcut':'Pin to home'}</button><span>${esc(new URL(r.url).hostname)}</span></div>${r.flag?`<p class="review-flag">${esc(r.flag)}</p>`:''}<div class="related">Related projects: ${r.projects.map(p=>`<button data-project="${p}">${esc(projectName(p))}</button>`).join('')}</div><label class="note-label" for="note-${esc(r.id)}">Personal note</label><textarea id="note-${esc(r.id)}" data-id="${esc(r.id)}" rows="2" placeholder="A reminder, owner, or next step…">${esc(state.notes[r.id]||'')}</textarea><span class="autosave">Changes sync to your private account. Check save status above.</span></div></article>`;}
function render(){
 hidePreview();
 const project=projects.find(p=>p.id===view),searching=query.trim().length>0,home=view==='home'&&!searching&&!pinPicker;
 const themedProject=project&&!searching?project:null;document.body.dataset.project=themedProject?.id||'';document.body.style.setProperty('--project-tint',themedProject?.tint||'#f5f9fb');document.body.style.setProperty('--project-accent',themedProject?.color||'#356b65');
 $('#project-actions').hidden=!project||searching||pinPicker;
 $('#home-content').hidden=!home;$('#home-pins').hidden=!home;$('#results').hidden=home;$('#back').hidden=home;$('#clear-search').hidden=!searching;
 $('#eyebrow').textContent=project?'PROJECT SPACE':view==='review'?'WORKSPACE HOUSEKEEPING':pinPicker?'MAKE IT YOURS':'EdTech Innovation - LAUSD';
 $('#title').textContent=searching?'Find what you need.':project?project.name:view==='review'?'Links to check.':pinPicker?'Your everyday shortcuts.':'Customized, Innovative Project Management';
 $('#subtitle').textContent=searching?'Search across all your projects, documents, and personal notes.':project?project.subtitle:view==='review'?'These labels share a destination. Open the link and confirm its purpose.':pinPicker?'Open a document’s options (···), then choose Pin to home.':'Customization meets Innovation. Find what you need. Organization achieved.';
 renderPins();
 $('#main-projects').innerHTML=projects.length?projects.map(projectCard).join(''):'<div class="empty"><strong>Make this dashboard yours.</strong>Open Settings to add a project, a reference type, then your first resource.</div>';
 if(!home){
 let list=all().filter(r=>searching||(!project||r.projects.includes(view))&&(view!=='review'||r.flag));
 if(searching){const words=query.toLocaleLowerCase().trim().split(/\s+/);list=list.filter(r=>words.every(w=>[r.title,r.category,r.note,r.flag,state.notes[r.id],...r.projects.map(projectName)].join(' ').toLocaleLowerCase().includes(w)));}
 $('#results-heading').textContent=searching?`${list.length} ${list.length===1?'result':'results'}`:view==='review'?'Links to review':pinPicker?'Choose from your documents':'Documents';
 const groups=new Map();for(const r of list){let key=searching?'Search results':pinPicker?projectName(r.projects[0]):groupName(r);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
 $('#resource-list').innerHTML=list.length?[...groups].map(([name,rs],i)=>{const key=JSON.stringify([view,pinPicker,name]);return searching?`<div class="group">${rs.map(r=>resourceRow(r,true)).join('')}</div>`:`<details class="group resource-section" data-section-key="${esc(key)}" ${sectionStates.get(key)===false?'':'open'}><summary aria-controls="section-content-${i}"><span class="section-chevron" aria-hidden="true">›</span><h3>${esc(name)}</h3><span class="section-count">${rs.length}</span></summary><div class="section-content" id="section-content-${i}">${rs.map(r=>resourceRow(r,pinPicker)).join('')}</div></details>`;}).join(''):'<div class="empty"><strong>No matching documents.</strong>Try a different name, project, or keyword.</div>';
 $('#resource-list').querySelectorAll('.resource-section').forEach(d=>d.ontoggle=()=>{sectionStates.set(d.dataset.sectionKey,d.open);if(!d.open&&!previewBox.hidden&&d.contains(previewAnchor))hidePreview();});
 $('#resource-list').querySelectorAll('.resource-menu').forEach(d=>d.ontoggle=()=>{d.closest('.resource').querySelector('.resource-details').hidden=!d.open;});
 $('#resource-list').querySelectorAll('.pin-toggle').forEach(b=>b.onclick=()=>{togglePin(b.dataset.id);const pinned=state.favorites.includes(b.dataset.id);b.textContent=pinned?'Unpin shortcut':'Pin to home';b.setAttribute('aria-pressed',String(pinned));notify(pinned?'Pinned to your home screen.':'Shortcut unpinned.');});
 $('#resource-list').querySelectorAll('textarea').forEach(t=>t.oninput=()=>{state.notes[t.dataset.id]=t.value;save();});
 }
 bindPreviews();
 document.querySelectorAll('button[data-project]').forEach(b=>b.onclick=()=>go(b.dataset.project));
}
function togglePin(id){state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();renderPins();}
function renderPins(){const pins=state.favorites.map(id=>all().find(r=>r.id===id)).filter(Boolean);$('#pins').innerHTML=pins.length?pins.map(r=>`<div class="pin-card" data-pin-resource="${esc(r.id)}"><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a><button data-unpin="${esc(r.id)}" aria-label="Unpin ${esc(r.title)}">×</button><button class="preview-button" data-preview="${esc(r.id)}" aria-label="Preview ${esc(r.title)}" aria-controls="preview-box">Preview</button></div>`).join(''):'<div class="pin-empty"><strong>Your most-used links belong here.</strong><br>Choose your shortcuts, or pin a document from any project.</div>';$('#pins').querySelectorAll('[data-unpin]').forEach(b=>b.onclick=()=>togglePin(b.dataset.unpin));bindPreviews();}
$('#home').onclick=()=>go('home');$('#back').onclick=()=>go('home');$('#clear-search').onclick=()=>{query='';$('#search').value='';render();$('#search').focus();};$('#search').oninput=e=>{query=e.target.value;render();};$('#choose-pins').onclick=()=>{view='home';query='';pinPicker=true;$('#search').value='';render();};$('#review').onclick=()=>go('review');
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#resource-dialog').open){e.preventDefault();$('#search').focus();}});
document.addEventListener('click',e=>{if(!$('#settings').contains(e.target))$('#settings').open=false;});
projectOptions();
$('#add').onclick=()=>{if(!projects.length){notify('Add a project before adding resources.');$('#add-project').click();return;}if(!referenceTypes().length){notify('Add a reference type before adding resources.');$('#add-type').click();return;}projectOptions();$('#settings').open=false;$('#resource-form').reset();$('#form-error').textContent='';if(projects.some(p=>p.id===view))$('#project-options input[value="'+view+'"]').checked=true;$('#resource-dialog').showModal();};
$('#add-project').onclick=()=>{$('#settings').open=false;$('#project-form').reset();$('#project-error').textContent='';$('#project-dialog').showModal();};
$('#quick-add-resource').onclick=()=>$('#add').click();
$('#quick-add-type').onclick=()=>$('#add-type').click();
$('#quick-add-project').onclick=()=>$('#add-project').click();
$('#add-type').onclick=()=>{$('#settings').open=false;$('#type-form').reset();$('#type-error').textContent='';$('#type-dialog').showModal();};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
$('#project-form').onsubmit=e=>{e.preventDefault();const form=new FormData(e.target),name=form.get('name').trim();if(!name||projects.some(p=>p.name.toLowerCase()===name.toLowerCase())){$('#project-error').textContent='Enter a unique project name.';return;}const project={id:'project-'+crypto.randomUUID(),name,subtitle:form.get('subtitle').trim(),color:form.get('color'),icon:'◈',tint:'#edf5ef'};state.customProjects.push(project);syncProjects();save();projectOptions();$('#project-dialog').close();go(project.id);notify('Project added. You can now add its resources.');};
$('#type-form').onsubmit=e=>{e.preventDefault();const name=new FormData(e.target).get('name').trim();if(!name||referenceTypes().some(t=>t.toLowerCase()===name.toLowerCase())){$('#type-error').textContent='Enter a unique reference type.';return;}state.referenceTypes.push(name);save();categories();$('#type-dialog').close();notify('Reference type added.');};
$('#close-dialog').onclick=()=>$('#resource-dialog').close();
$('#resource-form').onsubmit=e=>{e.preventDefault();const form=new FormData(e.target),groups=form.getAll('projects'),url=form.get('url').trim(),title=form.get('title').trim();if(!title||!groups.length||!validUrl(url)){$('#form-error').textContent='Enter a name, an HTTPS link, and at least one project.';return;}const existing=all().find(r=>r.url===url);if(existing){$('#form-error').textContent='This link is already saved as '+existing.title+'.';return;}state.custom.push({id:'custom-'+crypto.randomUUID(),title,url,projects:groups,category:form.get('category'),note:form.get('note').trim(),flag:''});save();go(groups[0]);$('#resource-dialog').close();notify('Resource added.');};
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify({version:2,...state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='workroom-backup-'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#settings').open=false;notify('Backup exported.');};
$('#import').onclick=()=>$('#import-file').click();$('#import-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5e6)throw Error('Backup is too large.');const incoming=validate(JSON.parse(await file.text()));const merged=new Map(state.custom.map(r=>[r.id,r]));for(const r of incoming.custom)merged.set(r.id,r);const mergedProjects=new Map(state.customProjects.map(p=>[p.id,p]));for(const p of incoming.customProjects)mergedProjects.set(p.id,p);const next=validate({includeBuiltins:state.includeBuiltins||incoming.includeBuiltins,customProjects:[...mergedProjects.values()],referenceTypes:[...state.referenceTypes,...incoming.referenceTypes],favorites:[...new Set([...state.favorites,...incoming.favorites])],notes:{...state.notes,...incoming.notes},custom:[...merged.values()]});state=next;syncProjects();save();projectOptions();categories();render();notify('Backup imported. Existing resources and favorites retained.');}catch(err){notify('Could not import: '+err.message);}e.target.value='';};

let previewTimer,previewCloseTimer,previewAnchor,activePreviewId;
const previewBox=$('#preview-box');
function previewUrl(resource){
 const u=new URL(resource.url);let m;
 if(u.hostname==='docs.google.com'&&(m=u.pathname.match(/^\/(spreadsheets|document|presentation)\/d\/([A-Za-z0-9_-]+)/))){
 const base='https://docs.google.com/'+m[1]+'/d/'+m[2];
 if(m[1]==='spreadsheets'){const gid=new URLSearchParams(u.hash.slice(1)).get('gid')||u.searchParams.get('gid');const tab=gid!==null?encodeURIComponent(gid):null;return base+'/preview'+(tab!==null?'?gid='+tab+'#gid='+tab:'');}
 return base+(m[1]==='presentation'?'/embed':'/preview');
 }
 if(u.hostname==='drive.google.com'&&(m=u.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)/)))return 'https://drive.google.com/file/d/'+m[1]+'/preview';
 return null;
}
function hidePreview(){clearTimeout(previewTimer);clearTimeout(previewCloseTimer);previewBox.hidden=true;previewBox.replaceChildren();if(previewAnchor)previewAnchor.removeAttribute('aria-describedby');activePreviewId=null;}
function scheduleHide(){clearTimeout(previewTimer);clearTimeout(previewCloseTimer);previewCloseTimer=setTimeout(()=>{if(!previewBox.matches(':hover')&&!previewBox.contains(document.activeElement))hidePreview();},280);}
function showPreview(resource,anchor){
 clearTimeout(previewTimer);clearTimeout(previewCloseTimer);
 if(activePreviewId===resource.id&&!previewBox.hidden)return;
 hidePreview();previewAnchor=anchor;activePreviewId=resource.id;
 const src=previewUrl(resource);
 previewBox.innerHTML=`<div class="preview-heading"><div><strong id="preview-name">${esc(resource.title)}</strong><small>${esc(resource.category)} · ${esc(new URL(resource.url).hostname)}</small></div><button type="button" id="preview-close" aria-label="Close preview">×</button></div><div class="preview-body"><p class="preview-message">${src?'Loading document preview…':'This site does not offer a supported embedded preview. Use Open original to view it.'}</p>${src?`<iframe title="Document preview: ${esc(resource.title)}" src="${esc(src)}" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>`:''}</div><div class="preview-footer"><small>${src?'Preview may require sign-in. If it is blank or blocked, use Open original.':'Your access permissions still apply. No document data is copied into this dashboard.'}</small><a href="${esc(resource.url)}" target="_blank" rel="noopener noreferrer">Open original ↗</a></div>`;
 previewBox.hidden=false;positionPreview();anchor.setAttribute('aria-describedby','preview-name');
 $('#preview-close').onclick=()=>{const focusWasInside=previewBox.contains(document.activeElement);hidePreview();if(focusWasInside&&previewAnchor?.isConnected){previewAnchor.focus();clearTimeout(previewTimer);}};
}
function positionPreview(){if(previewBox.hidden||!previewAnchor?.isConnected)return;const rect=previewAnchor.getBoundingClientRect(),h=previewBox.offsetHeight,w=previewBox.offsetWidth;let top=rect.bottom+8;if(top+h>innerHeight-12)top=Math.max(12,rect.top-h-8);previewBox.style.top=top+'px';previewBox.style.left=Math.max(12,Math.min(rect.left,innerWidth-w-12))+'px';}
function bindPreviews(){
 document.querySelectorAll('.resource-link,.pin-card>a').forEach(link=>{
 const id=link.closest('[data-resource]')?.dataset.resource||link.closest('[data-pin-resource]')?.dataset.pinResource;
 const resource=all().find(r=>r.id===id);if(!resource)return;
 const queue=()=>{clearTimeout(previewTimer);clearTimeout(previewCloseTimer);previewTimer=setTimeout(()=>showPreview(resource,link),3000);};
 link.onmouseenter=queue;link.onmouseleave=scheduleHide;link.onfocus=queue;link.onblur=()=>{clearTimeout(previewTimer);scheduleHide();};link.onclick=()=>hidePreview();
 });
 document.querySelectorAll('[data-preview]').forEach(button=>button.onclick=()=>{const r=all().find(r=>r.id===button.dataset.preview);if(r){if(activePreviewId===r.id&&!previewBox.hidden)hidePreview();else showPreview(r,button);}});
}
previewBox.onpointerenter=()=>{clearTimeout(previewCloseTimer);clearTimeout(previewTimer);};previewBox.onpointerleave=scheduleHide;previewBox.onfocusin=()=>clearTimeout(previewCloseTimer);previewBox.onfocusout=scheduleHide;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!previewBox.hidden){const focusWasInside=previewBox.contains(document.activeElement);hidePreview();if(focusWasInside&&previewAnchor?.isConnected){previewAnchor.focus();clearTimeout(previewTimer);}}});
document.addEventListener('pointerdown',e=>{if(!previewBox.hidden&&!previewBox.contains(e.target)&&!e.target.closest('[data-preview]'))hidePreview();});
window.addEventListener('resize',positionPreview);window.addEventListener('scroll',()=>{if(previewBox.hidden)return;const rect=previewAnchor?.getBoundingClientRect();if(!rect||rect.bottom<0||rect.top>innerHeight)hidePreview();else positionPreview();},{passive:true});

categories();
$('#toast').hidden=true;
// Existing backup imports retain the original built-in project/resource IDs.
render();

window.innovaDashboard={exportBackup:()=>document.querySelector('#export').click()};

})();
