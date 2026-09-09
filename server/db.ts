import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertProduct, InsertProductVault, InsertSavedScript, InsertUser, productVault, products, savedScripts, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Product Library ──────────────────────────────────────────────────────────

export async function getProductsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.userId, userId)).orderBy(desc(products.updatedAt));
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, userId: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(and(eq(products.id, id), eq(products.userId, userId)));
}

export async function deleteProduct(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(and(eq(products.id, id), eq(products.userId, userId)));
}

// ─── Saved Scripts ────────────────────────────────────────────────────────────

export async function getSavedScriptsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savedScripts).where(eq(savedScripts.userId, userId)).orderBy(desc(savedScripts.createdAt));
}

export async function saveScript(data: InsertSavedScript) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(savedScripts).values(data);
  return result;
}

export async function updateScriptNotes(id: number, userId: number, notes: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(savedScripts).set({ notes }).where(and(eq(savedScripts.id, id), eq(savedScripts.userId, userId)));
}

export async function deleteSavedScript(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(savedScripts).where(and(eq(savedScripts.id, id), eq(savedScripts.userId, userId)));
}

// ─── Product Vault ────────────────────────────────────────────────────────────

export async function getVaultItemById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(productVault).where(and(eq(productVault.id, id), eq(productVault.userId, userId))).limit(1);
  return rows[0] ?? null;
}

export async function getVaultByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productVault).where(eq(productVault.userId, userId)).orderBy(desc(productVault.createdAt));
}

export async function saveToVault(data: InsertProductVault) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(productVault).values(data);
  return result;
}

export async function updateVaultItem(id: number, userId: number, data: Partial<InsertProductVault>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(productVault).set(data).where(and(eq(productVault.id, id), eq(productVault.userId, userId)));
}

export async function deleteVaultItem(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productVault).where(and(eq(productVault.id, id), eq(productVault.userId, userId)));
}
