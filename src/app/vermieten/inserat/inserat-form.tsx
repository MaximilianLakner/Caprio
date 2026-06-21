"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Info, ImagePlus, X, Star } from "lucide-react";
import { createListing } from "./actions";

const BRANDS = ["Thule", "Kamei", "Hapro", "Yakima", "Atera", "Jetbag", "Andere"];
const MIN_IMAGES = 4;
const MAX_IMAGES = 7;

export function InseratForm() {
  const [state, formAction, pending] = useActionState(createListing, null);
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // object URLs for previews, cleaned up when the set changes
  const previews = useMemo(
    () => files.map((f) => ({ key: `${f.name}-${f.size}`, url: URL.createObjectURL(f) })),
    [files]
  );
  useEffect(
    () => () => previews.forEach((p) => URL.revokeObjectURL(p.url)),
    [previews]
  );

  // keep the hidden file input in sync with our state so the form submits it
  function syncInput(next: File[]) {
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    if (fileRef.current) fileRef.current.files = dt.files;
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const merged = [...files];
    for (const f of incoming) {
      if (merged.length >= MAX_IMAGES) break;
      if (!merged.some((m) => m.name === f.name && m.size === f.size)) merged.push(f);
    }
    setFiles(merged);
    syncInput(merged);
  }

  function removeFile(idx: number) {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    syncInput(next);
  }

  const tooFew = files.length < MIN_IMAGES;

  return (
    <form action={formAction} className="space-y-4">
      {/* ---------------- Fotos ---------------- */}
      <Section
        title="Fotos"
        hint={`${MIN_IMAGES}–${MAX_IMAGES} Bilder. Das erste Foto ist dein Titelbild.`}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((p, i) => (
            <div
              key={p.key}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-paper"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink/85 px-2 py-0.5 text-[10px] font-semibold text-cream">
                  <Star size={10} className="fill-cream" />
                  Titelbild
                </span>
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label="Bild entfernen"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-cream opacity-0 transition group-hover:opacity-100"
              >
                <X size={13} />
              </button>
            </div>
          ))}

          {files.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-taupe-300 bg-paper/40 text-ink-soft transition-colors hover:border-clay-500 hover:text-clay-600"
            >
              <ImagePlus size={22} />
              <span className="text-xs font-medium">Bild hinzufügen</span>
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />

        <p
          className={`mt-3 text-xs font-medium ${
            tooFew ? "text-taupe-500" : "text-clay-600"
          }`}
        >
          {files.length} / {MAX_IMAGES} ausgewählt
          {tooFew && ` · noch ${MIN_IMAGES - files.length} nötig`}
        </p>
      </Section>

      {/* ---------------- Eckdaten ---------------- */}
      <Section title="Eckdaten" hint="Das Wichtigste auf einen Blick.">
        <Field label="Titel des Inserats" hint="z. B. Thule Motion XT L – geräumig und leise">
          <TextInput name="title" placeholder="Meine Dachbox" required />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Marke">
            <select
              name="brand"
              required
              defaultValue=""
              className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none transition-colors focus:border-clay-500"
            >
              <option value="" disabled>
                Marke wählen …
              </option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stadt" hint="Abholort der Box">
            <TextInput name="city" placeholder="München" required />
          </Field>
        </div>
        <Field label="Preis pro Tag (€)">
          <NumberInput name="price_per_day" placeholder="12" min={1} max={99} required />
        </Field>
      </Section>

      {/* ---------------- Maße & Ausstattung ---------------- */}
      <Section title="Maße & Ausstattung">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Volumen (L)">
            <NumberInput name="volume" placeholder="450" min={50} max={800} required />
          </Field>
          <Field label="Länge (cm)">
            <NumberInput name="length_cm" placeholder="210" min={100} max={350} required />
          </Field>
          <Field label="Max. Zuladung (kg)">
            <NumberInput name="max_load_kg" placeholder="75" min={20} max={150} required />
          </Field>
        </div>
        <Field label="Öffnungsseite">
          <div className="flex gap-3">
            {(["einseitig", "beidseitig"] as const).map((v) => (
              <label
                key={v}
                className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-line bg-cream px-3.5 py-2.5 text-sm transition-colors has-[:checked]:border-clay-500 has-[:checked]:bg-blush-100"
              >
                <input type="radio" name="opening" value={v} required className="accent-clay-600" />
                <span className="font-medium capitalize">{v}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field
          label="Besonderheiten"
          hint="Kommagetrennt, z. B.: Beidseitige Öffnung, Schnellmontage, LED-Beleuchtung"
        >
          <TextInput name="features" placeholder="Beidseitige Öffnung, Schnellmontage" />
        </Field>
      </Section>

      {/* ---------------- Beschreibung ---------------- */}
      <Section title="Beschreibung" hint="Erzähl Mietern, was deine Box besonders macht.">
        <textarea
          name="description"
          rows={5}
          placeholder="Die Box ist in sehr gutem Zustand und öffnet auf beiden Seiten …"
          className="w-full resize-none rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none transition-colors focus:border-clay-500"
        />
      </Section>

      {/* ---------------- Submit ---------------- */}
      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <Info size={15} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-line pt-6">
        <p className="mr-auto text-xs text-ink-soft">
          Kostenlos · Gebühr nur bei erfolgreicher Vermietung
        </p>
        <button
          type="submit"
          disabled={pending || tooFew}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Loader2 size={15} className="animate-spin" />}
          Inserat veröffentlichen
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-cream p-6 sm:p-7">
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-ink-soft">{hint}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-taupe-700">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-ink-soft">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function TextInput({
  name,
  placeholder,
  required,
}: {
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type="text"
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none transition-colors focus:border-clay-500"
    />
  );
}

function NumberInput({
  name,
  placeholder,
  min,
  max,
  required,
}: {
  name: string;
  placeholder: string;
  min: number;
  max: number;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type="number"
      placeholder={placeholder}
      min={min}
      max={max}
      required={required}
      className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none transition-colors focus:border-clay-500"
    />
  );
}
