import User, { IUserDocument } from "../Models/UserModel";

/**
 * Generates a username based on the user's first name and last name.
 * @param firstName First name of the user
 * @param lastName Last name of the user
 * @returns Generated username
 */
export function generateUsername(firstName: string, lastName: string): string {
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  return username;
}
