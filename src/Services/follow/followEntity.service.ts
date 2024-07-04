import Follow, { IFollowDocument } from "../../models/FollowModel";

export async function followEntity(
  followerId: string,
  followingId: string,
  followType: "user" | "shop"
) {
  if (followerId === followingId && followType === "user") {
    throw new Error("You cannot follow yourself.");
  }

  const existingFollow = await Follow.findOne({
    followerId,
    followingId,
    followType,
  });
  if (existingFollow) {
    return {
      success: true,
      message: `You are already following this ${followType}.`,
    };
  }

  const follow: IFollowDocument = new Follow({
    followerId,
    followingId,
    followType,
  });
  await follow.save();
  return {
    success: true,
    message: `You are now following ${followType} with id ${followingId}`,
  };
}
