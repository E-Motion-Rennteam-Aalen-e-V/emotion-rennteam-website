import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/cms/collections";
import { getItem, saveItem, deleteItem, isValidSlug } from "@/lib/cms/content";
import { getSessionUser } from "@/lib/cms/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; slug: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const { collection: collectionName, slug } = await params;
  const collection = getCollection(collectionName);
  if (!collection) return NextResponse.json({ error: "Unbekannte Collection." }, { status: 404 });

  const item = await getItem(collectionName, slug);
  if (!item) return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
  return NextResponse.json({ collection, item });
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
