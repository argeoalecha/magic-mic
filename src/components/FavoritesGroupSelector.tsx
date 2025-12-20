import React, { useState } from 'react';
import type { FavoriteGroup } from '@/types';

interface FavoritesGroupSelectorProps {
  groups: FavoriteGroup[];
  onAddGroupToQueue: (groupName: string) => void;
  isVisible: boolean;
}

export const FavoritesGroupSelector: React.FC<FavoritesGroupSelectorProps> = ({
  groups,
  onAddGroupToQueue,
  isVisible,
}) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  if (!isVisible || groups.length === 0) return null;

  const toggleExpand = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-5 mb-6 border border-yellow-200/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-t-3xl"></div>

      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        ⭐ Quick Add from Favorites
      </h3>

      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.name}
            className="border border-yellow-200 rounded-2xl overflow-hidden bg-gradient-to-r from-yellow-50/50 to-orange-50/30"
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-800">{group.name}</h4>
                  <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
                    {group.count} song{group.count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onAddGroupToQueue(group.name)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center space-x-1"
                >
                  <span>➕</span>
                  <span>Add All to Queue</span>
                </button>

                <button
                  onClick={() => toggleExpand(group.name)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-yellow-100 rounded-lg transition-colors"
                >
                  {expandedGroup === group.name ? '▼' : '▶'}
                </button>
              </div>
            </div>

            {expandedGroup === group.name && (
              <div className="px-4 pb-4 border-t border-yellow-200 bg-white/50">
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {group.songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center space-x-3 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-12 h-9 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {song.title}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          by {song.artist}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
