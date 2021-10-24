import { getConnection } from 'typeorm';

// clears the database, works with the link below:
// https://github.com/nestjs/nest/issues/409
export async function clearDb() {
  const connection = getConnection();
  await connection.synchronize(true);
}
