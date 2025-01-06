import { useEffect, useState } from "react";
import { useSupabase } from "./supabase";
import { TrashIcon } from "@heroicons/react/outline";
import { Trash } from "lucide-react";

export const CaptionHistory = () => {
  const [history, setHistory] = useState([]);
  const { getCaptionHistory, deleteCaption } = useSupabase();

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getCaptionHistory();
      setHistory(data);
    };
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    await deleteCaption(id); // Call the Supabase function to delete caption
    setHistory(history.filter((item) => item.id !== id)); // Update the UI
  };

  return (
    <div className="max-w-full mx-auto p-6 space-y-6">
      <h2 className="text-xl font-medium text-gray-900">Caption History</h2>

      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="group p-4 bg-white rounded-lg border border-gray-100 transition-all hover:border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </time>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                      title="Delete caption"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{item.caption}</p>
                  {item.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-2 rounded-full bg-purple-50 text-purple-600 text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No captions yet</p>
        </div>
      )}
    </div>
  );
};
