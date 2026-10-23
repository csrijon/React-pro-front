# Product Image Diagnostic Report

Generated: 2026-10-23 08:21 UTC

## Summary

| Source | Products | Image refs seen | Valid image URLs | Missing / filtered | Products with no image |
|---|---:|---:|---:|---:|---:|
| Configured `DATABASE_URL` (Supabase `public`) | 149 | 149 | 149 | 0 | 0 |
| Live API (`react-pro-front-1.onrender.com`) | 176 | 170 | 104 | 66 legacy `/uploads` files (65 products) | 72 |

The configured database (149 products, 149 `product_images` rows) has exactly one valid image per product; all 149 URLs returned HTTP 200 with an image content type, and all 149 Supabase transform URLs also returned 200 WebP. The live deployment exposes a different dataset: 104 working Supabase URLs and 66 legacy `/uploads/...` files across 65 products whose files are gone. The current code filters those dead URLs from the public API, so the affected products now show the placeholder instead of a request that 404s.

## Root cause

The live Render service was running without `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`, so admin uploads were written to Render's ephemeral local disk and stored as `/uploads/<filename>`. Render discarded those files on deploy/restart. The database rows survived; the files did not. This is not a `p.image` mapping bug and not a Supabase permission problem: the 104 Supabase URLs are valid, and the frontend correctly reads `p.image` (which equals `p.images[0]`).

## Live products with missing local files

These 65 products were returned by the live API before the filter was deployed. Every listed `/uploads/...` URL returned HTTP 404. The files were also absent from the Supabase `product-images` bucket. One product (`Bibi`, ID 181) has two missing files.

