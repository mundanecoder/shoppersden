import UserDB, { IUserDocument } from "../../Models/UserModel";
import { UserResource } from "@clerk/types";

export async function createUser(
  userData: UserResource
): Promise<{ success: boolean; message: string }> {
  try {
    const userExist = await UserDB.findOne({
      email: userData?.emailAddresses[0].emailAddress,
    });

    console.log("here");
    const generateUsername = (): string => {
      const randomString = Math.random().toString(36).substring(2, 8);
      return `user_${randomString}`;
    };

    if (!userExist) {
      const newUser: IUserDocument = new UserDB({
        firstname: userData?.firstName,
        lastName: userData?.lastName,
        userName: generateUsername(),
        fullName: userData?.fullName,
        phoneNumbers: userData?.phoneNumbers ?? null,
        email: userData?.emailAddresses[0].emailAddress,
        clerkId: userData?.id,
      });

      await newUser.save();
      console.log("here2");

      return { success: true, message: "User created successfully" };
    } else {
      return { success: false, message: "User already exists" };
    }
  } catch (error) {
    console.error("Error creating user:", error);

    return {
      success: false,
      message: "An error occurred while creating the user",
    };
  }
}
