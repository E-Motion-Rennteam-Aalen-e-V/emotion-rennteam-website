import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/cms/collections";
import { getItem, getItemMtime, saveItem, deleteItem, isValidSlug, ValidationError } from "@/lib/cms/content";
import { getSessionUser } from "@/lib/cms/auth";

function makeETag(mtime: number): string {
  return `"${mtime.toString(16)}"`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; slug: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const { collection: collectionName, slug } = await params;
  const collection = getCollection(collectionName);
  if (!collection) return NextResponse.json({ error: "Unbekannte Collection." }, { status: 404 });

  const [item, mtime] = await Promise.all([
    getItem(collectionName, slug),
    getItemMtime(collectionName, slug),
  ]);
  if (!item) return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
  const res = NextResponse.json({ collection, item });
  if (mtime !== null) res.headers.set("ETag", makeETag(mtime));
  return res;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; slug: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const { collection: collectionName, slug } = await params;
  const collection = getCollection(collectionName);
  if (!collection) return NextResponse.json({ error: "Unbekannte Collection." }, { status: 404 });

  if (!isValidSlug(slug)) return NextResponse.json({ error: "Ungültiger Slug." }, { status: 400 });

  // Optimistic concurrency: if the client sends If-Match and the file has
  // been modified since, reject with 412 to prevent last-write-wins data loss.
  const ifMatch = request.headers.get("If-Match");
  if (ifMatch) {
    const mtime = await getItemMtime(collectionName, slug);
    if (mtime !== null && makeETag(mtime) !== ifMatch) {
      return NextResponse.json(
        { error: "Konflikt: Der Eintrag wurde zwischenzeitlich von jemand anderem geändert. Bitte die Seite neu laden." },
        { status: 412 }
      );
    }
  }

  let body: { data?: Record<string, unknown>; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const result = await saveItem(collectionName, slug, body.data ?? {}, body.body ?? "", user.username);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : "Speichern fehlgeschlagen." }, { status: 502 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; slug: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const { collection: collectionName, slug } = await params;
  const collection = getCollection(collectionName);
  if (!collection) return NextResponse.json({ error: "Unbekannte Collection." }, { status: 404 });

  if (!isValidSlug(slug)) return NextResponse.json({ error: "Ungültiger Slug." }, { status: 400 });

  try {
    const result = await deleteItem(collectionName, slug, user.username);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Löschen fehlgeschlagen." }, { status: 502 });
  }
}
