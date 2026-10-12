# AYO Frontend Design System

Conventions for the public site under `src/app/(frontend)/`. Read this before adding or
restyling any frontend UI, so new sections match the ones already shipped.

**Canonical reference:** `src/app/(frontend)/concerts-events/page.tsx` and the components it
renders. When this file and the code disagree, the concerts page wins — check it first.

Pages normalised to this system: **concerts-events**, **join-ayo**, **support-us**, **home**, **my-ayo**.
Not yet normalised: about-us, contact-us, news, policies. Don't copy patterns
out of those; copy from the three above.

---

## 1. Tokens

Defined in `src/app/(frontend)/styles.css` under `@theme`:

| Token | Value | Tailwind class |
| --- | --- | --- |
| `--color-text` | `#000000` | `text-text` |
| `--color-background` | `#ffffff` | `bg-background` |
| `--color-muted` | `#B2B2B2` | `text-muted` |
| `--font-sans` | `"Inter", sans-serif` | `font-sans` |
| `--leading-body` | `1.3` | `leading-body` |
| `--text-body` | `15px` | `text-body` |
| `--text-heading` | `40px` | `text-heading` |

`--color-primary`, `--color-secondary`, `--color-accent` and `--leading-paragraph` are still
`/* PLACEHOLDER */` — don't reference them until they have values.

In practice most components write the literal value (`text-[#B2B2B2]`) rather than the token.
Match whatever the surrounding file does rather than converting on sight.

### Colours actually in use

| Hex | Role |
| --- | --- |
| `#EBEBEB` | every rule, border and divider; also empty-image placeholder fill |
| `#B2B2B2` | muted text — section sub-lines, filter labels, placeholders |
| `#2E2E2E` | body copy inside rich-text sections |
| `#000` / `#fff` | text and page ground |

Dark bands (the Join AYO stage, side-panel footers) use `text-white` on `bg-black` with
`white/NN` opacities for secondary text.

---

## 2. Page shell

```tsx
<main className="min-h-screen bg-white text-black">
  <Hero title="..." subtitle="..." backgroundImage={heroImageUrl ?? '/hero-placeholder.jpg'} />
  {/* sections */}
  <FAQSection category="<page-slug>" />
</main>
```

- `Hero` renders the page's **only** `<h1>`. Every other heading is `h2` or lower.
- `Hero` title/subtitle are currently hardcoded per page — the `hero` Payload block only
  carries `backgroundImage`. See §10.
- `FAQSection` closes most pages.

---

## 3. Section pattern

Every band of content:

```tsx
<section className="bg-white w-full">
  <div className="mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5">
    <div className="max-w-[1380px]">
      {/* content */}
    </div>
  </div>
</section>
```

**Gutters** — `mx-8 md:mx-20 lg:mx-24 xl:mx-32` (32 / 80 / 96 / 128px). This is not optional:
it's what keeps copy on one vertical line down the page. At 1440px every section's text
starts at exactly **128px**; at 390px, **32px**. Never use `max-w-7xl mx-auto`, `w-[90%]`, or
ad-hoc `px-*` for a content band.

**Vertical rhythm**

Every block sits **100px** from the next, on every page — including the gap between the
Hero and the first block. Two adjacent `py-12.5` sections give 50 + 50; a full-bleed media
break carries `my-12.5` so it gets the same 100 above **and** below. Never add spacer divs (`h-16`) or one-sided margins (`mt-10`) between
blocks — that's what makes the gap above differ from the gap below.

| Case | Class |
| --- | --- |
| Normal section | `py-12.5` |
| First section after the Hero | `pt-25 pb-12.5` |
| Full-bleed media break (quote, video, banner, spotlight) | `my-12.5` on its wrapper |

Rich-text converters drop the top margin on a block's first paragraph/list
(`first:mt-0`), so a block that opens with a paragraph rather than a heading doesn't gain an
extra 32px on top. If you need space between rich text and something above it in the same
section, put the margin on the wrapper.

**Content cap** — `max-w-[1380px]` on text-heavy sections so lines don't over-run on wide
screens. Card grids and filter rows span the full gutter width.

**Full-bleed exceptions** — media breaks (`PhotoSpotlight`, `AboutUsQuoteVid`,
`AboutUsQuoteStatic`, the Join AYO stage) sit outside the gutter and span the viewport
deliberately. They are the only things that should.

---

## 4. Type scale

