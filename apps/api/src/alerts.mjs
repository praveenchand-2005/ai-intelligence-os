const alerts=[];
export function detectChanges(previous,current){const before=new Set((previous?.evidence||[]).map(e=>`${e.provider}:${e.title}:${e.url||''}`));return (current?.evidence||[]).filter(e=>!before.has(`${e.provider}:${e.title}:${e.url||''}`));}
export function createAlert({watchId,changes}){if(!changes?.length)return null;const alert={id:crypto.randomUUID(),watchId,type:'change-detected',severity:'info',changes,createdAt:new Date().toISOString(),read:false};alerts.unshift(alert);return alert;}
export function listAlerts({watchId}={}){return watchId?alerts.filter(a=>a.watchId===watchId):alerts;}
export function markRead(id){const a=alerts.find(x=>x.id===id);if(a)a.read=true;return a||null;}
