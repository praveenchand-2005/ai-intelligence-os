// Ledger route definitions for CashFlowOS. Imported by the API server.
export function registerLedgerEndpoints(app, sql, org, requiredOrg, money) {
  app.get('/api/invoices', async (req,res) => {
    if (!sql) return res.status(503).json({error:'DATABASE_URL is not configured'});
    const id = requiredOrg(req,res); if (!id) return;
    try {
      const rows = await sql`select i.id,i.external_id,i.customer_id,c.name customer_name,i.issued_at,i.due_at,i.amount,
        coalesce(sum(p.amount),0)::numeric paid_amount,
        greatest(i.amount-coalesce(sum(p.amount),0),0)::numeric balance,
        case when greatest(i.amount-coalesce(sum(p.amount),0),0)=0 then 'paid'
             when i.due_at < current_date then 'overdue'
             when coalesce(sum(p.amount),0)>0 then 'partial' else 'open' end status,
        greatest(0,current_date-i.due_at)::int days_overdue
        from invoices i join customers c on c.id=i.customer_id
        left join payments p on p.invoice_id=i.id and p.organization_id=${id}
        where i.organization_id=${id}
        group by i.id,c.id order by i.due_at asc, balance desc limit 500`;
      res.json(rows.map(x=>({...x,amount:money(x.amount),paid_amount:money(x.paid_amount),balance:money(x.balance)})));
    } catch(e){ console.error(e); res.status(500).json({error:'invoices_failed'}); }
  });

  app.get('/api/invoices/:invoiceId', async (req,res) => {
    if (!sql) return res.status(503).json({error:'DATABASE_URL is not configured'});
    const id = requiredOrg(req,res); if (!id) return;
    try {
      const [invoice] = await sql`select i.id,i.external_id,i.customer_id,c.name customer_name,c.phone,c.email,i.issued_at,i.due_at,i.amount,
        coalesce(sum(p.amount),0)::numeric paid_amount,greatest(i.amount-coalesce(sum(p.amount),0),0)::numeric balance
        from invoices i join customers c on c.id=i.customer_id left join payments p on p.invoice_id=i.id and p.organization_id=${id}
        where i.id=${req.params.invoiceId} and i.organization_id=${id} group by i.id,c.id`;
      if(!invoice) return res.status(404).json({error:'invoice_not_found'});
      const payments=await sql`select id,amount,paid_at,reference from payments where organization_id=${id} and invoice_id=${req.params.invoiceId} order by paid_at desc,created_at desc`;
      res.json({...invoice,amount:money(invoice.amount),paid_amount:money(invoice.paid_amount),balance:money(invoice.balance),payments:payments.map(p=>({...p,amount:money(p.amount)}))});
    } catch(e){ console.error(e); res.status(500).json({error:'invoice_detail_failed'}); }
  });
}
