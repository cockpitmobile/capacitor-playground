export class SyncTask<T extends { id: number | string }> {
  constructor(
    public url: string,
    public body: T,
    public params?: string
  ) {}
}
