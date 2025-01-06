import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tbglqduozbabzpeeqjcg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ2xxZHVvemJhYnpwZWVxamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwOTQyNzYsImV4cCI6MjA1MTY3MDI3Nn0.Dh0kpfE_92J3IgUvrVEfwrSj-RzlGksgGes70Wv28hU"
);

export const useSupabase = () => {
  const saveCaptionHistory = async (
    caption,
    hashtags,
    generationMethod,
    category
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from("captions").insert({
        user_id: user.id,
        caption,
        hashtags,
        generation_method: generationMethod,
        category,
      });
    } catch (error) {
      console.error("Error saving caption:", error);
    }
  };

  const getCaptionHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("captions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching caption history:", error);
      return [];
    }
  };

const deleteCaption = async (id) => {
  const { error } = await supabase.from("captions").delete().eq("id", id);
  if (error) console.error(error);
};

  const toggleFavoriteHashtag = async (hashtag) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: existing } = await supabase
        .from("favorite_hashtags")
        .select("*")
        .eq("user_id", user.id)
        .eq("hashtag", hashtag)
        .single();

      if (existing) {
        await supabase.from("favorite_hashtags").delete().eq("id", existing.id);
      } else {
        await supabase
          .from("favorite_hashtags")
          .insert({ user_id: user.id, hashtag });
      }
    } catch (error) {
      console.error("Error toggling favorite hashtag:", error);
    }
  };

  const getFavoriteHashtags = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("favorite_hashtags")
        .select("hashtag")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((item) => item.hashtag);
    } catch (error) {
      console.error("Error fetching favorite hashtags:", error);
      return [];
    }
  };

  const trackAnalytics = async (generationMethod, category) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from("analytics").insert({
        user_id: user.id,
        generation_method: generationMethod,
        category,
      });
    } catch (error) {
      console.error("Error tracking analytics:", error);
    }
  };


  return {
    saveCaptionHistory,
    getCaptionHistory,
    toggleFavoriteHashtag,
    getFavoriteHashtags,
    trackAnalytics,
    deleteCaption
  };
};
