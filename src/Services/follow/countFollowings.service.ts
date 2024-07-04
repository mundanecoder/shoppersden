import Follow from "../../Models/FollowModel";

export async function countFollowings(
  userId: string,
  entityType: "user" | "shop"
): Promise<number> {
  return await Follow.countDocuments({
    followerId: userId,
    followType: entityType,
  });
}
