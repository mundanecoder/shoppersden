import Hashtag, { IHashtagDocument } from "../../Models/HashtagModel";

// Fetch hashtags from the database and sort by hit counts
export async function listHashtagsService(search?: string) {
  try {
    const query: { label?: { $regex: string; $options: string } } = {};

    if (search) {
      query.label = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    const hashtags = await Hashtag.find(query)
      .sort({
        hitCountDay: -1,
        hitCountWeek: -1,
        hitCountMonth: -1,
        createdAt: -1,
      }) // Sort by hit counts and creation date
      .limit(10) // Limit to top 10
      .exec();

    return {
      success: true,
      data: hashtags,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch hashtags",
    };
  }
}
