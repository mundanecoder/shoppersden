import Follow from "../../Models/FollowModel";

export async function getFollowings(
  userId: string,
  entityType: "user" | "shop"
) {
    return await Follow.find({ followerId: userId, followType: entityType }).select('followingId');
}