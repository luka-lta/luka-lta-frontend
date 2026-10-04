# Portfolio auf die Projekt-API umstellen (Teil 3 von 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das öffentliche Portfolio liest seine Projekte aus der API statt aus `src/lib/projects-data.ts`, und der Hardcode verschwindet. Danach erscheint ein im Dashboard angelegtes Projekt ohne Code-Änderung und ohne Deploy auf der Seite.

**Architecture:** Zwei öffentliche, unauthentifizierte Endpunkte (`GET /projects`, `GET /projects/{slug}`), abgefragt per TanStack Query nach dem Muster, das `src/api/github/` hier bereits verwendet: eine `endpoints`-Datei mit `fetch` und eine `hooks`-Datei mit `useQuery`. Zod validiert die Response.

**Tech Stack:** React, Vite, `@tanstack/react-query` ^5.90.12 und `zod` ^3.25.76 — beide bereits vorhanden, **keine neuen Dependencies**. `QueryClientProvider` steht bereits in `src/App.tsx:30`.

**Spec:** `../luka-lta-api/docs/plans/2026-10-03-centralized-project-management.md` (Abschnitte 14, 25, 26, 27)

**Vorarbeit:** Teil 1 (API) und Teil 2 (Dashboard) sind umgesetzt und in Produktion live.

## Global Constraints

- TypeScript strict. `npx tsc -b` muss fehlerfrei bleiben, `npm run build` muss durchlaufen.
- 4 Spaces Einrückung — **dieses Repo weicht vom Dashboard ab**, dem Bestand der jeweiligen Datei folgen.
- Keine neuen Dependencies.
- Die öffentlichen Projekt-Endpunkte brauchen **keinen** API-Key. Nicht über `FetchWrapper` gehen (der schickt `X-Api-Key` mit), sondern direkt per `fetch` wie `src/api/github/endpoints/stats.ts`.
- Response-Form der API: `{status, message, data:{…}}` — geparst wird nur `data`.
- **Keine Test-Infrastruktur** in diesem Repo. Verifikation = `tsc`, `npm run build` und echte Browser-Nutzung.

## Die Feldnamen ändern sich — vollständige Zuordnung

Der Hardcode und die API benennen dieselben Dinge unterschiedlich. Jede Umstellung unten muss diese Tabelle anwenden:

| bisher (`projects-data.ts`) | neu (API) | Anmerkung |
|---|---|---|
| `id` | `slug` | Wert identisch — die Migration hat die alten `id`-Werte als Slugs übernommen, bestehende `/project/:id`-Links funktionieren weiter |
| `title` | `name` | |
| `description` | `shortDescription` | nullable |
| `longDescription` | `description` | nullable |
| `techStack` | `techStack` | unverändert |
| `screenshots: string[]` | `screenshots: {id,url,alt,sortOrder}[]` | **Objekte statt Pfade** |
| — | `cover`, `logo` | neu, nullable, je `{id,url,alt,sortOrder}` |
| `liveUrl` | `websiteUrl` | nullable |
| `repoUrl` | `repositoryUrl` | nullable |
| `repoOwner` | `repositoryOwner` | nullable |
| `repoName` | `repositoryName` | nullable |
| `role` | `role` | nullable |
| `year: string` | `year: number` | **Typ ändert sich** |
| `liveLabel` | `liveLabel` | nullable |
| `clientProject` | `isClientProject` | jetzt immer gesetzt, nicht optional |

Bilder kommen nicht mehr aus `/static/images/projects/…`, sondern als absolute Proxy-URLs der API.

## Review Focus

