
(function(){
  const pathId=document.body.dataset.pathId||location.pathname;
  const stations=[...document.querySelectorAll('.station')];
  const tabs=[...document.querySelectorAll('.toc button')];
  let unlocked=parseInt(localStorage.getItem(pathId+':unlocked')||'0',10);
  let completed=new Set(JSON.parse(localStorage.getItem(pathId+':completed')||'[]'));
  function persist(){localStorage.setItem(pathId+':unlocked',unlocked);localStorage.setItem(pathId+':completed',JSON.stringify([...completed]));}
  function show(i){ if(i>unlocked) return; stations.forEach((s,k)=>s.classList.toggle('active',k===i)); tabs.forEach((b,k)=>b.classList.toggle('active',k===i)); window.scrollTo({top:0,behavior:'smooth'}); }
  function render(){
    tabs.forEach((b,i)=>{b.classList.toggle('locked',i>unlocked); b.querySelector('.lockmsg')?.remove(); if(i>unlocked){const sp=document.createElement('span');sp.className='lockmsg';sp.textContent=' 🔒';b.appendChild(sp);} });
    document.querySelector('.progress span').style.width=(completed.size/stations.length*100)+'%';
  }
  tabs.forEach((b,i)=>b.addEventListener('click',()=>show(i)));
  document.querySelectorAll('.answers button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const check=btn.closest('.check'); const fb=check.querySelector('.feedback');
      const ok=btn.dataset.correct==='1';
      check.querySelectorAll('button').forEach(b=>b.classList.remove('correct','wrong'));
      btn.classList.add(ok?'correct':'wrong');
      fb.textContent=ok?'Richtig – die nächste Station ist frei.':'Noch nicht. Nutze einen Tipp oder prüfe die Beobachtung genau.';
      fb.className='feedback '+(ok?'good':'bad');
      if(ok){
        const st=btn.closest('.station'); const idx=stations.indexOf(st); completed.add(idx); if(idx===unlocked && unlocked<stations.length-1) unlocked++; persist(); render();
      }
    });
  });
  document.querySelectorAll('.hint-btn').forEach((btn,btnIndex)=>{
    btn.addEventListener('click',()=>{
      const n=parseInt(btn.dataset.hint,10);
      const station=btn.closest('.station');
      const idx=stations.indexOf(station);
      const scope=btn.closest('.diff-hints') || btn.closest('.hints')?.parentElement || station;
      if(!scope.dataset.hintGroup){ scope.dataset.hintGroup='g'+idx+'-'+btnIndex; }
      const key=pathId+':hint:'+idx+':'+scope.dataset.hintGroup+':'+n;
      const now=Date.now();
      if(n>1){
        const prevKey=pathId+':hint:'+idx+':'+scope.dataset.hintGroup+':'+(n-1);
        const prev=parseInt(localStorage.getItem(prevKey)||'0',10);
        if(!prev){ alert('Öffne zuerst die vorherige Tippkarte.'); return; }
        if(now-prev<30000){ alert('Warte noch kurz, bevor die nächste Tippkarte erscheint.'); return; }
      }
      const box=scope.querySelector('.hint-box[data-hint="'+n+'"]');
      if(box) box.style.display='block';
      localStorage.setItem(key,now.toString());
    });
  });
  document.querySelectorAll('.mini-sim').forEach(initSim);
  function val(root,name){return parseFloat(root.querySelector('[name='+name+']')?.value||0)}
  function out(root,text){root.querySelector('.sim-output').innerHTML=text}
  function initSim(root){
    const type=root.dataset.sim; const inputs=root.querySelectorAll('input');
    const update=()=>{
      let t='';
      if(type==='pressure-area'){let F=val(root,'F'), A=val(root,'A'); t=`Druck: <b>${(F/(A/10000)/1000).toFixed(1)} kPa</b>. Kleine Fläche → größerer Druck.`}
      if(type==='density'){let m=val(root,'m'), V=val(root,'V'); t=`Dichte: <b>${(m/V).toFixed(2)} g/cm³</b>. Wasser hat etwa 1,00 g/cm³.`}
      if(type==='hydrostatic'){let h=val(root,'h'), rho=val(root,'rho'); t=`Zusätzlicher Schweredruck: <b>${(rho*9.81*h/1000).toFixed(1)} kPa</b>. Er wächst mit der Tiefe.`}
      if(type==='buoyancy'){let V=val(root,'V'), rho=val(root,'rho'); t=`Auftriebskraft: <b>${(rho*1000*9.81*(V/1e6)).toFixed(2)} N</b>. Sie entspricht dem Gewicht der verdrängten Flüssigkeit.`}
      if(type==='air'){let h=val(root,'h'); t=`Luftdruck grob: <b>${(1013*Math.exp(-h/8000)).toFixed(0)} hPa</b>. Mit der Höhe nimmt die Teilchendichte ab.`}
      if(type==='float'){let ko=val(root,'ko'), fl=val(root,'fl'); const res=ko<fl?'schwimmt':(ko>fl?'sinkt':'schwebt'); t=`Körperdichte ${ko.toFixed(2)} g/cm³, Flüssigkeit ${fl.toFixed(2)} g/cm³ → <b>${res}</b>.`}
      if(type==='atom'){let p=val(root,'p'), n=val(root,'n'); t=`Kernladungszahl Z = <b>${p}</b>, Massenzahl A = <b>${p+n}</b>. Isotope haben gleiche Protonenzahl, aber verschiedene Neutronenzahl.`}
      if(type==='radiation'){let z=val(root,'z'); let msg=z<1?'Papier kann Alpha meist abschirmen.':z<3?'Aluminium schwächt Beta deutlich.':'Dichte, dicke Abschirmung ist für Gamma nötig.'; t=`Abschirmung: <b>${msg}</b>`}
      if(type==='activity'){let N=val(root,'N'), T=val(root,'T'); t=`Bei ${N} instabilen Kernen und kurzer Halbwertszeit ist die Aktivität qualitativ <b>${(N/T).toFixed(0)} Einheiten</b>. Mehr Kerne oder kürzere Halbwertszeit → höhere Zählrate.`}
      if(type==='half-life'){let N=val(root,'N'), T=val(root,'T'), time=val(root,'time'); t=`Restmenge: <b>${(N*Math.pow(0.5,time/T)).toFixed(1)}</b> von ${N}. Nach jeder Halbwertszeit halbiert sich der Erwartungswert.`}
      if(type==='shield'){let time=val(root,'time'), dist=val(root,'dist'), shield=val(root,'shield'); let dose=time/(dist*dist)/(1+shield); t=`Relative Dosis: <b>${dose.toFixed(3)}</b>. Weniger Zeit, mehr Abstand, bessere Abschirmung senken die Dosis.`}
      if(type==='fission'){let k=val(root,'k'); let msg=k<0.9?'Kettenreaktion klingt ab':k<1.1?'stabile kontrollierte Kettenreaktion':'Kettenreaktion wächst stark'; t=`Neutronenfaktor k ≈ <b>${k.toFixed(2)}</b>: ${msg}.`}
      if(type==='fusion'){let T=val(root,'T'), p=val(root,'p'); t=`Fusionsbedingungen grob: Temperatur ${T} Mio. °C und Einschluss ${p} → <b>${T>80&&p>5?'günstiger':'noch schwierig'}</b>. Fusion braucht extrem hohe Temperaturen und guten Einschluss.`}
      if(type==='magnetic'){let I=val(root,'I'), N=val(root,'N'); t=`Feldstärke-Modellwert: <b>${(I*N).toFixed(0)}</b>. Mehr Windungen oder größerer Strom verstärken das Magnetfeld.`}
      if(type==='induction'){let N=val(root,'N'), v=val(root,'v'), B=val(root,'B'); t=`Induktionsspannung-Modellwert: <b>${(N*v*B/100).toFixed(2)}</b>. Änderung des Magnetfeldes ist entscheidend.`}
      if(type==='generator'){let f=val(root,'f'), B=val(root,'B'); t=`Wechselspannung: Frequenz <b>${f}</b> Hz, Amplituden-Modell <b>${(f*B/10).toFixed(1)}</b>. Schneller drehen → häufigere Richtungswechsel.`}
      if(type==='transformer'){let Up=val(root,'Up'), Np=val(root,'Np'), Ns=val(root,'Ns'); t=`Sekundärspannung: <b>${(Up*Ns/Np).toFixed(1)} V</b>. Verhältnis der Windungszahlen bestimmt die Spannungswandlung.`}
      if(type==='motor'){let I=val(root,'I'), B=val(root,'B'); t=`Drehmoment-Modellwert: <b>${(I*B).toFixed(1)}</b>. Größerer Strom und stärkeres Feld erzeugen eine stärkere Drehwirkung.`}
      if(type==='energy'){let P=val(root,'P'), h=val(root,'h'), price=val(root,'price'); let E=P*h/1000; t=`Energie: <b>${E.toFixed(2)} kWh</b>, Kosten: <b>${(E*price).toFixed(2)} €</b>.`}
      if(type==='storage'){let C=val(root,'C'), P=val(root,'P'); t=`Laufzeit: <b>${(C/P).toFixed(1)} h</b>. Speicher lösen Zeitverschiebung, aber nicht unbegrenzte Energie.`}
      out(root,t);
    };
    inputs.forEach(i=>i.addEventListener('input',update)); update();
  }

  document.querySelectorAll('[data-diagnose]').forEach(box=>{
    const btn=box.querySelector('.diagnose-btn');
    if(!btn) return;
    btn.addEventListener('click',()=>{
      const checked=[...box.querySelectorAll('input[type=checkbox]')].filter(x=>x.checked).length;
      const out=box.querySelector('.diagnose-output');
      if(checked>=3) out.innerHTML='<b>Empfehlung:</b> Du kannst zügig arbeiten und die Sprinter- oder Entscheidungsaufgabe bearbeiten.';
      else if(checked===2) out.innerHTML='<b>Empfehlung:</b> Bearbeite den Lernpfad normal und nutze bei der Rechenstation die Tippkarten.';
      else out.innerHTML='<b>Empfehlung:</b> Wiederhole zuerst Begriffe und Einheiten. Öffne die Tippkarten frühzeitig.';
    });
  });
  document.querySelectorAll('.formula-trainer').forEach(box=>{
    const btn=box.querySelector('.trainer-check');
    if(!btn) return;
    btn.addEventListener('click',()=>{
      const raw=(box.querySelector('.trainer-value')?.value||'').replace(',','.');
      const value=parseFloat(raw);
      const expected=parseFloat(box.dataset.answer);
      const tol=parseFloat(box.dataset.tolerance||'0.01');
      const unit=(box.querySelector('.trainer-unit')?.value||'').trim().toLowerCase().replace('³','3').replace('²','2');
      const expectedUnit=(box.dataset.unit||'').trim().toLowerCase().replace('³','3').replace('²','2');
      const out=box.querySelector('.trainer-feedback');
      if(Number.isNaN(value)){ out.className='trainer-feedback bad'; out.textContent='Gib zuerst einen Zahlenwert ein.'; return; }
      const valOk=Math.abs(value-expected)<=tol;
      const unitOk=!expectedUnit || unit===expectedUnit || (expectedUnit==='kerne' && unit.includes('kern')) || (expectedUnit==='impulse/min' && unit.includes('imp'));
      if(valOk && unitOk){ out.className='trainer-feedback good'; out.textContent='Richtig. Zahlenwert und Einheit passen.'; }
      else if(valOk && !unitOk){ out.className='trainer-feedback bad'; out.textContent='Der Zahlenwert passt, aber die Einheit muss noch geprüft werden.'; }
      else { out.className='trainer-feedback bad'; out.textContent='Noch nicht. Prüfe Formel, Einheitenumrechnung und Rundung.'; }
    });
  });
  document.querySelectorAll('.reflection-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const box=btn.closest('.competence-reflection');
      const n=[...box.querySelectorAll('input[type=checkbox]')].filter(x=>x.checked).length;
      const out=box.querySelector('.reflection-output');
      if(n>=4) out.innerHTML='<b>Sehr gut:</b> Bearbeite als Nächstes eine Transfer- oder Sprinteraufgabe.';
      else if(n>=2) out.innerHTML='<b>Solide:</b> Wiederhole gezielt die Punkte ohne Häkchen.';
      else out.innerHTML='<b>Üben:</b> Gehe zurück zur Diagnose, zur Experimentierstation und zum Rechentraining.';
    });
  });
  document.querySelectorAll('.decision-select').forEach(sel=>{
    sel.addEventListener('change',()=>{
      const box=sel.closest('.decision-task');
      let fb=box.querySelector('.decision-feedback');
      if(!fb){ fb=document.createElement('div'); fb.className='decision-feedback small'; box.appendChild(fb); }
      fb.textContent='Begründe deine Wahl jetzt mit einem Fachbegriff und mindestens einer Grenze des Modells.';
    });
  });

  render(); show(0);
})();
