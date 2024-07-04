import Follow from "../../models/FollowModel";

export async function countFollowers(
  entityId: string,
  entityType: "user" | "shop"
): Promise<number> {
  return await Follow.countDocuments({
    followingId: entityId,
    followType: entityType,
  });
}
