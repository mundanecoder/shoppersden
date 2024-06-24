import Follow, { IFollowDocument } from "../../Models/FollowModel";

export async function unfollowEntity(
  followerId: string,
  followingId: string,
  followType: "user" | "shop"
): Promise<{ success: boolean; message: string }> {
  const result = await Follow.findOneAndDelete({
    followerId,
    followingId,
    followType,
  });
  if (!result) {
    return {
      success: false,
      message: `You are not following ${followType} with id ${followingId}`,
    };
  }
  return {
    success: true,
    message: `You are no longer following ${followType} with id ${followingId}`,
  };
}
