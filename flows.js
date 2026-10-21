/* n8n-style animated workflows. Horizontal on wide screens, vertical (one column) on phones. */
(function(){
  var FLOWS={
    hero:{title:'What I build',
      nodes:[
        ['t','trigger','💬','Customer writes or calls','email · call · IG · QR',0,1],
        ['a','ai','◎','Your system understands','reads your prices · calendar · stock',1,1],
        ['r','msg','↩','Replies in 10 s','with real answers',2,0],
        ['b','gcal','▦','Books the slot','calendar · reminder',2,1],
        ['p','pay','$','Takes the order & payment','kitchen · delivery · CRM',2,2]
      ],
      edges:[['t','a'],['a','r'],['a','b'],['a','p']],
      steps:[['t','“hi, do you have a slot Thursday?”'],['a','checks Aram’s calendar · Thu 2:00 free'],['r','“Thu 2:00 with Aram works — book it?” → “yes”'],['b','booked · Thu 2:00 · reminder set · CRM card'],['p','later: order #118 paid · kitchen ticket · receipt texted']]},
    order:{title:'Email → order → delivery',
      nodes:[['t','trigger','✉','Email received','“Do you have 40 flanges?”',0,1],['p','ai','◎','Understand request','item · qty · deadline',1,1],['s','http','⌕','Search your catalog','site · price list · stock',2,1],['r','msg','↩','Reply: link + price','40 in stock · $12.40',3,1],['o','trigger','🛒','Customer orders','checkout · paid',4,1],['d','logic','⇄','Pick delivery date','next free slot · Thu',5,1],['c','gcal','▦','Google Calendar','delivery · Thu 10:00',6,0.4],['w','msg','▶','Dispatch team','Telegram · pick list',6,1.6]],
      edges:[['t','p'],['p','s'],['s','r'],['r','o'],['o','d'],['d','c'],['d','w']],
      steps:[['t','09:12 · email: “Do you have 40 × 2-inch flanges, need by Friday”'],['p','parsed → flange 2" · qty 40 · deadline Fri'],['s','catalog: SKU FL-200 · 112 in stock · $12.40'],['r','09:12 · reply sent: link, price, Friday delivery option'],['o','09:31 · order #2214 paid · $496.00'],['d','delivery slot: Thu 10:00 (route B)'],['c','Google Calendar: “Deliver #2214 · 40 FL-200”'],['w','dispatch: pick list + address + gate code']]},
    support:{title:'Question → verified answer',
      nodes:[['t','trigger','✉','Message in','email · IG · web chat',0,1],['k','http','⌕','Read your site + docs','pages · FAQ · policies',1,0.4],['v','http','✓','Verify in 2nd source','price list · stock · calendar',1,1.6],['a','ai','◎','Draft answer','only confirmed facts',2,1],['g','logic','?','Confident?','do sources agree?',3,1],['s','msg','↩','Send to customer','logged in CRM',4,0.4],['w','msg','☺','Ask owner','1-tap approve / edit',4,1.6]],
      edges:[['t','k'],['t','v'],['k','a'],['v','a'],['a','g'],['g','s','yes'],['g','w','no']],
      steps:[['t','14:02 · “is the ceramic coating guaranteed? how long?”'],['k','site: /services/ceramic → “5-year warranty, annual check”'],['v','policy doc v3: 5 y · yearly inspection ✓ agrees'],['a','draft: “Yes — 5-year warranty with a free annual check…”'],['g','confidence 0.96 · two sources agree'],['s','14:02 · sent · logged to CRM'],['w','(if unsure) owner gets draft + sources, taps approve']]},
    book:{title:'Chat → calendar → booked',
      nodes:[['t','trigger','💬','Visitor opens chat','site · IG · WhatsApp',0,1],['a','ai','◎','Natural conversation','service · who · when',1,1],['c','gcal','▦','Check specialist calendar','Aram · Wed–Sat',2,1],['o','logic','⇄','Offer free slots','3 nearest',3,1],['b','gcal','✓','Book + hold slot','Google / Apple calendar',4,1],['m','msg','↩','Confirm by text','reminder 24 h before',5,0.4],['r','crm','▤','CRM card','new client · source: chat',5,1.6]],
      edges:[['t','a'],['a','c'],['c','o'],['o','b'],['b','m'],['b','r']],
      steps:[['t','“hi, can I book a fade with Aram this week?”'],['a','understood: haircut (fade) · Aram · this week'],['c','Aram: Wed 11:30, Thu 2:00, Sat 10:00 free'],['o','“Wed 11:30, Thu 2:00 or Sat 10:00?” → “thu 2”'],['b','booked Thu 2:00 PM · 45 min · slot held'],['m','text: “Booked: Thu 2:00 with Aram. Reply R to reschedule.”'],['r','CRM: Sona M. · new · source chat · $45']]},
    qr:{title:'QR → chat → order → pay',
      nodes:[['t','trigger','▣','Guest scans QR','table 7',0,1],['a','ai','◎','Waiter-style chat','recommends · answers',1,1],['o','logic','☰','Build the order','“spicy, no onion”',2,1],['k','msg','▶','Kitchen ticket','printed · #118',3,0.4],['p','pay','$','Pay / split bill','Apple Pay · tip',3,1.6],['f','msg','★','Receipt + review ask','by text',4,1.6],['b','gcal','▦','Offer reservation','“same table Friday?”',4,0.4]],
      edges:[['t','a'],['a','o'],['o','k'],['o','p'],['p','f'],['k','b']],
      steps:[['t','table 7 scanned · menu + chat open · no app'],['a','“what’s good for two?” → “Lamb kebab + two lahmajun”'],['o','order: kebab (spicy, no onion) · lahmajun ×2 · tan ×2'],['k','kitchen ticket #118 printed · 15 min'],['p','bill $32.40 · split 2 ways · tip 18% · paid'],['f','receipt texted · “rate us?” → ★★★★★'],['b','“Friday 8 PM, same table?” → reserved']]},
    calls:{title:'Call → analysis → CRM',
      nodes:[['t','trigger','☎','Call ends','recorded · 6 m 12 s',0,1],['s','ai','≋','Transcribe','speaker-split',1,1],['a','ai','◎','Analyze','asked · promised · missed',2,1],['c','crm','▤','CRM note + next step','quote by Fri · $1,240',3,0.4],['q','logic','!','Flag mistakes','price not confirmed',3,1.6],['w','msg','☺','Owner digest','daily · 5 calls · 2 flags',4,1]],
      edges:[['t','s'],['s','a'],['a','c'],['a','q'],['c','w'],['q','w']],
      steps:[['t','17:40 · inbound call · Dave K. · 6 m 12 s'],['s','transcript ready · 2 speakers'],['a','discussed: rear bumper · 2018 Camry · wants Friday · loaner?'],['c','CRM: stage → quoted · next: send estimate by Fri · $1,240'],['q','flag: loaner promised, not booked · price said, no written quote'],['w','18:00 digest: 5 calls · 2 flags · 1 missed follow-up']]},
    custom:{title:'Your process, automated',
      nodes:[['t','trigger','⚡','Any trigger','form · payment · time · webhook',0,1],['p','pay','$','Payments','Stripe · Square · invoices',1,0.2],['f','msg','★','Feedback loops','NPS · reviews · complaints',1,1],['i','http','⇄','Your tools','Sheets · QuickBooks · POS',1,1.8],['a','ai','◎','Decide / route','rules + AI',2,1],['o','msg','↩','Notify / act','SMS · Telegram · CRM',3,1]],
      edges:[['t','p'],['t','f'],['t','i'],['p','a'],['f','a'],['i','a'],['a','o']],
      steps:[['t','trigger: invoice paid · $2,400'],['p','Stripe webhook → job marked paid in Sheets'],['f','2 days later → “how did we do?” → 4★ + comment'],['i','QuickBooks: income entry · POS: close ticket'],['a','rule: rating < 5 → route comment to owner, not public'],['o','owner Telegram: “4★ from Tina: great work, late by 20 min”']]}
  };
  var COL={trigger:'#3DDC84',ai:'#8B7CF6',http:'#60A5FA',msg:'#F59E0B',gcal:'#34D399',logic:'#A3A3A3',crm:'#F472B6',pay:'#22D3EE'};
  function cut(t,n){return t.length>n?t.slice(0,n-1)+'…':t}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}

  function layout(f,vertical,cw){
    var pos={},W,H,NW,NH;
    if(!vertical){
      var GX=176,GY=92;NW=150;NH=60;var mx=0,my=0;
      f.nodes.forEach(function(n){mx=Math.max(mx,n[5]);my=Math.max(my,n[6]);pos[n[0]]={x:12+n[5]*GX,y:12+n[6]*GY}});
      W=mx*GX+NW+24;H=my*GY+NH+24;
    }else{
      // one column: order by x then y; branches at same x sit side by side in two lanes
      var sorted=f.nodes.slice().sort(function(a,b){return a[5]-b[5]||a[6]-b[6]});
      var groups={};sorted.forEach(function(n){(groups[n[5]]=groups[n[5]]||[]).push(n)});
      var keys=Object.keys(groups).map(Number).sort(function(a,b){return a-b});
      W=cw;NH=62;var pad=10,gap=14,y=pad;
      keys.forEach(function(k){var g=groups[k];if(g.length>2){g.forEach(function(n){pos[n[0]]={x:pad,y:y,w:W-pad*2};y+=NH+26});return}var lanes=g.length;var w=(W-pad*2-(lanes-1)*gap)/lanes;
        g.forEach(function(n,i){pos[n[0]]={x:pad+i*(w+gap),y:y,w:w}});y+=NH+26});
      H=y-26+pad;NW=null;
    }
    return {pos:pos,W:W,H:H,NW:NW,NH:NH};
  }
  function render(el,key){
    var f=FLOWS[key];if(!f)return;
    var cw=el.clientWidth||360;var vertical=cw<640;
    var L=layout(f,vertical,vertical?cw-24:0),pos=L.pos,W=L.W,H=L.H,NH=L.NH;
    var svg='<svg viewBox="0 0 '+W+' '+H+'" class="n8c'+(vertical?' vert':'')+'" role="img" aria-label="'+esc(f.title)+'">';
    svg+='<defs><pattern id="dots-'+key+'" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#1F2622"/></pattern></defs><rect width="'+W+'" height="'+H+'" fill="url(#dots-'+key+')"/>';
    f.edges.forEach(function(e){var a=pos[e[0]],b=pos[e[1]];var d,lx,ly;
      if(!vertical){var x1=a.x+L.NW,y1=a.y+NH/2,x2=b.x,y2=b.y+NH/2,dx=Math.max(30,(x2-x1)/2);d='M'+x1+' '+y1+' C '+(x1+dx)+' '+y1+', '+(x2-dx)+' '+y2+', '+x2+' '+y2;lx=(x1+x2)/2;ly=(y1+y2)/2-6}
      else{var ax=a.x+a.w/2,ay=a.y+NH,bx=b.x+b.w/2,by=b.y;var dy=Math.max(12,(by-ay)/2);d='M'+ax+' '+ay+' C '+ax+' '+(ay+dy)+', '+bx+' '+(by-dy)+', '+bx+' '+by;lx=(ax+bx)/2+14;ly=(ay+by)/2+3}
      svg+='<path class="n8e" data-e="'+e[0]+'-'+e[1]+'" d="'+d+'"/>';
      if(e[2])svg+='<text class="n8l" x="'+lx+'" y="'+ly+'" text-anchor="middle">'+e[2]+'</text>'});
    f.nodes.forEach(function(n){var p=pos[n[0]],c=COL[n[1]]||'#aaa',w=vertical?p.w:L.NW;var nmax=vertical?Math.floor((w-44)/6.6):19,smax=vertical?Math.floor((w-16)/5.4):27;
      svg+='<g class="n8n-node" data-n="'+n[0]+'" style="--c:'+c+'"><rect x="'+p.x+'" y="'+p.y+'" width="'+w+'" height="'+NH+'" rx="8"/>'
        +'<rect class="ic" x="'+(p.x+8)+'" y="'+(p.y+8)+'" width="22" height="22" rx="5"/><text class="icg" x="'+(p.x+19)+'" y="'+(p.y+24)+'" text-anchor="middle">'+n[2]+'</text>'
        +'<text class="nm" x="'+(p.x+36)+'" y="'+(p.y+21)+'">'+esc(cut(n[3],nmax))+'</text><text class="sb" x="'+(p.x+8)+'" y="'+(p.y+47)+'">'+esc(cut(n[4],smax))+'</text>'
        +(vertical?'':'<circle class="pin" cx="'+(p.x+w)+'" cy="'+(p.y+NH/2)+'" r="3"/>')+'</g>'});
    svg+='</svg>';
    el.innerHTML='<div class="n8top"><span><b>'+esc(f.title)+'</b></span><span class="n8s"><i></i>running</span></div><div class="n8wrap">'+svg+'</div><div class="n8log"><time></time><span>…</span></div>';
    var nodes=el.querySelectorAll('.n8n-node'),edges=el.querySelectorAll('.n8e'),log=el.querySelector('.n8log span'),tm=el.querySelector('.n8log time');
    var i=0,base=new Date();base.setHours(12,4,0,0);
    function tick(){var st=f.steps[i],id=st[0];
      nodes.forEach(function(n){n.classList.toggle('on',n.dataset.n===id);n.classList.toggle('done',f.steps.slice(0,i).some(function(s){return s[0]===n.dataset.n}))});
      edges.forEach(function(e){var pr=f.steps[i-1]&&f.steps[i-1][0];e.classList.toggle('on',!!pr&&e.dataset.e===pr+'-'+id)});
      log.textContent=st[1];var d=new Date(base.getTime()+i*7000);tm.textContent=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2);i=(i+1)%f.steps.length}
    if(el._iv)clearInterval(el._iv);tick();el._iv=setInterval(tick,1900);el._vertical=vertical;
  }
  function all(){document.querySelectorAll('[data-flow]').forEach(function(el){var v=(el.clientWidth||360)<640;if(el._vertical===undefined||el._vertical!==v)render(el,el.dataset.flow)})}
  all();var to;window.addEventListener('resize',function(){clearTimeout(to);to=setTimeout(all,200)});
  window.N8FLOWS=FLOWS;
})();
