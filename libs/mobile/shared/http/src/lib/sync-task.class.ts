export class SyncTask<T extends { id: number; }> {
  constructor(
    public url: string,
    public body: T,
    public params?: string) { }
}