| Role | Classes |
| --- | --- |
| Page title (`h1`, Hero only) | `clamp(3.5rem, 9vw, 8rem)`, `font-semibold leading-none` |
| Section heading (`h2`) | `font-semibold text-[32px] leading-[40px] md:text-[40px] md:leading-[48px]` |
| Section sub-line | `mt-4 text-[18px] leading-[22px] text-[#B2B2B2] italic` |
| Body copy | `text-[18px] leading-6.5 md:text-[20px] md:leading-7 text-[#2E2E2E]` |
| Lead paragraph (on black text) | `text-[18px] leading-[22px] text-black` |
| Table row label (`h3`) | `font-semibold text-[20px] leading-6.5 md:text-[22px] md:leading-7.5` |
| Table row content | `text-[16px] leading-5.5 md:text-[18px] md:leading-6.5 text-[#2E2E2E]` |
| Controls / pagination | `text-[15px] leading-[18px]` |
| Card title | `font-semibold text-lg` |
| Card meta / description | `text-sm` |

**Every section heading pairs with the italic muted sub-line.** A heading alone reads as
unfinished. If there's no copy for one, that's a content gap to raise, not a reason to drop
the pattern.

Headings always render as `h2` regardless of the level an editor picks in the CMS — see §9.

---

## 5. Motion

One reveal, used everywhere:

```ts
gsap.fromTo(
  els,
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0,
    duration: 0.7, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: firstEl, start: 'top 85%', toggleActions: 'play none none none' },
  },
)
```

Don't hand-roll this. Use:

- **`StaggerReveal`** (`components/StaggerReveal.tsx`) — wraps a section and staggers every
  `fadeClass` descendant. Needed when copy comes from Payload and so can't carry refs.
  ```tsx
  <StaggerReveal fadeClass="support-intro-fade">…</StaggerReveal>
  ```
  Each section uses its own fade class (`intro-fade`, `concerts-lead-fade`, `faq-fade`, …).
- **`ScrollReveal`** (`components/ScrollReveal.tsx`) — fades one element as a whole, no stagger.
- **`FAQReveal`** — thin wrapper over `StaggerReveal` with `fadeClass="faq-fade"`.

Both reveal components bail out early on `prefers-reduced-motion: reduce`, leaving content
visible. Any new animation must do the same.

**Hover motion**

| Element | Effect |
| --- | --- |
| Table row | `hover:bg-gray-50` + gsap `scale: 1.005`, 0.2s |
| Event card | card `y: -4` (0.25s), image `scale: 1.05` (0.4s) |
| Links / buttons | `transition-opacity hover:opacity-70` |

Card/grid re-renders after a filter change use a shorter re-entry (`duration: 0.3`,
`stagger: 0.05`) rather than replaying the full reveal.

---

## 6. Shared components — use these, don't rebuild

| Component | Use for |
| --- | --- |
| `InfoRowList` | **Any Payload `table` block.** Renders the bordered label / content / link rows with hover, stagger and arrow icons. Used by join-ayo and support-us. |
| `Dropdown` | Every filter select. Never use a native `<select>` — it renders OS chrome that breaks the page. |
| `Button` | Solid black call-to-action (form submit, "Follow"). Pass `href` (+ `external`) to render a link; `variant="white"` on dark grounds. |
| `StaggerReveal` / `ScrollReveal` | Scroll reveals (§5). |
| `richTextConverters` | `createIntroConverters(fadeClass)` for section rich text, `tableRowConverters` for row content. |
| `EventCard` + `EventDetailsPanel` | Concert/event cards and their side panel. |
| `OpportunityTable` + `OpportunityModal` | The denser opportunities list and its panel. |
| `FAQSection` | FAQs, by `category`. |
| `Hero` | Page hero. |
| `SponsorList` | Partner/sponsor logo grid. |

---

## 7. Interaction patterns

### Filter row

```tsx
<div className="relative z-30 flex flex-wrap items-center gap-8 mt-8 text-[15px] leading-[18px]">
  <Dropdown label="Year" value={…} options={…} onChange={…} />
  {/* …more dropdowns… */}
  <div className="lg:ml-auto flex items-center gap-2.5 border border-[#EBEBEB] px-4 py-2.5">
    {/* 15×15 magnifier svg, then: */}
    <input placeholder="Search..." className="outline-none bg-transparent placeholder:text-[#B2B2B2]" />
  </div>
</div>
<hr className="border-[#EBEBEB] mt-6" />
```

The search box takes the `lg:ml-auto` slot at the right end. Dropdown labels are `#B2B2B2`,
values are `font-semibold text-black`.

### Pagination

Closes every paginated list, `mt-12`:

```tsx
<div className="flex items-center justify-between mt-12 text-[15px] leading-[18px]">
  <div className="flex gap-12">
    <button className="underline disabled:no-underline disabled:opacity-40 disabled:cursor-default cursor-pointer">Previous</button>
    <button className="…same…">Next</button>
  </div>
  <span className="font-normal">{currentPage} of {totalPages}</span>
</div>
```

