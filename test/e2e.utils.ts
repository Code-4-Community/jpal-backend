import { getConnection } from 'typeorm';

export async function clearDb() {
  const entities = getConnection().entityMetadatas;

  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.targetName); // Get repository
    await repository.delete({}); // Clear each entity table's content
  }
}
