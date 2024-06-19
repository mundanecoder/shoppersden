import HashtagDB, { IHashtagDocument } from "../../Models/HashtagModel";

export async function listHashtagsService(): Promise<{ success: boolean; data?: IHashtagDocument[]; message?: string }> {
  try {
    const hashtags = await HashtagDB.find().exec();
    return {
      success: true,
      data: hashtags,
    };
  } catch (error) {
    console.error("Error listing hashtags:", error);
    return {
      success: false,
      message: "An error occurred while listing the hashtags",
    };
  }
}
