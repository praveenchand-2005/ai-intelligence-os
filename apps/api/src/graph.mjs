export function buildGraph(caseData){
 const nodes=[]; const edges=[]; const add=(id,type,label,meta={})=>{if(!nodes.some(n=>n.id===id))nodes.push({id,type,label,...meta})};
 const targetId=`target:${caseData.id}`; add(targetId,'entity',caseData.target);
 for(const e of caseData.evidence||[]){const eid=`evidence:${e.id}`, sid=`source:${e.provider}`;add(eid,'evidence',e.title,{summary:e.summary,url:e.url||null,retrievedAt:e.retrievedAt});add(sid,'source',e.provider);edges.push({id:`${targetId}->${eid}`,source:targetId,target:eid,type:'supported-by'});edges.push({id:`${eid}->${sid}`,source:eid,target:sid,type:'from-source'});}
 return {caseId:caseData.id,nodes,edges,generatedAt:new Date().toISOString()};
}