Reset `currentPage` to 1 in a `useEffect` whenever a filter or search term changes.

### Card grid

`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8`, images `aspect-[4/3]` on an
`#EBEBEB` ground.

### Side panel

Right-hand drawer, identical in `EventDetailsPanel` and `OpportunityModal`:
`fixed inset-0 z-50` → backdrop `absolute inset-0 bg-black/50` → panel
`absolute top-0 right-0 h-full w-full max-w-md bg-white flex flex-col shadow-xl
transition-transform duration-300 ease-out`, with a `bg-black text-white px-6 py-4` footer bar.
`role="dialog"`, `aria-modal`, `aria-labelledby`, Escape to close, focus returned to the trigger.

---

## 8. Links, icons, images

**Links are underlined text with a trailing arrow — never filled or outlined buttons.**

```tsx
<Link href={…} className="inline-flex items-center gap-1 font-semibold text-[18px] md:text-[20px] transition-opacity hover:opacity-70">
  <span className="underline">Label</span>
  <Image src="/arrow-up-right.svg" alt="" width={20} height={20} aria-hidden="true" className="h-[1em] w-[1em]" />
</Link>
```

- Arrow is always `/arrow-up-right.svg`, never the `↗` character.
- On dark grounds add `brightness-0 invert`.
- Internal routes use `next/link`; only external ones get `target="_blank" rel="noopener noreferrer"`.

**Images always go through `next/image`.** No raw `<img>` in frontend components. Give explicit
`width`/`height` and let classes drive layout, or `fill` inside a positioned parent.

> Known rough edge: a long link label inside `InfoRowList` wraps and the `inline-flex` arrow
> detaches to the right of the wrapped block (visible on Support Us, "Download a codicil form").
> Switching that link to inline `<span className="underline">` + inline icon fixes it.

---

## 9. Payload-driven content

Page copy belongs in Payload, not in JSX. The established pattern:

```tsx
const page = await getPageBySlug('<slug>')
const richTextBlocks = page?.layout?.filter((b) => b.blockType === 'rich-text') ?? []
const introText = richTextBlocks[0]?.content
const tableBlock = page?.layout?.find((b) => b.blockType === 'table')
```

Rich-text blocks are read **positionally** (`[0]`, `[1]`, …), so block order in the CMS is
load-bearing — comment which index is which.

Render through the shared converters so CMS copy lands on the type scale:

```tsx
const introConverters = createIntroConverters('my-section-fade')
<StaggerReveal fadeClass="my-section-fade">
  <RichText data={introText} converters={introConverters} />
</StaggerReveal>
```

`createIntroConverters` forces headings to `h2` at the section scale — an editor choosing `h3`
must not change the visual size, and the page's only `h1` is the Hero's.

Guard optional content (`{introText && …}`) so deleting a block in the CMS degrades instead of
crashing.

**Still hardcoded, for reference:** Hero title/subtitle on every page (the `hero` block has no
text fields); `PhotoSpotlight` props; `AboutUsQuoteVid` poster and YouTube URL;
`UpcomingEvents`/`PreviousEvents` lead copy; `OpportunitySection`'s data array (marked TODO);
all `JoinAyoBlock` imagery (`/grey_rectangle.png` placeholders).

---

## 10. Responsive

- Breakpoints: `md` 768px, `lg` 1024px, `xl` 1280px.
- No horizontal overflow at 390px — verify `scrollWidth === clientWidth`.
- Headings step down on mobile (40 → 32px); don't ship a mobile heading under 32px.
- Scroll-jacked or viewport-pinned sections need a static fallback for small screens **and**
  `prefers-reduced-motion`. See `.join-static` in `styles.css` with the media query in
  `join-ayo/ScrollAnimation.tsx` for the worked example: it un-sticks the stage and returns
  each absolutely positioned scene to normal flow.
  - Watch out: setting an element to `position: static` lets its `absolute inset-0` children
    escape to the nearest positioned ancestor. Keep such wrappers `position: relative`.

---

## 11. Checklist for a new section

1. `<section className="bg-white w-full">` + `mx-8 md:mx-20 lg:mx-24 xl:mx-32 py-12.5`; full-bleed media gets `my-12.5`.
2. `h2` at the section scale, with the italic `#B2B2B2` sub-line under it.
3. Body at 18 → 20px in `#2E2E2E`.
4. Copy from Payload via `createIntroConverters`, not hardcoded.
5. Wrapped in `StaggerReveal` with its own fade class.
6. Reuse `InfoRowList` / `Dropdown` / `EventCard` instead of rebuilding.
7. Links underlined with the arrow icon; images through `next/image`.
8. Check 390px: no overflow, gutter 32px, heading ≥ 32px.
9. `npx tsc --noEmit` and `npx next lint` clean.
