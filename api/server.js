import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const port = process.env.PORT || 10000;

app.get('/health', async (_req,res) => {
  if (!sql) return res.json({ok:true, database:'not_configured', service:'cashflowos-api'});
  try { await sql`select 1`; res.json({ok:true,database:'connected',service:'cashflowos-api'}); }
  catch { res.status(503).json({ok:false,database:'unavailable',service:'cashflowos-api'}); }
});

function org(req){ return req.header('x-organization-id') || null; }
app.get('/api/overview', async (req,res) => {
  if (!sql) return res.status(503).json({error:'DATABASE_URL is not configured'});
  const id=org(req); if(!id) return res.status(400).json({error:'x-organization-id required'});
  try {
    const [kpi] = await sql`select coalesce(sum(outstanding),0)::numeric as outstanding, coalesce(sum(case when due_at < current_date and outstanding > 0 then outstanding else 0 end),0)::numeric as overdue, count(*) filter(where outstanding>0) as open_invoices from invoice_balances where organization_id=${id}`;
    const [promises] = await sql`select coalesce(sum(amount),0)::numeric as due_today from payment_promises where organization_id=${id} and promised_at=current_date and status='pending'`;
    const [orders] = await sql`select count(*)::int as orders_waiting from orders where organization_id=${id} and status in ('draft','pending')`;
    res.json({outstanding:kpi.outstanding,overdue:kpi.overdue,openInvoices:kpi.open_invoices,promisesDueToday:promises.due_today,ordersWaiting:orders.orders_waiting});
  } catch(e){res.status(500).json({error:'overview_failed'});}
});

app.get('/api/customers', async (req,res)=>{
  if(!sql)return res.status(503).json({error:'DATABASE_URL is not configured'}); const id=org(req); if(!id)return res.status(400).json({error:'x-organization-id required'});
  try { const rows=await sql`select c.id,c.name,c.credit_limit,coalesce(sum(ib.outstanding),0)::numeric as outstanding,count(ib.id) filter(where ib.outstanding>0 and ib.due_at<current_date)::int as overdue_invoices from customers c left join invoice_balances ib on ib.customer_id=c.id and ib.organization_id=c.organization_id where c.organization_id=${id} group by c.id order by outstanding desc`; res.json(rows); } catch {res.status(500).json({error:'customers_failed'});}
});

app.post('/api/payments', async(req,res)=>{
  if(!sql)return res.status(503).json({error:'DATABASE_URL is not configured'}); const id=org(req); const {invoice_id,amount,paid_at,reference}=req.body||{}; if(!id||!invoice_id||!amount||!paid_at)return res.status(400).json({error:'organization, invoice_id, amount and paid_at required'});
  try { const rows=await sql`insert into payments(organization_id,invoice_id,amount,paid_at,reference) values(${id},${invoice_id},${amount},${paid_at},${reference||null}) returning id,invoice_id,amount,paid_at,reference`; res.status(201).json(rows[0]); } catch {res.status(500).json({error:'payment_failed'});}
});

app.post('/api/promises', async(req,res)=>{
  if(!sql)return res.status(503).json({error:'DATABASE_URL is not configured'}); const id=org(req); const {customer_id,invoice_id,amount,promised_at}=req.body||{}; if(!id||!customer_id||!amount||!promised_at)return res.status(400).json({error:'customer_id, amount and promised_at required'});
  try { const rows=await sql`insert into payment_promises(organization_id,customer_id,invoice_id,amount,promised_at) values(${id},${customer_id},${invoice_id||null},${amount},${promised_at}) returning *`; res.status(201).json(rows[0]); } catch {res.status(500).json({error:'promise_failed'});}
});

app.listen(port,()=>console.log(`CashFlowOS API listening on ${port}`));
