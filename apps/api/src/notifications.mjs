const deliveries=[];
export function buildNotification(alert){if(!alert)return null;return {id:crypto.randomUUID(),alertId:alert.id,channel:'in-app',status:'delivered',title:'WatchDog change detected',body:`${alert.changes?.length||0} new evidence item(s) detected`,createdAt:new Date().toISOString()};}
export function deliverAlert(alert){const n=buildNotification(alert);if(n)deliveries.unshift(n);return n;}
export function listDeliveries(){return deliveries;}
