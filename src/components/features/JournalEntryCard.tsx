import { useState } from 'react';
import { motion } from 'framer-motion';
import { JournalEntry, EmotionTag } from '../../types';
import { useJournal } from '../../context/JournalContext';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit: () => void;
}

const moodEmojis: Record<number, string> = {
  1: '😞',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

const emotionEmojis: Record<EmotionTag, string> = {
  'happy': '😊',
  'sad': '😢',
  'anxious': '😰',
  'calm': '😌',
  'angry': '😠',
  'excited': '🤩',
  'tired': '😴',
  'motivated': '💪',
  'stressed': '😫',
  'relaxed': '🧘',
  'grateful': '🙏',
  'frustrated': '😤',
};

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onEdit }) => {
  const { deleteEntry } = useJournal();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = new Date(entry.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = () => {
    deleteEntry(entry.id);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card mb-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">{moodEmojis[entry.mood]}</span>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {formattedDate}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formattedTime}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            aria-label="Edit entry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          
          {showConfirmDelete ? (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Cancel delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                aria-label="Confirm delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowConfirmDelete(true)}
              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              aria-label="Delete entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="my-4">
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{entry.content}</p>
      </div>
      
      {entry.emotions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {entry.emotions.map(emotion => (
            <span 
              key={emotion}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300"
            >
              {emotionEmojis[emotion]} {emotion}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default JournalEntryCard; 