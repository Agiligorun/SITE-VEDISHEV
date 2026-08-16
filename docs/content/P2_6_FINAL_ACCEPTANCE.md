# P2.6 Final Acceptance

Date: 2026-08-16

Production:
- https://vedishev.ru
- https://vedishev.ru/admin

Backup before cleanup:
- `/var/backups/vedishev/20260816T195710`

Evidence:
- Final desktop homepage screenshot: [P2_6_HOME_DESKTOP.png](./P2_6_HOME_DESKTOP.png)

## Before Counts

Source: [P2_6_CONTENT_INVENTORY.md](./P2_6_CONTENT_INVENTORY.md)

| Collection | Total | LEGACY_IMPORTED | REAL_MANUAL | BOOTSTRAP_DEMO | UNKNOWN |
| --- | ---: | ---: | ---: | ---: | ---: |
| PracticeAreas | 16 | 8 | 0 | 8 | 0 |
| Services | 4 | 4 | 0 | 0 | 0 |
| Posts | 8 | 3 | 1 | 4 | 0 |
| Publications | 27 | 6 | 0 | 3 | 18 |
| Books | 29 | 9 | 0 | 0 | 20 |
| Cases | 4 | 4 | 0 | 0 | 0 |
| Videos | 2 | 2 | 0 | 0 | 0 |
| Media | 3 | 2 | 1 | 0 | 0 |

## After Counts

Current production state after cleanup, acceptance, and test-record removal:

| Collection | Total |
| --- | ---: |
| PracticeAreas | 8 |
| Services | 4 |
| Posts | 3 |
| Publications | 24 |
| Books | 29 |
| Cases | 4 |
| Videos | 2 |
| Media | 2 |

## Published / Draft

| Collection | Published | Draft |
| --- | ---: | ---: |
| PracticeAreas | 8 | 0 |
| Services | 4 | 0 |
| Posts | 3 | 0 |
| Publications | 4 | 20 |
| Books | 28 | 1 |
| Cases | 0 | 4 |
| Videos | 0 | 2 |

## Removed Bootstrap Records

Removed as proven bootstrap/demo or smoke artifacts:

- PracticeAreas: `criminal-law`, `civil-disputes`, `arbitration`, `housing-disputes`, `international-cases`, `inheritance-law`, `family-law`, `administrative-cases`
- Posts: `article-legal-risk`, `article-case-strategy`, `article-process`, `article-consultation`
- Publications: `publication-1`, `publication-2`, `publication-3`
- Manual smoke artifacts: `smoke-20260816083117`, `smoke-20260816083117.png`
- Acceptance leftovers removed after testing: draft `post 9`, temporary `p26-*` posts/publication/media, temporary consultation requests

## Kept Real Records

Preserved:

- 8 real imported practice areas used on the homepage
- 4 imported services
- 3 real imported published articles on the homepage
- 24 imported publications, including the currently featured verified homepage publication
- 29 books/monographs imported from legacy sources
- 4 legacy cases kept out of homepage presentation
- 2 legacy videos kept out of homepage presentation
- 2 production media assets used by the real design/content setup

## Unknown Records

Not deleted in P2.6:

- 18 `publications` records classified as `UNKNOWN`
- 20 `books` records classified as `UNKNOWN`

Reason:
- These records carry legacy provenance but still look like parser fragments or broken bibliography splits.
- They were intentionally left in place to avoid destructive loss of potentially recoverable real source material.

## Homepage Verification

Verified on production homepage:

- Hero uses real CMS data for `Николай Павлович Ведищев`
- Placeholder contact values are absent
- Practice grid uses the 8 real imported practice areas
- Homepage publications show only published data
- Homepage books show published data
- Homepage articles show real imported materials
- Cases and videos are not presented on the homepage as verified public case studies

Confirmed absent from public homepage HTML:

- `+7 (000) 000-00-00`
- `hello@vedishev.ru`
- `Адрес будет подтвержден`
- `Dashboard`
- `New Page`
- `Logout`
- `Payload Website Template`

## Admin Tests

Completed through production Payload / authenticated admin flow:

- Existing admin email identified from production DB
- Admin password reset via the official Payload forgot-password flow because the original password was not available in repo/local context
- Test image uploaded to `Media` and then deleted
- Test `Post` created as draft, previewed through authenticated `/next/preview`, published, verified on public URL, then deleted
- Test `Publication` draft created and then deleted
- Empty draft accidentally created by opening `create` screen (`post 9`) was removed
- Admin endpoint remained reachable after reboot
- Admin login API still worked after reboot

Not stored in the repo:

- Admin password
- Production secrets
- `.env`
- credentials

## Public User Test

Clean browser context after deploy and after reboot:

- No visible admin toolbar
- No visible `Dashboard`
- No visible `New Page`
- No visible `Logout`
- Consultation form submitted successfully from the frontend
- Submission success UI confirmed
- Test consultation requests were verified in production storage and then deleted

Note:
- Two pre-existing consultation requests remained in production and were not modified.

## Reboot Test

After VPS reboot:

- `postgresql` autostarted: `active`
- `nginx` autostarted: `active`
- `vedishev` autostarted: `active`
- `https://vedishev.ru/` returned `200 OK`
- `https://vedishev.ru/admin` returned `200 OK`
- Payload admin login API remained functional
- Consultation form worked again after reboot

Resource snapshot after reboot:

- RAM: `552 MiB / 2.9 GiB` used, `2.4 GiB` available
- Swap: `511 MiB`, unused at check time
- Disk `/`: `6.7G / 20G` used (`36%`)

Network / exposure after reboot:

- `nginx` listens publicly on `80` and `443`
- `next start` listens only on `127.0.0.1:3000`
- `postgres` listens only on `127.0.0.1:5432`
- `ufw` allows only `22`, `80`, `443`
- External request to `147.45.211.123:3000` timed out
- External TCP/protocol check to `147.45.211.123:5432` timed out

## SSL

Verified after reboot:

- Subject: `CN=vedishev.ru`
- Issuer: `CN=YE2, O=Let's Encrypt, C=US`
- Valid from: `2026-08-16 07:29:10 GMT`
- Valid to: `2026-11-14 07:29:09 GMT`

## Visual Differences Remaining

Compared with `docs/design/home-reference.png`, production is materially aligned but still differs in these areas:

- Header: production uses the real Vedishchev identity block and omits reference contact/search elements because those contacts are not fully verified
- Hero: overall split layout is close, but the real portrait crop/background atmosphere differs from the reference studio portrait
- Trust strip: structure is similar, but production trust statements are driven by verified real credentials rather than the exact reference copy
- Practice + consultation: card grid is stable and equalized now, but real titles/descriptions create a denser rhythm than the reference placeholders
- About + Publications: production is compact and paired correctly, but only one verified publication is available for the right column, so the section reads lighter than the reference
- Articles: branded placeholder covers are used where no real covers exist, so the section is visually calmer than the reference image-led cards
- Books: real long titles create a denser typographic texture than the cleaner reference card copy
- Footer: contact column is intentionally suppressed because phone/email/address are not fully verified; this is the largest structural difference from the reference

## Remaining Work For Next Stage

- Resolve `UNKNOWN` imported bibliography fragments in `publications` and `books`
- Continue visual tightening only within the locked reference language
- Replace placeholder article covers only when real verified assets exist
- Decide whether any draft `cases` or `videos` should ever become public after verification
