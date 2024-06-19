import HashtagDB, { IHashtagDocument } from "../../Models/HashtagModel";

type HashtagType = {
    label: string;
};

export async function createHashtagService(
  hashtagData: HashtagType
): Promise<{ success: boolean; message: string }> {
  try {
    const hashtagExists = await HashtagDB.findOne({ label: hashtagData.label });

    if (hashtagExists) {
      return {
        success: false,
        message: "Hashtag already exists",
      };
    }

    const newHashtag: IHashtagDocument = new HashtagDB({ label: hashtagData.label });
    await newHashtag.save();

    return {
      success: true,
      message: "Hashtag created successfully",
    };
  } catch (error) {
    console.error("Error creating hashtag:", error);
    return {
      success: false,
      message: "An error occurred while creating the hashtag",
    };
  }
}
