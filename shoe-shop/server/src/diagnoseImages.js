// Product image diagnostic.
//
// Default mode reads DATABASE_URL and checks every row in product_images (plus products with no
// image). --api-base checks exactly what the storefront receives from a running API.
//
//   node src/diagnoseImages.js
//   node src/diagnoseImages.js --transform
//   node src/diagnoseImages.js --api-base https://example.onrender.com
//   node src/diagnoseImages.js --urls urls.txt
//   node src/diagnoseImages.js --json ../server/data/image-report.json
//
// It never writes to the database or storage. It only performs GET/HEAD requests.

const fs = require('fs');
const path = require('path');

const argValue = (name, fallback = null) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : fallback;
};
const argFlag = (name) => process.argv.includes(name);
const CONCURRENCY = Math.max(1, Math.min(32, parseInt(argValue('--concurrency', '8'), 10) || 8));
const TIMEOUT = Math.max(1000, parseInt(argValue('--timeout', '20000'), 10) || 20000);
const TRANSFORM = argFlag('--transform');
const JSON_OUT = argValue('--json');
const API_BASE = argValue('--api-base');
const URLS_FILE = argValue('--urls');
const STRICT = argFlag('--strict');

const IMAGE_MAGIC = (buf, type) => {
  if (!buf || buf.length < 4) return false;
  const b = buf;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.slice(0, 6).toString('ascii') === 'GIF87a' || b.slice(0, 6).toString('ascii') === 'GIF89a') return 'gif';
  if (b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP') return 'webp';
  if (b.slice(4, 8).toString('ascii') === 'ftyp') {
    const brand = b.slice(8, 12).toString('ascii');
    if (['avif', 'avis', 'heic', 'heix', 'mif1'].includes(brand)) return brand.startsWith('avi') ? 'avif' : 'heic';
  }
  const head = b.slice(0, 64).toString('utf8').trim().toLowerCase();
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'svg';
  return null;
};

const isSupabaseObject = (url) => {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.pathname.includes('/storage/v1/object/public/');
  } catch { return false; }
};

const transformUrl = (url) => {
  try {
    const u = new URL(url);
    const marker = '/storage/v1/object/public/';
    const at = u.pathname.indexOf(marker);
    if (at < 0) return null;
    const objectPath = u.pathname.slice(at + marker.length);
    u.pathname = `/storage/v1/render/image/public/${objectPath}`;
    u.searchParams.set('width', '640');
    u.searchParams.set('quality', '70');
    u.searchParams.set('format', 'webp');
    return u.toString();
  } catch { return null; }
};

async function readFirstBytes(url, timeout) {
  const res = await fetch(url, {
    headers: { Range: 'bytes=0-63' },
    redirect: 'follow',
    signal: AbortSignal.timeout(timeout),
  });
  const reader = res.body && res.body.getReader ? res.body.getReader() : null;
  let buf = Buffer.alloc(0);
  if (reader) {
    const { value } = await reader.read();
    buf = Buffer.from(value || []);
    await reader.cancel().catch(() => {});
  }
  return {
    status: res.status,
    contentType: res.headers.get('content-type') || '',
    contentLength: res.headers.get('content-length') || '',
    finalUrl: res.url,
    buf,
  };
}

function classify(check) {
  if (check.error) return { ok: false, reason: check.error };
  if (check.status >= 400) return { ok: false, reason: `HTTP ${check.status}` };
  if (check.status >= 300 && !check.finalUrl) return { ok: false, reason: `HTTP ${check.status}` };
  const ct = String(check.contentType || '').toLowerCase();
  if (ct && !ct.startsWith('image/')) {
    return { ok: false, reason: `non-image content-type: ${ct}` };
  }
  if (!check.magic && !ct.startsWith('image/')) return { ok: false, reason: 'body is not a recognised image' };
  return { ok: true, reason: 'ok' };
}

