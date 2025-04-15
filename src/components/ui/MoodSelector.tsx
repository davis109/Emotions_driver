import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoodLevel } from '../../types';

interface MoodSelectorProps {
  initialValue?: MoodLevel;
  onChange: (value: MoodLevel) => void;
}

const moods = [
  { value: 1, emoji: '😞', label: 'Very Bad' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Very Good' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  initialValue = 3, 
  onChange 
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodLevel>(initialValue);

  const handleMoodChange = (mood: MoodLevel) => {
    setSelectedMood(mood);
    onChange(mood);
  };

  return (
    <div className="w-full py-4">
      <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
        How are you feeling today?
      </h3>
      <div className="flex justify-between w-full mb-2">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodChange(mood.value as MoodLevel)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 
              ${selectedMood === mood.value 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            aria-label={mood.label}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </motion.button>
        ))}
      </div>
      <div className="w-full mt-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: `${(initialValue / 5) * 100}%` }}
            animate={{ width: `${(selectedMood / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
};

export default MoodSelector; 