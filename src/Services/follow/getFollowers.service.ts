import Follow from "../../models/FollowModel";

export async function getFollowers(
  entityId: string,
  entityType: "user" | "shop"
) {
  console.log("service param : ", entityId, entityType);
  const followers = await Follow.find({
    followingId: entityId,
    followType: entityType,
  }).select("followerId");
  return {
    success: true,
    message: `Followers of ${entityType} with id ${entityId}`,
    followers,
  };
}