| Product ID | SKU | Name | Missing file | CSV URL available? |
|---:|---|---|---|---|
| 73 | MX-1 | MLQ MX-1 | `30f5d75eef7097bf0516d687.jpg` | yes |
| 136 | W172 | Walkaroo W172 | `9fa5663120db0fa20588fd14.jpg` | yes |
| 142 | WL7206-2 | Walkaroo WL7206 | `fe8cac939a125b5dc3e4a9de.jpg` | no |
| 151 | Cutie -3 | Xpert Cutie -3 | `e234d4143a379c47aab19ef4.jpg` | yes |
| 154 | 906 | Khadim's 906 | `e0e9c4795bda1ef1ebfcdbf6.jpg` | yes |
| 157 | 2875 | Khadim's 2875 | `76edc82b7a41d35e7987dff0.jpg` | yes |
| 159 | WGB53340 | Walkaroo WGB53340 | `a43c29769a5dedb98b6160c5.jpg` | no |
| 160 | SG1028 | CT SG1028 | `8e050273e3c947c007a8fd6a.jpg` | no |
| 161 | Barbie.22 | Uttam Barbie | `7b480dcb457615174a625879.jpg` | no |
| 164 | Barbie.24 | Uttam Barbie.24 | `34eeb77f663abade129175f9.jpg` | no |
| 165 | 001 | Khadim 001 | `191a0a76fadc279fb3ce1b1e.jpg` | no |
| 166 | PL348 | Ajanta PL348 | `86226239927b20bf43beadc1.jpg` | no |
| 167 | 028 | Ajanta 028 | `ed87aca1b2f9b36cbbce46f5.jpg` | no |
| 168 | Ecoplus 09 | Ajanta Ecoplus 09 | `794c78775c3a17d264554619.jpg` | no |
| 169 | AJ 028 | Ajanta Aj 028 | `9749f9d47bacd8c5a20b2786.jpg` | no |
| 170 | 422 | Khadim 422 | `3a34360734dbeb76b6322c93.jpg` | no |
| 171 | PSG VEL | Ajanta Psg vel | `2d7eb6a43b7ee690f483a256.jpg` | no |
| 172 | Queen | Ajanta Queen | `0f7ff3e64e36cc6fe0c34477.png` | no |
| 173 | Medifit | Ajanta Medifit | `de3fd0e27747248b8cc98aa1.jpg` | no |
| 174 | 706 | Khadim 706 | `441973bfa31209e289b79739.jpg` | no |
| 175 | 017 | Khadim 017 | `c16615e3bccd30d2b5de343f.jpg` | no |
| 176 | Health | Ajanta Health | `db9b9de8c129ea82e4f9c5e4.jpg` | no |
| 177 | 043 | Khadim 043 | `63b0d0d1a8f527009d47c0ff.jpg` | no |
| 178 | 643 | Khadim 643 | `5c466ae3078c15c1818b9b53.jpg` | no |
| 179 | Rozy | Xpert Rozy | `b4b5f149c952e995a67d0e4f.jpg` | no |
| 180 | 558 | Khadim 558 | `9a89ea4bfddd4c5dd3a8ca97.jpg` | no |
| 181 | Bibi | Ajanta Bibi | `16cefff0dbb520727acf2403.jpg` | no |
| 181 | Bibi | Ajanta Bibi | `dbe05983c03ba67b7a43fce4.jpg` | no |
| 182 | Sona-2 | Stout Sona-2 | `7e3a7e3e25e52c13c1547cca.jpg` | no |
| 183 | 800 | Khadim 800 | `9f6c5eebd9150592f00558b0.jpg` | no |
| 184 | 343 | Khadim 343 | `ff0907b6ddfd08024e191a51.jpg` | no |
| 185 | 158 | Khadim 158 | `f69a6726550e2864a1ab8847.jpg` | no |
| 186 | 308 | Khadim 308 | `b4700f05ea40e51142ee869d.jpg` | no |
| 187 | Candy | Xpert Candy | `74f2e8d01675edee5a353031.jpg` | no |
| 189 | 0576600 | Khadim 0576600 | `2390e42319f1e9a69e4448f2.jpg` | no |
| 190 | PC.RACER | Picaaso PC.RACER | `909ed4ad907e430b2761b3a3.jpg` | no |
| 191 | CROCS | Cool Walk CROCS | `cbff05b156c644d403492b8e.jpg` | no |
| 192 | 464 | Ajanta 464 | `9b2029ca87d6a4fba8564eac.jpg` | no |
| 193 | FAB01 | NBF FAB01 | `b6a0a21d04217f04c04ce2aa.jpg` | no |
| 194 | ROZY017 | TITAS ROZY017 | `68ce3a627ae022ea6a6c2fbc.jpg` | no |
| 195 | 1250 | Ashoka 1250 | `df6705d9f0cda967ee6d2700.jpg` | no |
| 196 | 1702 | Uttam 1702 | `78bcba6be36cf5d51f14d3be.jpg` | no |
| 197 | TATTU155 | Khadim TATTU155 | `bb37782020743befa16b33e3.jpg` | no |
| 198 | 067 | Khadim 067 | `0793a26274646e7ea58f30a8.jpg` | no |
| 199 | 1252 | Ashoka 1252 | `bebff999aec9d8cef8c4849f.jpg` | no |
| 200 | BETA | Ajanta BETA | `b6e18a7953583465104c41ca.jpg` | no |
| 201 | Vip shoe | Airson Vip shoe | `dc734b3a3b4e81e3aa090f8a.jpg` | no |
| 202 | 223 | Ajanta 223 | `7c2e9d294e3fbc4cc4c75935.jpg` | no |
| 203 | Crozi 1017 | LEHAR Crozi 1017 | `9c7e50fb30a5f98a8f9767bf.jpg` | no |
| 204 | 0137 | Khadim 0137 | `baad9db95167518bcb32120b.jpg` | no |
| 210 | Maya 15 | Uttam Maya 15 | `041693ffdce05812316e6bc6.jpg` | no |
| 211 | Jasmin 5 | MLQ Jasmin 5 | `46a0dfcaeb58b5dc76a538c9.jpg` | no |
| 212 | Sahine-1 | MLQ Sahine-1 | `bad81f8ae929391804a276ee.jpg` | no |
| 213 | Athlete-8 | Airson Athlete-8 | `d90a04c8881fe136e661a485.jpg` | no |
| 214 | Fashion 21 | Xpert Fashion 21 | `5bee7f4c5dbe45c934ccecc2.jpg` | no |
| 215 | 6280 | Bata 6280 | `93bfdec8067a1c5afc975a90.jpg` | no |
| 216 | 1104 | Khadim 1104 | `cb15c6ddad41c3aeac53e6cf.jpg` | no |
| 217 | 6281 | Bata 6281 | `01d61ebd1dce13293798dbe7.jpg` | no |
| 218 | 6292 | Bata 6292 | `254c443b0db1c27437b45278.jpg` | no |
| 219 | 9208 | Paragon 9208 | `8be51b64b6dd2f000703806c.jpg` | no |
| 220 | 4913 | Bata 4913 | `7f44e85352ef286190e6a639.jpg` | no |
| 221 | 6180 | Bata 6180 | `bfff0c55188923247c219401.jpg` | no |
| 222 | Soft 6 | Airson Soft 6 | `7ca7a0d03da10db40bab7b71.jpg` | no |
| 223 | Sneaker | Airson Sneaker | `5a997e9ea19e1bdaeba6173b.jpg` | no |
| 224 | Zoy3 | Xpert Zoy3 | `cdacd2d352d355cde9de5907.jpg` | no |
| 225 | PAR-345 | Aqualite PAR-345 | `45944fecdf8d9ca85df7e936.png` | no |

