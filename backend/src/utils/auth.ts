import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash un mot de passe en clair à l'aide de bcryptjs.
 * @param password Le mot de passe en clair.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare un mot de passe en clair avec un mot de passe haché.
 * @param password Le mot de passe en clair.
 * @param hash Le mot de passe haché stocké en base de données.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
