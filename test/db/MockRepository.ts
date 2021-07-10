/**
 * A mock TypeORM repository for use in e2e tests. Maintains state like an actual database.
 */
export class MockRepository<
  T extends { id: number },
  K extends Omit<T, 'id'> = Omit<T, 'id'>,
> {
  private data: T[];
  private readonly dataCompleter: (partial: Partial<K>) => K;

  /**
   * Initializes a mock repository.
   * @param initialData initial entries into the table
   * @param dataCompleter function that completes partial entries by specifying default values
   * for optional fields
   */
  constructor(
    initialData: K[] = [],
    dataCompleter: (partial: Partial<K>) => K = (v: K) => v,
  ) {
    this.data = initialData.map((d, i) => {
      return {
        id: i + 1,
        ...d,
      } as unknown as T;
    });
    this.dataCompleter = dataCompleter;
  }

  private addWithId(doc: K): T {
    const getNextId = (): number => {
      if (this.data.length === 0) return 1;
      else return Math.max(...this.data.map((d) => d.id));
    };
    return {
      id: getNextId(),
      ...doc,
    } as unknown as T;
  }

  findOne(conditions: Partial<T>): T | undefined {
    return this.data.find((d) => {
      return Object.entries(conditions).every(([k, v]) => {
        return d[k] === v;
      });
    });
  }

  findOneOrFail(conditions: Partial<T>): T {
    const value = this.findOne(conditions);
    if (!value) throw new Error();
    return value;
  }

  create(doc: Partial<K>): T {
    return this.addWithId(this.dataCompleter(doc));
  }

  save(doc: T) {
    this.data.push(doc);
    return doc;
  }
}