1. **Bildquelle.** Die Landing-Karte nutzte `screenshots[0]`. Die API liefert zusätzlich `cover`. Welches Bild gezeigt wird, muss bewusst entschieden und für alle Projekte sinnvoll sein — auch für solche ohne Cover. (Task 2)
2. **Ladezustand auf der Startseite.** Bisher war die Liste ein statisches Array, es gab nie einen Ladezustand. Jetzt gibt es einen, und er darf das Layout nicht springen lassen. (Task 2)
3. **Unbekannter Slug.** `projects.find(...)` ergab `undefined` und die Seite behandelte das. Jetzt ist es ein 404 der API und muss zum selben Ergebnis führen. (Task 3)
4. **Leere Liste.** Wenn die API keine Projekte liefert, darf die Startseite keinen leeren Abschnitt mit „0 Projekte" zeigen. (Task 2)
5. **GitHub-Statistiken.** `useGithubStats(repoOwner, repoName)` muss weiter funktionieren — die Felder heißen jetzt anders. (Task 3)

---

### Task 1: API-Layer

**Files:**
- Create: `src/api/projects/schema.ts`
- Create: `src/api/projects/endpoints/projects.ts`
- Create: `src/api/projects/hooks/useProjects.ts`

Verzeichnisstruktur nach dem Vorbild von `src/api/github/` (`endpoints/`, `hooks/`), nicht nach dem Dashboard.

- [ ] **Step 1: `schema.ts`**

```ts
import { z } from "zod";

export const projectAssetSchema = z.object({
    id: z.string(),
    type: z.enum(["logo", "cover", "screenshot"]),
    url: z.string(),
    alt: z.string().nullable(),
    sortOrder: z.number(),
});

export const projectTagSchema = z.object({
    tagId: z.number(),
    name: z.string(),
    slug: z.string(),
});

export const projectSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    shortDescription: z.string().nullable(),
    description: z.string().nullable(),
    status: z.enum(["development", "beta", "active", "paused", "archived"]),
    isVisible: z.boolean(),
    category: z.string().nullable(),
    tags: z.array(projectTagSchema),
    techStack: z.array(z.string()),
    websiteUrl: z.string().nullable(),
    liveLabel: z.string().nullable(),
    repositoryUrl: z.string().nullable(),
    repositoryOwner: z.string().nullable(),
    repositoryName: z.string().nullable(),
    demoUrl: z.string().nullable(),
    documentationUrl: z.string().nullable(),
    role: z.string().nullable(),
    year: z.number().nullable(),
    isClientProject: z.boolean(),
    sortOrder: z.number(),
    logo: projectAssetSchema.nullable(),
    cover: projectAssetSchema.nullable(),
    screenshots: z.array(projectAssetSchema),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
});

export const projectListSchema = z.object({ projects: z.array(projectSchema) });
export const projectResultSchema = z.object({ project: projectSchema });

export type Project = z.infer<typeof projectSchema>;
export type ProjectAsset = z.infer<typeof projectAssetSchema>;
```

- [ ] **Step 2: `endpoints/projects.ts`**

Bewusst `fetch` statt `FetchWrapper`: die Endpunkte sind öffentlich und brauchen keinen `X-Api-Key`.

```ts
import { projectListSchema, projectResultSchema, type Project } from "@/api/projects/schema.ts";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects`);

    if (!response.ok) {
        throw new Error(`Projects API error: ${response.status} ${response.statusText}`);
    }

    const body = await response.json();

    return projectListSchema.parse(body.data).projects;
}

