import { useState } from 'react';
import { motion } from 'framer-motion';
import { EmotionTag } from '../../types';

interface EmotionTagsProps {
  selectedEmotions: EmotionTag[];
  onChange: (emotions: EmotionTag[]) => void;
}

const emotionOptions: { value: EmotionTag; emoji: string }[] = [
  { value: 'happy', emoji: '😊' },
  { value: 'sad', emoji: '😢' },
  { value: 'anxious', emoji: '😰' },
  { value: 'calm', emoji: '😌' },
  { value: 'angry', emoji: '😠' },
  { value: 'excited', emoji: '🤩' },
  { value: 'tired', emoji: '😴' },
  { value: 'motivated', emoji: '💪' },
  { value: 'stressed', emoji: '😫' },
  { value: 'relaxed', emoji: '🧘' },
  { value: 'grateful', emoji: '🙏' },
  { value: 'frustrated', emoji: '😤' },
];

const EmotionTags: React.FC<EmotionTagsProps> = ({ 
  selectedEmotions = [], 
  onChange 
}) => {
  const [selected, setSelected] = useState<EmotionTag[]>(selectedEmotions);

  const toggleEmotion = (emotion: EmotionTag) => {
    const newSelected = selected.includes(emotion)
      ? selected.filter(e => e !== emotion)
      : [...selected, emotion];
    
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="w-full py-4">
      <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
        Select your emotions
      </h3>
      <div className="flex flex-wrap gap-2">
        {emotionOptions.map((emotion) => {
          const isSelected = selected.includes(emotion.value);
          return (
            <motion.button
              key={emotion.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleEmotion(emotion.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200
                ${isSelected 
                  ? 'bg-secondary-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              aria-pressed={isSelected}
            >
              <span>{emotion.emoji}</span>
              <span className="capitalize">{emotion.value}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionTags; 