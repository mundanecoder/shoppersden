import Follow from "../../models/FollowModel";

export async function mutualFollowers(
  userId1: string,
  userId2: string
): Promise<{ success: boolean; mutualFollowers?: string[]; message?: string }> {
  try {
    const followersOfUser1 = await Follow.find({
      followingId: userId1,
      followType: "user",
    }).select("followerId");
    const followersOfUser2 = await Follow.find({
      followingId: userId2,
      followType: "user",
    }).select("followerId");

    const mutualFollowers = followersOfUser1
      .filter((follower1) =>
        followersOfUser2.some(
          (follower2) => follower2.followerId === follower1.followerId
        )
      )
      .map((follower) => follower.followerId);

    return { success: true, mutualFollowers };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while finding mutual followers.",
    };
  }
}
