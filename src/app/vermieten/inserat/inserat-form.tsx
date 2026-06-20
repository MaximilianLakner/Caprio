"use client";

import { useActionState } from "react";
import { Loader2, Info } from "lucide-react";
import { createListing } from "./actions";

const BRANDS = ["Thule", "Kamei", "Hapro", "Yakima", "Atera", "Jetbag", "Andere"];

export function InseratForm() {
  const [state, formAction, pending] = useActionState(createListing, null);

  return (
    <form action={formAction} className="space-y-6">
      {/* Titel */}
      <FormGroup label="Titel des Inserats" hint="z. B. Thule Motion XT L – geräumig und leise">
        <TextInput name="title" placeholder="Meine Dachbox" required />
      </FormGroup>

      {/* Marke + Stadt */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormGroup label="Marke">
          <select
            name="brand"
            required
            className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-clay-500"
          >
            <option value="">Marke wählen …</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </FormGroup>
        <FormGroup label="Stadt" hint="Abholort der Box">
          <TextInput name="city" placeholder="München" required />
        </FormGroup>
      </div>

      {/* Preis + Volumen */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormGroup label="Preis pro Tag (€)">
          <NumberInput name="price_per_day" placeholder="12" min={1} max={99} required />
        </FormGroup>
        <FormGroup label="Volumen (Liter)">
          <NumberInput name="volume" placeholder="450" min={50} max={800} required />
        </FormGroup>
      </div>

      {/* Länge + Zuladung */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormGroup label="Länge (cm)">
          <NumberInput name="length_cm" placeholder="210" min={100} max={350} required />
        </FormGroup>
        <FormGroup label="Max. Zuladung (kg)">
          <NumberInput name="max_load_kg" placeholder="75" min={20} max={150} required />
        </FormGroup>
      </div>

      {/* Öffnung */}
      <FormGroup label="Öffnungsseite">
        <div className="mt-1 flex gap-4">
          {(["einseitig", "beidseitig"] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="opening"
                value={v}
                required
                className="accent-clay-600"
              />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
      </FormGroup>

      {/* Beschreibung */}
      <FormGroup label="Beschreibung" hint="Erzähl Mietern, was deine Box besonders macht.">
        <textarea
          name="description"
          rows={4}
          placeholder="Die Box ist in sehr gutem Zustand und öffnet auf beiden Seiten …"
          className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-clay-500 resize-none"
        />
      </FormGroup>

      {/* Features */}
      <FormGroup
        label="Besonderheiten"
        hint="Kommagetrennt, z. B.: Beidseitige Öffnung, Schnellmontage, LED-Innenbeleuchtung"
      >
        <TextInput name="features" placeholder="Beidseitige Öffnung, Schnellmontage" />
      </FormGroup>

      {state?.error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-px disabled:opacity-60"
      >
        {pending && <Loader2 size={15} className="animate-spin" />}
        Inserat veröffentlichen
      </button>
    </form>
  );
}

function FormGroup({
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
      className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-clay-500 transition-colors"
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
      className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-clay-500 transition-colors"
    />
  );
}
