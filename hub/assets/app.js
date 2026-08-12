
const modal=document.getElementById('search-modal'),input=document.getElementById('global-search'),results=document.getElementById('search-results'),count=document.getElementById('result-count');
const pages=window.BOMO_SEARCH_INDEX||[];
function openSearch(){if(!modal)return;modal.classList.remove('hidden');setTimeout(()=>input?.focus(),50)}
function closeSearch(){modal?.classList.add('hidden')}
document.querySelectorAll('[data-open-search]').forEach(b=>b.addEventListener('click',openSearch));
document.querySelectorAll('[data-close-search]').forEach(b=>b.addEventListener('click',closeSearch));
modal?.addEventListener('click',e=>{if(e.target===modal)closeSearch()});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}if(e.key==='Escape')closeSearch()});
input?.addEventListener('input',()=>{
 const q=input.value.trim().toLowerCase();
 if(!q){count.textContent='Start typing';results.innerHTML='<div class="p-10 text-center text-sm text-slate-500"><i class="fa-regular fa-keyboard mb-3 block text-2xl text-slate-300"></i>Enter a keyword or topic.</div>';return}
 const found=pages.filter(p=>(p.title+' '+p.description+' '+p.section).toLowerCase().includes(q)).slice(0,30);
 count.textContent=found.length+' result'+(found.length===1?'':'s');
 results.innerHTML=found.length?found.map(p=>`<a href="${p.url}" class="block rounded-xl p-4 hover:bg-slate-50"><div class="text-xs font-bold uppercase tracking-wider text-blue-600">${p.section}</div><div class="mt-1 font-bold text-slate-900">${p.title}</div><div class="mt-1 text-sm leading-6 text-slate-500">${p.description}</div></a>`).join(''):'<div class="p-10 text-center text-sm text-slate-500">No matching page found. Try a broader keyword.</div>';
});
