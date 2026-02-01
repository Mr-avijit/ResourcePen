
/**
 * LOCAL PERSISTENCE ENGINE
 * High-fidelity simulation of an enterprise database using LocalStorage.
 */
export class MockDB {
  static async save(collection: string, data: any): Promise<void> {
    localStorage.setItem(`psp_${collection}`, JSON.stringify(data));
    return Promise.resolve();
  }

  static async load<T>(collection: string): Promise<T[] | null> {
    const data = localStorage.getItem(`psp_${collection}`);
    return data ? JSON.parse(data) : null;
  }

  static async init(collection: string, seed: any[]): Promise<void> {
    const existing = await this.load(collection);
    if (!existing) {
      await this.save(collection, seed);
    }
  }

  static async getAll<T>(collection: string): Promise<T[]> {
    return (await this.load<T>(collection)) || [];
  }

  static async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const items = await this.getAll<T>(collection);
    const newItems = [...items, item];
    await this.save(collection, newItems);
    return item;
  }

  static async update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.getAll<T>(collection);
    const idx = items.findIndex(x => x.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...updates };
    items[idx] = updated;
    await this.save(collection, items);
    return updated;
  }

  static async delete(collection: string, id: string): Promise<boolean> {
    const items = await this.getAll<any>(collection);
    const filtered = items.filter(x => x.id !== id);
    await this.save(collection, filtered);
    return true;
  }

  static clearAll(): void {
    localStorage.clear();
    window.location.reload();
  }
}
