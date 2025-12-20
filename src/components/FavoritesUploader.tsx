import React, { useRef } from 'react';
import type { FavoritesUploadState } from '@/types';

interface FavoritesUploaderProps {
  onUpload?: (file: File) => Promise<void>;
  onReload?: () => Promise<void>;
  uploadState: FavoritesUploadState;
  onClear: () => void;
}

export const FavoritesUploader: React.FC<FavoritesUploaderProps> = ({
  onUpload,
  onReload,
  uploadState,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileSelect = async (file: File) => {
    if (onUpload) {
      await onUpload(file);
    }
  };

  const handleReload = async () => {
    if (onReload) {
      await onReload();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-5 mb-6 border border-yellow-200/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-t-3xl"></div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">⭐ Favorites</h3>
        {uploadState.totalSongs > 0 && (
          <button
            onClick={onClear}
            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded-xl transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {uploadState.totalSongs === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-700 font-medium mb-1">Loading Favorites...</p>
          <p className="text-sm text-gray-500">
            Favorites will be loaded from song_hits folder
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Add Excel/CSV files to the song_hits folder in your project
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📄</div>
              <div>
                <p className="font-semibold text-gray-800">{uploadState.fileName}</p>
                <p className="text-sm text-gray-600">
                  {uploadState.totalSongs} song{uploadState.totalSongs !== 1 ? 's' : ''} loaded
                </p>
              </div>
            </div>
            <button
              onClick={handleReload}
              disabled={uploadState.isUploading}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadState.isUploading ? 'Reloading...' : '🔄 Reload'}
            </button>
          </div>
        </div>
      )}

      {uploadState.isUploading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
          <p className="text-sm text-gray-600 mt-2">Parsing file...</p>
        </div>
      )}

      {uploadState.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-700 font-semibold mb-1">Error</p>
          <p className="text-sm text-red-600 whitespace-pre-line">{uploadState.error}</p>
        </div>
      )}
    </div>
  );
};
