# Kaba Fence

Public marketing website for **Kaba Fence** — fence and deck repair/install serving Angier, Raleigh NC, and surrounding areas.

Built with **Next.js (App Router)** and **Tailwind CSS**.

## Getting started

```bash
cd kaba-fence
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run build`   | Production build         |
| `npm run start`   | Serve the production build |
| `npm run lint`    | Run ESLint               |

## Pages

| Route       | Purpose                                      |
| ----------- | -------------------------------------------- |
| `/`         | Home — hero, trust strip, services, CTA      |
| `/services` | Fencing types and deck services              |
| `/gallery`  | Filterable project gallery (placeholders)    |
| `/quote`    | Contact / free quote form (client-validated) |

## Configuration

Business details live in `src/lib/site.ts`:

- Company name, tagline, description
- Service area
- Phone, email (placeholders)
- Hours
- Service and gallery content

Update those values before handing off to a client.

## Notes

- Quote form uses **client-side validation only** and shows a success state on submit — no backend yet.
- Gallery uses solid-color placeholder cards; swap in real project photos when available.