async function inspect(url, { target, product } = {}) {
  const started = Date.now();
  const base = url && url.startsWith('/') ? `${target || ''}${url}` : url;
  const result = {
    productId: product?.id ?? null,
    sku: product?.sku ?? null,
    name: product?.name ?? null,
    url,
    target: base,
    status: null,
    contentType: '',
    contentLength: '',
    magic: null,
    elapsedMs: 0,
    reason: '',
    ok: false,
  };

  if (url && url.startsWith('/') && !target) {
    result.reason = 'relative URL but no --api-base was supplied';
    result.elapsedMs = Date.now() - started;
    return result;
  }

  try {
    const head = await fetch(base, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT) });
    result.status = head.status;
    result.contentType = head.headers.get('content-type') || '';
    result.contentLength = head.headers.get('content-length') || '';
    result.finalUrl = head.url;
    const headOk = head.status < 400 && result.contentType.toLowerCase().startsWith('image/');
    if (!headOk) {
      const got = await readFirstBytes(base, TIMEOUT);
      result.status = got.status;
      result.contentType = got.contentType || result.contentType;
      result.contentLength = got.contentLength || result.contentLength;
      result.finalUrl = got.finalUrl;
      result.magic = IMAGE_MAGIC(got.buf);
    }
  } catch (headErr) {
    // Some servers/CDNs reject HEAD. Retry with a tiny ranged GET before calling it a failure.
    try {
      const got = await readFirstBytes(base, TIMEOUT);
      result.status = got.status;
      result.contentType = got.contentType;
      result.contentLength = got.contentLength;
      result.finalUrl = got.finalUrl;
      result.magic = IMAGE_MAGIC(got.buf);
    } catch (err) {
      result.error = err.name === 'TimeoutError' ? `timeout after ${TIMEOUT}ms` : (err.message || String(err));
    }
  }

  const verdict = classify(result);
  result.ok = verdict.ok;
  result.reason = verdict.reason;
  if (TRANSFORM && result.ok && isSupabaseObject(base)) {
    try {
      const t = transformUrl(base);
      const tr = await fetch(t, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT) });
      result.transform = {
        url: t,
        status: tr.status,
        contentType: tr.headers.get('content-type') || '',
        contentLength: tr.headers.get('content-length') || '',
        ok: tr.status < 400 && (tr.headers.get('content-type') || '').toLowerCase().startsWith('image/'),
      };
    } catch (err) {
      result.transform = { url: transformUrl(base), status: null, ok: false, reason: err.message };
    }
  }
  result.elapsedMs = Date.now() - started;
  return result;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

async function fromDatabase() {
  // Import db only in DB mode so --urls/--api-base can run without a database.
  const { db } = require('./db');
  const rows = await db.all(`
    SELECT pi.id AS image_id, pi.product_id, pi.url, pi.position,
           p.sku, p.name
    FROM product_images pi JOIN products p ON p.id = pi.product_id
    ORDER BY pi.product_id, pi.position, pi.id`);
  const without = await db.all(`
    SELECT p.id, p.sku, p.name
    FROM products p
    WHERE NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id)
    ORDER BY p.id`);
  const items = rows.map((r) => ({
    url: r.url,
    product: { id: r.product_id, sku: r.sku, name: r.name },
    imageId: r.image_id,
    position: r.position,
  }));
  return { source: 'database', items, productsWithoutImage: without };
}

