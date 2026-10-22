/* Pure data functions shared by the browser and Node regression checks. */
const SchoolOrders = (() => {
  const norm = v => String(v ?? '').replace(/\s+/g,' ').trim().toLowerCase();
  function number(v, signed=false) {
    const s=String(v ?? '').trim();
    const expression=signed?/^-?(?:\d+|\d{1,3}(?:,\d{3})+)$/:/^(?:\d+|\d{1,3}(?:,\d{3})+)$/;
    if(!expression.test(s))return null;
    const n=Number(s.replace(/,/g,''));return Number.isSafeInteger(n)?n:null;
  }
  function approval(v) {
    if(!String(v??'').trim())return 'Pending';
    const n=number(v);return n===null?'Invalid approval':n===0?'Zero approved':'Approved';
  }
  function parse(text) {
    text=String(text).replace(/^\uFEFF/,'');const separator=text.split(/\r?\n/,1)[0].includes('\t')?'\t':',';
    let rows=[],row=[],cell='',quoted=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(quoted||cell==='')quoted=!quoted;else cell+=c;}
      else if(c===separator&&!quoted){row.push(cell);cell='';}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);rows.push(row);row=[];cell='';}
      else cell+=c;
    }
    if(quoted)throw Error('Unclosed quoted cell. Use a full CSV/TSV export including headers.');
    if(cell||row.length){row.push(cell);rows.push(row);}return rows;
  }
  function orders(rows) {
    const h=rows[0]||[];
    if(norm(h[3])!=='school'||norm(h[4])!=='location code'||norm(h[7])!=='product'||!/approved quantities/i.test(h[15]||''))throw Error('Use the complete orders table: School D, Location Code E, Product H, approved quantity P.');
    let ignored=0;const lines=[];
    rows.slice(1).forEach((r,i)=>{
      const get=n=>String(r[n]??'').trim();
      if(!get(3)&&!get(7)){ignored++;return;}
      const line={row:i+2,school:get(3),code:get(4),program:get(5),product:get(7),requested:get(8),approved:get(15),status:get(19),approvalStatus:get(20),delivered:get(24)};
      line.approval=approval(line.approved);line.quantity=number(line.approved);
      line.issues=[!line.school?'Missing school':'',!line.code?'Missing location code':'',!line.product?'Missing product':'',line.approval==='Invalid approval'?'Invalid Column P quantity':'',norm(line.status)==='duplicate'?'Marked Duplicate in source':''].filter(Boolean);
      line.validIdentity=!!line.school&&!!line.code&&!!line.product;
      line.schoolKey=JSON.stringify([line.code,norm(line.school)]);lines.push(line);
    });return {lines,ignored};
  }
  function inventory(rows) {
    const h=(rows[0]||[]).map(norm),required=['item','combined stock (wh & returns)','approved total','available stock (post bundling)','location/s'];
    for(const key of required)if(h.filter(v=>v===key).length!==1)throw Error('Missing or duplicate inventory header: '+key);
    const get=(r,key)=>String(r[h.indexOf(key)]??'').trim();
    return rows.slice(1).filter(r=>get(r,'item')).map((r,i)=>({name:get(r,'item'),part:get(r,'part #'),combined:number(get(r,'combined stock (wh & returns)'),true),approved:number(get(r,'approved total'),true),available:number(get(r,'available stock (post bundling)'),true),locations:get(r,'location/s')}));
  }
  function attach(lines,stock) {
    const index=new Map();for(const r of stock){const key=norm(r.name);if(!index.has(key))index.set(key,[]);index.get(key).push(r);}
    return lines.map(line=>{const matches=index.get(norm(line.product))||[];return {...line,stock:matches.length===1?matches[0]:null,matchStatus:matches.length===1?'Matched':matches.length?'Ambiguous inventory match':'No inventory match'};});
  }
  function schools(lines) {
    const map=new Map();for(const r of lines){if(!r.school||!r.code)continue;if(!map.has(r.schoolKey))map.set(r.schoolKey,{key:r.schoolKey,name:r.school,code:r.code,programs:new Set(),lines:[],approved:0,pending:0});const s=map.get(r.schoolKey);s.lines.push(r);if(r.program)s.programs.add(r.program);if(r.approval==='Approved'&&r.validIdentity)s.approved+=r.quantity;if(r.approval==='Pending')s.pending++;}
    return [...map.values()].sort((a,b)=>a.name.localeCompare(b.name)||a.code.localeCompare(b.code));
  }
  function products(lines) {
    const map=new Map();for(const r of lines){if(!r.product)continue;const key=norm(r.product);if(!map.has(key))map.set(key,{key,name:r.product,stock:r.stock,matchStatus:r.matchStatus,approved:0,rows:[],schools:new Set()});const g=map.get(key);g.rows.push(r.row);if(r.approval==='Approved'&&r.validIdentity){g.approved+=r.quantity;g.schools.add(r.schoolKey);}}
    return [...map.values()].sort((a,b)=>a.name.localeCompare(b.name));
  }
  const csv=rows=>rows.map(row=>row.map(value=>{let s=String(value??'');if(/^\s*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',')).join('\r\n');
  return {norm,number,approval,parse,orders,inventory,attach,schools,products,csv};
})();
if(typeof module!=='undefined')module.exports=SchoolOrders;
