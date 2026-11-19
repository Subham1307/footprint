"use client";

import { useState, useTransition } from "react";
import {
  attachJournalMedia,
  attachMemoryMedia,
  attachPlaceMedia,
  detachEntityMedia,
  uploadMedia,
} from "@/lib/admin/actions/media";

export type EntityMediaType = "journal" | "place" | "memory";

export type MediaItem = {
  junctionId?: string;
  mediaId: string;
  url: string;
  filename?: string;
};

type Props = {
  entityType: EntityMediaType;
  entityId: string;
  images: MediaItem[];
};

const attachFns = {
  journal: attachJournalMedia,
  place: attachPlaceMedia,
  memory: attachMemoryMedia,
};

export function EntityMediaSection({ entityType, entityId, images: initial }: Props) {
  const [images, setImages] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function attach(mediaId: string, url: string, filename: string) {
    const fd = new FormData();
    fd.set(`${entityType}_id`, entityId);
    fd.set("media_id", mediaId);
    return attachFns[entityType](fd).then(() => {
      setImages((prev) => [...prev, { mediaId, url, filename }]);
    });
  }

  return (
    <section className="surface-card space-y-4 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Photos
      </h3>
      {images.length ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((img) => (
            <li key={img.mediaId} className="group relative overflow-hidden rounded-xl border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.filename ?? ""} className="aspect-[4/3] w-full object-cover" />
              <form
                action={detachEntityMedia}
                className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100"
                onSubmit={(e) => {
                  if (!confirm("Remove this image from the entry?")) e.preventDefault();
                }}
              >
                <input type="hidden" name="entity_type" value={entityType} />
                <input type="hidden" name="entity_id" value={entityId} />
                <input type="hidden" name="media_id" value={img.mediaId} />
                <button
                  type="submit"
                  className="rounded-full bg-black/60 px-2 py-1 text-[10px] text-white"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">No images attached yet.</p>
      )}
      <label className="block text-sm">
        <span className="mb-2 block text-[var(--text-secondary)]">Upload image</span>
        <input
          type="file"
          accept="image/*"
          disabled={isPending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            startTransition(async () => {
              try {
                setMessage(null);
                const fd = new FormData();
                fd.set("file", file);
                const asset = await uploadMedia(fd);
                await attach(asset.id, asset.public_url ?? "", asset.filename ?? file.name);
                setMessage("Uploaded.");
              } catch (err) {
                setMessage(err instanceof Error ? err.message : "Upload failed");
              }
            });
          }}
        />
      </label>
      {message ? <p className="text-xs text-[var(--text-secondary)]">{message}</p> : null}
    </section>
  );
}