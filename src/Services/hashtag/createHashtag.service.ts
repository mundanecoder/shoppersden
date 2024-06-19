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

      await HashtagDB.updateOne(
        { label: hashtagData.label },
        {
          $inc: {
            hitCountDay: 1,
            hitCountWeek: 1,
            hitCountMonth: 1
          }
        }
      );

      return {
        success: true,
        message: "Already exists..Hashtag hit counts updated!",
      };
    }

    const newHashtag: IHashtagDocument = new HashtagDB({
      label: hashtagData.label,
      hitCountDay: 0,
      hitCountWeek: 0,
      hitCountMonth: 0
    });
    await newHashtag.save();

    return {
      success: true,
      message: "Hashtag created successfully",
    };
  } catch (error) {
    console.error("Error creating/updating hashtag:", error);
    return {
      success: false,
      message: "An error occurred while creating/updating the hashtag",
    };
  }
}