## CSV-recoverable records (5)

These products have exactly one HTTPS `image_url` in `Book-1.csv` for their SKU, and the target URLs returned HTTP 200.

| Product ID | SKU | Replacement URL |
|---:|---|---|
| 73 | MX-1 | https://cnvybzjxgkxtuzugywqh.supabase.co/storage/v1/object/public/product-images/1789843339199-mtuzk0.jpg |
| 136 | W172 | https://cnvybzjxgkxtuzugywqh.supabase.co/storage/v1/object/public/product-images/1790136993226-i8h4a0.jpg |
| 151 | Cutie -3 | https://cnvybzjxgkxtuzugywqh.supabase.co/storage/v1/object/public/product-images/1790842925611-e714z8.jpg |
| 154 | 906 | https://cnvybzjxgkxtuzugywqh.supabase.co/storage/v1/object/public/product-images/1790843254219-s4np99.jpg |
| 157 | 2875 | https://cnvybzjxgkxtuzugywqh.supabase.co/storage/v1/object/public/product-images/1790845212000-xs0ev2.jpg |

## Products with no image at all (7)

These had no `p.image` even before the local-file filter. They need a genuine product photo; no safe automated substitution exists.

| Product ID | SKU | Name |
|---:|---|---|
| 162 | Mogli. 01 | Uttam Mogli. 01 |
| 163 | BLK.05 | Uttam BLK.05 |
| 205 | LTQ.14 | Airson LTQ.14 |
| 206 | ARBOSS | Airson ARBOSS |
| 207 | ROCKY | Airson ROCKY |
| 208 | 0057 | Khadim 0057 |
| 209 | AS. 2328 | All SKY AS. 2328 |

## ID 199 verification

- Configured Supabase database: product `199` is `Khadim's 201` (SKU `201`), with `product_images.id=359` pointing at `https://cnvybzjxgkxtuzugywqh.supabase.co/storage/v1/object/public/product-images/1790845382341-hasx7y.jpg`. Both `/api/products?q=201` and `/api/products/khadims-201` return that URL in `image` and `images`.
- Live API: `?q=201` returns product ID `158` with the same image URL, while live product ID `199` is `Ashoka 1252` (SKU `1252`) with `image: null` and `images: []`.
- This proves the image hydration query is working. The live Render service is reading a **different database snapshot** from the Supabase database currently configured locally, so IDs do not line up.

## Notes

- The workspace `.env` database has 149 `product_images` rows and 159 products, while the live API has 176 products. The deployed Render service is therefore not using the same database as the workspace `.env` (or the data changed after that snapshot). Verify Render's `DATABASE_URL` before running repairs.
- No product, stock, price or business row was deleted or changed by the diagnostic.
- No replacement images were invented or substituted.
- No secrets, environment files or service-role keys are included in this report.

## Diagnostic commands

```bash
# Check the configured database
npm --prefix server run diagnose-images -- --transform --json server/data/image-report-db.json

# Check exactly what the deployed API sends to the frontend
npm --prefix server run diagnose-images -- \
  --api-base https://react-pro-front-1.onrender.com \
  --timeout 60000 --json server/data/image-report-live.json

# Attempt safe repairs (dry run first)
npm --prefix server run repair-images -- --csv ../Book-1.csv
npm --prefix server run repair-images -- --csv ../Book-1.csv --apply
```
