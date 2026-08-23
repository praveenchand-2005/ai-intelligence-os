const RDAP_BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';
const DOH_URL = 'https://cloudflare-dns.com/dns-query';

const normalizeDomain = value => {
  let input = String(value || '').trim().toLowerCase();
  if (!input) throw new Error('domain is required');
  try { if (input.includes('://')) input = new URL(input).hostname; } catch {}
  input = input.replace(/^www\./, '').replace(/\.$/, '');
  if (!/^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/.test(input) || !input.includes('.')) throw new Error('invalid domain');
  return input;
};

const fetchJson = async (url, headers = {}) => {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`upstream ${response.status}`);
  return response.json();
};

const rdapBaseFor = (bootstrap, domain) => {
  const labels = domain.split('.');
  for (let i = 0; i < labels.length - 1; i++) {
    const suffix = labels.slice(i).join('.');
    const match = bootstrap.services?.find(([suffixes]) => suffixes.includes(suffix));
    if (match?.[1]?.[0]) return match[1][0].replace(/\/$/, '');
  }
  return null;
};

const dns = async (domain, type) => {
  const url = `${DOH_URL}?name=${encodeURIComponent(domain)}&type=${type}`;
  return fetchJson(url, { accept: 'application/dns-json' });
};

export async function investigateDomain(value) {
  const domain = normalizeDomain(value);
  const retrievedAt = new Date().toISOString();
  const bootstrap = await fetchJson(RDAP_BOOTSTRAP_URL, { accept: 'application/json' });
  const rdapBase = rdapBaseFor(bootstrap, domain);
  let rdap = null;
  if (rdapBase) {
    try { rdap = await fetchJson(`${rdapBase}/domain/${encodeURIComponent(domain)}`, { accept: 'application/rdap+json, application/json' }); } catch { rdap = null; }
  }
  const [a, aaaa, mx, ns, txt] = await Promise.all(['A','AAAA','MX','NS','TXT'].map(type => dns(domain, type).catch(error => ({ error: error.message }))));
  const evidence = [];
  const add = (provider, url, title, summary, raw) => evidence.push({ id: crypto.randomUUID(), provider, url, observedAt: retrievedAt, retrievedAt, attribution: provider, title, summary, raw });
  add('Cloudflare DNS-over-HTTPS', `${DOH_URL}?name=${encodeURIComponent(domain)}&type=A`, 'A records', (a.Answer || []).map(x => x.data).join(', ') || 'No A answer', a);
  add('Cloudflare DNS-over-HTTPS', `${DOH_URL}?name=${encodeURIComponent(domain)}&type=AAAA`, 'AAAA records', (aaaa.Answer || []).map(x => x.data).join(', ') || 'No AAAA answer', aaaa);
  add('Cloudflare DNS-over-HTTPS', `${DOH_URL}?name=${encodeURIComponent(domain)}&type=MX`, 'Mail exchange', (mx.Answer || []).map(x => x.data).join(', ') || 'No MX answer', mx);
  add('Cloudflare DNS-over-HTTPS', `${DOH_URL}?name=${encodeURIComponent(domain)}&type=NS`, 'Name servers', (ns.Answer || []).map(x => x.data).join(', ') || 'No NS answer', ns);
  add('Cloudflare DNS-over-HTTPS', `${DOH_URL}?name=${encodeURIComponent(domain)}&type=TXT`, 'TXT records', (txt.Answer || []).map(x => x.data).join(' | ') || 'No TXT answer', txt);
  if (rdap) add('IANA RDAP bootstrap + authoritative RDAP', `${rdapBase}/domain/${encodeURIComponent(domain)}`, 'RDAP registration', 'Authoritative RDAP response retrieved', rdap);
  return { domain, retrievedAt, sources: { rdap: Boolean(rdap), dns: true }, rdap, dns: { A:a, AAAA:aaaa, MX:mx, NS:ns, TXT:txt }, evidence };
}
