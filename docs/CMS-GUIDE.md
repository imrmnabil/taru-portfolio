# Editing your portfolio

Your site has a built-in editor. You change text and photos in a form, watch the
site update beside you as you type, and press **Save** when you're happy.

You never need to touch code.

---

## Starting the editor

Open a terminal in the project folder and run:

```bash
npm run cms
```

Your browser opens automatically at the **Studio**. If it doesn't, the terminal
prints the address — usually <http://localhost:3000/studio>.

Leave the terminal window open while you work. When you're finished, click into
it and press `Ctrl + C` to stop.

> The editor runs on your own computer. Nothing is public until you publish —
> see [Publishing your changes](#publishing-your-changes).

---

## The Studio

The screen is split in two:

| Left | Right |
| --- | --- |
| The editor — forms, buttons, image uploads | Your actual site |

Drag the grey divider to resize. The right side is the real page, so it's exactly
what visitors will see.

### The status label

At the top left, next to the word *Studio*, a short label tells you what the
preview is showing:

| Label | Meaning |
| --- | --- |
| 🟢 **Previewing unsaved edits** | You have unsaved changes and the preview is showing them |
| ⚪ **Showing saved content** | Nothing unsaved — the preview matches what's on file |
| 🟠 **Waiting for valid input…** | Something is half-typed and can't be displayed yet. Keep typing; it clears on its own |

### Typing vs. saving

The preview follows you **as you type** — you don't need to save to see how
something looks. Try a heading, look at it, change it again.

Nothing is written to the project until you press **Save**. Until then you can
navigate away and your draft is kept; Keystatic offers to restore it when you
come back.

---

## What you can edit

The left sidebar groups everything into three sections.

### Site

**Site settings** — the frame around your content.

- *Browser tab title* and *SEO description* — what search engines and browser
  tabs show
- *Sections* — every section of the page. For each one you can change the **nav
  label** (the word in the top menu), the **heading** (the title on the page),
  and untick **Show** to hide the section entirely. Drag to reorder them.
- *Homepage showcase* — how many achievements and projects appear in the sliding
  panels near the top
- *Button & sub-heading labels* — the CV button, the two showcase buttons, and a
  couple of headings
- *Formspree form ID* — where the contact form sends messages. Leave this alone
  unless you're changing Formspree accounts.

**Profile & contact** — you.

- Name, role, location
- *Hero heading* and *Hero paragraph* — the large text at the very top
- *Avatar* — your photo
- *CV* — the PDF the Download CV button links to
- Email, phone, WhatsApp, timezone (the timezone drives the live clock in the
  contact section)
- *Social links* — drag to reorder. Each needs a name, an icon, and a URL.

### Sections

**Experience**, **Education**, **Publications**, **Test scores** — each is one
screen holding a list. Use **Add** to create an entry, the drag handle to
reorder, and the menu on each row to remove one.

Dates are plain text, so write them however you like — `May 2025`, `2019`,
`Present`. Whatever you type is what appears.

### Showcase

**Achievements** and **Projects** work differently: each entry is its own page
with a rich-text description.

- The **description** box supports bold, italics, links, lists and headings
- **Achievements** take several images — the **first one** is the picture used on
  the homepage card
- **Projects** take a poster image, a list of technologies, and links

**Display order** controls the order of both lists. Drag entries to rearrange
them. The ones at the top also fill the homepage sliding panels.

> If you create a new achievement or project and forget to add it to *Display
> order*, it still appears on the site — at the end of the list.

---

## Common tasks

**Change the big text at the top**
Profile & contact → *Hero heading* / *Hero paragraph*.

**Add a job**
Experience → **Add**. Fill in the fields, drag it to the right position, Save.

**Add an achievement with photos**
Achievements → **New**. Type a title, write the description, then add images one
at a time. Drag images so the best one is first — that's the homepage card.
Add it to *Display order* to control where it sits.

**Change what shows in the homepage sliders**
Display order → drag your best items to the top. To change how many appear,
Site settings → *Homepage showcase*.

**Replace your CV**
Profile & contact → *CV* → upload the new PDF, then Save. The Download CV
button points at the new file.

**Hide a section**
Site settings → *Sections* → untick **Show**. It disappears from both the page
and the top menu.

**Rename a menu item**
Site settings → *Sections* → change *Nav label*. The *Heading* is separate, so
the menu can say "Work" while the page says "Experience".

---

## About images

Upload images through the editor — don't copy files into folders by hand. The
editor puts them in the right place and records the filename for you.

The preview shows new images immediately, and they are compressed into fast,
modern versions automatically when you publish — you don't need to do anything.

---

## Publishing your changes

Saving writes files onto your computer. It does **not** update the public site.

To publish, send your changes to GitHub:

```bash
git add .
git commit -m "Update achievements"
git push
```

That's all. GitHub rebuilds the site and puts it online by itself, usually within
a couple of minutes. You can watch it on the **Actions** tab of the repository —
a green tick means it's live.

> You never need to run a build yourself. If the tick goes red, nothing was
> published and the site carries on as it was; send the error to a developer.

---

## If something goes wrong

**The preview says "Waiting for valid input…" and won't move on**
Something is half-finished — often a list item with an empty required field.
Finish or delete it and the preview catches up.

**A new photo doesn't appear on the published site**
Give it a couple of minutes — publishing isn't instant. If it still hasn't
appeared, check the **Actions** tab for a red tick.

**The preview looks out of date**
Click **Refresh preview** at the top right.

**The address isn't the usual localhost:3000**
If something else is already using that port, the site quietly moves to the next
free one. The Studio link printed in the terminal is always the correct one.

**I made a mess and want to undo it**
Nothing is public until you build and publish. If you haven't saved, navigate
away and discard the draft. If you have already saved, the previous version is
still in Git — ask a developer to restore it.
