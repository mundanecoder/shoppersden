import UserDB, { IUserDocument } from "../../models/UserModel";

export async function getUserInfo(identifier: {
  email?: string;
  clerkId?: string;
}): Promise<{ success: boolean; message: string; user?: IUserDocument }> {
  try {
    let user: IUserDocument | null = null;

    if (identifier.email) {
      user = await UserDB.findOne({ email: identifier.email });
    } else if (identifier.clerkId) {
      user = await UserDB.findOne({ clerkId: identifier.clerkId });
    } else {
      return { success: false, message: "No valid identifier provided" };
    }

    if (user) {
      return { success: true, message: "User found", user };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error retrieving user info:", error);

    return {
      success: false,
      message: "An error occurred while retrieving the user info",
    };
  }
}
