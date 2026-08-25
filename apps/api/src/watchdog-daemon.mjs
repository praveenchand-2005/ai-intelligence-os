import { tick } from './watchdog-scheduler.mjs';
import { runWatchWithChangeDetection } from './watchdog-engine.mjs';
import { collect } from './investigation.mjs';
let timer=null;
export function startWatchdogDaemon(){if(timer)return timer;const run=async({watchId})=>runWatchWithChangeDetection(watchId,async target=>{const r=await collect(target);return {kind:r.kind,evidence:r.evidence,result:r.result}});timer=setInterval(()=>tick(run).catch(e=>console.error('watchdog tick failed',e)),60_000);timer.unref?.();return timer;}
export function stopWatchdogDaemon(){if(timer){clearInterval(timer);timer=null;}}
