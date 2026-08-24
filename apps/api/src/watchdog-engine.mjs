import { detectChanges, createAlert } from './alerts.mjs';
import { saveAlert, saveWatch } from './watchdog-store.mjs';
import { executeWatch } from './watchdog.mjs';
const previous=new Map();
export async function runWatchWithChangeDetection(id,collector){const out=await executeWatch(id,collector);if(!out)return null;const prior=previous.get(id);const current=out.job.result;const changes=detectChanges(prior,current);previous.set(id,current);if(changes.length){const alert=createAlert({watchId:id,changes});await saveAlert(alert);out.alert=alert;}await saveWatch(out.watch);return out;}
export function resetWatchBaseline(id){previous.delete(id);}