export async function fetchProject(slug: string): Promise<Project | null> {
    const response = await fetch(`${API_URL}/projects/${slug}`);

    // Ein unbekannter oder unsichtbarer Slug ist kein Fehler, sondern "nicht da" —
    // die Detailseite zeigt dafuer ihren eigenen Nicht-gefunden-Zustand.
    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Project API error: ${response.status} ${response.statusText}`);
    }

    const body = await response.json();

    return projectResultSchema.parse(body.data).project;
}
```

- [ ] **Step 3: `hooks/useProjects.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import { fetchProject, fetchProjects } from "@/api/projects/endpoints/projects.ts";

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
        staleTime: 60_000,
    });
}

export function useProject(slug: string | undefined) {
    return useQuery({
        queryKey: ["projects", slug],
        queryFn: () => fetchProject(slug!),
        enabled: !!slug,
        staleTime: 60_000,
    });
}
```

- [ ] **Step 4: Verifizieren**

```bash
npx tsc -b
```

Und gegen die **Produktions**-API prüfen, dass das Schema zur echten Response passt:
```bash
curl -s https://api.luka-lta.dev/api/v1/projects | jq '.data.projects[0] | keys'
```
Jeden Schlüssel gegen `projectSchema` abgleichen. Fehlt ein nicht-optionales Feld, wirft Zod zur Laufzeit.

- [ ] **Step 5: Commit**

---

### Task 2: Startseiten-Liste umstellen

**Files:** Modify `src/components/Landing/Projects.tsx`

Die Komponente liest heute `import { projects, type Project } from "@/lib/projects-data"` und macht `const [featured, ...rest] = projects`. Das wird zu `useProjects()`. Der Hardcode-Import verschwindet hier, die Datei selbst bleibt bis Task 5 bestehen.

**Anzuwenden:** die Feldtabelle oben. Besonders `project.id` → `project.slug` (auch im `track()`-Aufruf und im Link), `project.title` → `project.name`, `project.description` → `project.shortDescription`, `project.clientProject` → `project.isClientProject`.

**Bildquelle (Review Focus 1):** bisher `screenshots[0]`. Neu soll gelten: `project.cover?.url ?? project.screenshots[0]?.url ?? null`, und wenn nichts da ist, der vorhandene Platzhalter-Hintergrund statt eines kaputten Bildes. Begründung: Cover ist das Bild, das für diese Darstellung gedacht ist; der Screenshot ist der Rückfall für Projekte, die noch kein Cover haben.

**Ladezustand (Review Focus 2):** Skeleton-Karten in derselben Rasterform wie die echten, damit das Layout nicht springt — eine große für das Featured-Projekt, zwei kleine darunter.

**Leere Liste (Review Focus 4):** Liefert die API keine Projekte, wird der ganze `#projects`-Abschnitt **nicht gerendert**. Eine Überschrift „0 Projekte" über einer leeren Fläche ist schlechter als gar kein Abschnitt. Auch die Zählzeile (`{projects.length} Projekte — …`) muss die echte Anzahl verwenden.

**Fehlerfall:** Die Startseite darf nicht weiß werden. Bei einem Fehler denselben Weg gehen wie bei der leeren Liste — Abschnitt auslassen — und den Fehler nicht prominent ausstellen; es ist eine Marketing-Seite, kein Dashboard.

- [ ] **Step 1: Umstellen**
- [ ] **Step 2: `npx tsc -b` und `npm run build`**
- [ ] **Step 3: Im Browser prüfen** — Dev-Server starten, Startseite laden. Featured-Projekt groß, zwei kleine, „Alle anzeigen" funktioniert, Bilder laden aus der API, Klick führt auf die Detailseite.
- [ ] **Step 4: Commit**

---

### Task 3: Detailseite umstellen

**Files:** Modify `src/feature/project/index.tsx`

Heute: `const project = projects.find((p) => p.id === projectId)`. Neu: `useProject(projectId)`.

**Feldtabelle anwenden**, insbesondere `longDescription` → `description`, `liveUrl` → `websiteUrl`, `liveLabel`, und `screenshots` als Objekte (`screenshot.url`, `screenshot.alt`).

**GitHub-Statistiken (Review Focus 5):** `useGithubStats(project.repoOwner, project.repoName)` wird zu `useGithubStats(project.repositoryOwner ?? "", project.repositoryName ?? "")`. Der Hook hat bereits `enabled: !!owner && !!repo`, läuft also bei fehlenden Werten gar nicht erst — das Verhalten bleibt damit identisch.

**Unbekannter Slug (Review Focus 3):** `fetchProject` gibt bei 404 `null` zurück. Das muss zum selben Ergebnis führen wie bisher `find(...) === undefined`. Den bestehenden Zweig dafür beibehalten, nicht neu erfinden.

**Ladezustand:** Die Seite wird direkt per URL aufgerufen, es gibt also einen echten ersten Ladevorgang. Ein schlichter Platzhalter genügt, aber kein Flackern von „nicht gefunden" bevor die Daten da sind — der Nicht-gefunden-Zweig darf erst greifen, wenn der Query **fertig** ist.

- [ ] **Step 1: Umstellen**
- [ ] **Step 2: `npx tsc -b` und `npm run build`**
- [ ] **Step 3: Im Browser prüfen** — eine Detailseite über die Startseite öffnen, eine direkt per URL laden, einen erfundenen Slug aufrufen (Nicht-gefunden-Zustand, kein Absturz), und bei einem Projekt mit Repository die GitHub-Zahlen prüfen.
- [ ] **Step 4: Commit**

---

### Task 4: Produktionsdaten herstellen — Gate vor Task 5

**Dieser Task schreibt keinen Code.** Er stellt sicher, dass die Umstellung die Seite nicht leert.

**Das Problem:** Die Produktions-API kennt derzeit nur `trackspire`. Die sechs Altprojekte liegen bisher nur in der Entwicklungsdatenbank. Würde Task 5 den Hardcode entfernen, während Produktion ein Projekt kennt, zeigt die Live-Seite ab dem Deploy **ein** Projekt statt sieben.

- [ ] **Step 1: Ist-Stand feststellen**

```bash
curl -s https://api.luka-lta.dev/api/v1/projects | jq -r '.data.projects[] | .slug'
```

- [ ] **Step 2: Die fehlenden Projekte in Produktion anlegen**

Zwei Wege, der Projektinhaber entscheidet:
- Über das live stehende Dashboard (https://backend.luka-lta.dev) — hat den Vorteil, dass Zuschnitt und Kompression beim Upload direkt greifen.
- Oder `projects:import-legacy` gegen Produktion, wofür die Bilddateien dort erreichbar sein müssen.

Die Slugs **müssen** exakt den alten `id`-Werten entsprechen, sonst brechen bestehende Links:
```bash
grep -oE 'id: "[^"]+"' src/lib/projects-data.ts | cut -d'"' -f2
```

- [ ] **Step 3: Vollständigkeit belegen**

Jeder alte Slug muss in Produktion auflösen:
```bash
for s in $(grep -oE 'id: "[^"]+"' src/lib/projects-data.ts | cut -d'"' -f2); do
  printf '%s -> ' "$s"
  curl -s -o /dev/null -w '%{http_code}\n' "https://api.luka-lta.dev/api/v1/projects/$s"
done
```
**Alle müssen 200 liefern.** Erst dann darf Task 5 laufen.

---

### Task 5: Hardcode entfernen

**Files:**
- Delete: `src/lib/projects-data.ts`
- Delete: `public/static/images/projects/` (alle Dateien)

Erst ausführen, wenn Task 4 Schritt 3 für **jeden** Slug 200 geliefert hat.

- [ ] **Step 1: Prüfen, dass nichts mehr darauf zeigt**

```bash
grep -rn "projects-data" src/ || echo "keine Referenzen mehr"
grep -rn "/static/images/projects" src/ || echo "keine Bildpfade mehr"
```
Beide müssen leer sein. Findet sich noch etwas, gehört es zu Task 2 oder 3 und wird dort behoben.

- [ ] **Step 2: Löschen**

- [ ] **Step 3: `npx tsc -b` und `npm run build`** — beide müssen sauber bleiben; ein übersehener Import fällt hier auf.

- [ ] **Step 4: Abschluss im Browser**

Startseite und mindestens zwei Detailseiten, mit leerem Cache. Alle Bilder laden, alle Links funktionieren, die Konsole bleibt frei von Fehlern.

- [ ] **Step 5: Commit**

---

## Abschluss

Danach gilt: Ein im Dashboard angelegtes Projekt erscheint ohne Code-Änderung, ohne Build und ohne Deploy auf dem Portfolio — genau das Ziel aus der ursprünglichen Anforderung.