async function fromApi(apiBase) {
  const products = [];
  for (let page = 1; page <= 100; page++) {
    const res = await fetch(`${apiBase.replace(/\/+$/, '')}/api/products?limit=100&page=${page}`, {
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) throw new Error(`API ${apiBase} returned HTTP ${res.status}`);
    const data = await res.json();
    products.push(...(data.items || []));
    if (page >= (data.pages || 1) || !(data.items || []).length) break;
  }
  const items = [];
  const seen = new Set();
  const mappingIssues = [];
  for (const p of products) {
    const urls = Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []);
    if (p.image && p.images?.length && p.image !== p.images[0]) {
      mappingIssues.push({ id: p.id, sku: p.sku, name: p.name, image: p.image, firstImage: p.images[0] });
    }
    if (urls.length && !p.image) {
      mappingIssues.push({ id: p.id, sku: p.sku, name: p.name, image: null, firstImage: p.images?.[0] || null });
    }
    for (const url of urls) {
      const key = `${p.id}|${url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({ url, product: { id: p.id, sku: p.sku, name: p.name } });
    }
  }
  const without = products.filter((p) => !p.image && !(p.images || []).length)
    .map((p) => ({ id: p.id, sku: p.sku, name: p.name }));
  return { source: `api ${apiBase}`, items, productsWithoutImage: without, mappingIssues, productCount: products.length };
}

function fromUrlsFile(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
  return { source: `urls ${file}`, items: lines.map((url) => ({ url })), productsWithoutImage: [] };
}

function printReport(report) {
  console.log(`Source: ${report.source}`);
  console.log(`Checked: ${report.results.length} image URLs (${report.items} references)`);
  console.log(`OK: ${report.ok.length}`);
  console.log(`Failed: ${report.failed.length}`);
  const byReason = {};
  for (const r of report.failed) byReason[r.reason] = (byReason[r.reason] || 0) + 1;
  for (const [reason, count] of Object.entries(byReason).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count} × ${reason}`);
  }
  if (report.source.startsWith('api ')) {
    console.log('Note: API mode sees only URLs the API exposes; use DB mode to find rows filtered out of the public API.');
  }
  if (report.productsWithoutImage.length) {
    console.log(`Products without any image: ${report.productsWithoutImage.length}`);
  }
  if (report.mappingIssues?.length) {
    console.log(`API image mapping issues: ${report.mappingIssues.length}`);
  }
  if (TRANSFORM) {
    const t = report.results.filter((r) => r.transform);
    console.log(`Transform checks: ${t.filter((r) => r.transform.ok).length}/${t.length} OK`);
  }

  if (report.failed.length) {
    console.log('\nFailures (product | sku | status | content-type | reason | url):');
    for (const r of report.failed) {
      console.log(`${r.productId ?? '-'} | ${r.sku ?? '-'} | ${r.status ?? '-'} | ${r.contentType || '-'} | ${r.reason} | ${r.url}`);
    }
  }
  if (report.productsWithoutImage.length) {
    console.log('\nProducts with no image row:');
    for (const p of report.productsWithoutImage) console.log(`${p.id} | ${p.sku} | ${p.name}`);
  }
  if (report.mappingIssues?.length) {
    console.log('\nAPI mapping issues:');
    for (const p of report.mappingIssues) console.log(`${p.id} | ${p.sku} | image=${p.image} | images[0]=${p.firstImage}`);
  }
}

async function main() {
  let source;
  let dbModule = null;
  if (URLS_FILE) source = fromUrlsFile(URLS_FILE);
  else if (API_BASE) source = await fromApi(API_BASE);
  else {
    dbModule = require('./db');
    await dbModule.init();
    source = await fromDatabase();
  }

  const target = API_BASE ? API_BASE.replace(/\/+$/, '') : null;
  const results = await mapLimit(source.items, CONCURRENCY, (item) =>
    inspect(item.url, { target, product: item.product }));
  const ok = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  const report = {
    generatedAt: new Date().toISOString(),
    source: source.source,
    productCount: source.productCount ?? null,
    items: source.items.length,
    results,
    ok,
    failed,
    productsWithoutImage: source.productsWithoutImage,
    mappingIssues: source.mappingIssues || [],
  };

  printReport(report);

  if (JSON_OUT) {
    const out = path.resolve(JSON_OUT);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(report, null, 2));
    console.log(`\nJSON report: ${out}`);
  }
  if (STRICT && failed.length) process.exitCode = 1;
  if (dbModule) await dbModule.close().catch(() => {});
}

main().catch((err) => { console.error(err); process.exit(1); });
