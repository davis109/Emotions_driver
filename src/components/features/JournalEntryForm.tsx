import { useState } from 'react';
import { motion } from 'framer-motion';
import { EmotionTag, JournalEntry, MoodLevel } from '../../types';
import MoodSelector from '../ui/MoodSelector';
import EmotionTags from '../ui/EmotionTags';
import { useJournal } from '../../context/JournalContext';

interface JournalEntryFormProps {
  entry?: JournalEntry;
  onComplete?: () => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ 
  entry,
  onComplete 
}) => {
  const { addEntry, updateEntry } = useJournal();
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<MoodLevel>(entry?.mood || 3);
  const [emotions, setEmotions] = useState<EmotionTag[]>(entry?.emotions || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!entry;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const currentDate = new Date().toISOString();
    
    if (isEditing && entry) {
      updateEntry(entry.id, {
        content,
        mood,
        emotions,
        date: currentDate
      });
    } else {
      addEntry({
        content,
        mood,
        emotions,
        date: currentDate
      });
    }
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (onComplete) {
        onComplete();
      }
      
      if (!isEditing) {
        // Reset form if creating new entry
        setContent('');
        setMood(3);
        setEmotions([]);
      }
    }, 600);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="w-full card"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}
      </h2>
      
      <MoodSelector initialValue={mood} onChange={setMood} />
      
      <div className="mb-4">
        <label htmlFor="journal-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          What's on your mind?
        </label>
        <textarea
          id="journal-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input min-h-[150px] resize-y"
          placeholder="Write your thoughts here..."
          required
        />
      </div>
      
      <EmotionTags selectedEmotions={emotions} onChange={setEmotions} />
      
      <div className="flex justify-end mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          type="submit"
          className={`btn btn-primary flex items-center gap-2 ${isSubmitting ? 'opacity-70' : ''}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              {isEditing ? 'Update Entry' : 'Save Entry'}
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default JournalEntryForm; 