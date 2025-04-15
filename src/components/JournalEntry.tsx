import React, { useState, useRef } from 'react';
import { MoodLevel, EmotionTag } from '../types';
import { useJournal } from '../context/JournalContext';

// Simplified MoodSelector
const MoodSelector: React.FC<{
  initialValue: MoodLevel;
  onChange: (value: MoodLevel) => void;
}> = ({ initialValue, onChange }) => {
  const moods = [
    { value: 1, emoji: '😞', label: 'Very Bad' },
    { value: 2, emoji: '😕', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😄', label: 'Very Good' },
  ];
  
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  };
  
  const buttonStyle = (isSelected: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    background: isSelected ? '#4287f5' : 'rgba(255, 255, 255, 0.08)',
    color: 'white',
    cursor: 'pointer'
  });
  
  return (
    <div style={containerStyle}>
      {moods.map(mood => (
        <button
          key={mood.value}
          type="button"
          style={buttonStyle(mood.value === initialValue)}
          onClick={() => onChange(mood.value as MoodLevel)}
        >
          <span style={{ fontSize: '24px' }}>{mood.emoji}</span>
          <span style={{ fontSize: '12px', color: 'white' }}>{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

const JournalEntry: React.FC = () => {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState<MoodLevel>(3);
  const [emotions, setEmotions] = useState<EmotionTag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addEntry } = useJournal();
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entry.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new journal entry
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: entry,
        mood,
        emotions
      };
      
      // Add to journal context
      await addEntry(newEntry);
      
      // Clear form
      setEntry('');
      setMood(3);
      setEmotions([]);
    } catch (error) {
      console.error('Failed to add entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEmotionToggle = (emotion: EmotionTag) => {
    setEmotions(prev => 
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };
  
  return (
    <div className="card w-full max-w-3xl mx-auto" style={{ backgroundColor: '#1e293b', color: 'white' }}>
      <h2 className="text-2xl font-bold text-white mb-4">How are you feeling today?</h2>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="journal-entry" className="block text-sm font-medium text-white">
            Journal Entry
          </label>
          <textarea
            id="journal-entry"
            className="input min-h-[150px] resize-y"
            style={{ backgroundColor: '#0f172a', color: 'white', borderColor: '#475569' }}
            placeholder="Write your thoughts here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">How's your mood?</label>
          <MoodSelector initialValue={mood} onChange={setMood} />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Select your emotions:</label>
          <div className="flex flex-wrap gap-2">
            {(['happy', 'sad', 'anxious', 'calm', 'angry', 'excited', 'tired', 'motivated', 'stressed', 'relaxed', 'grateful', 'frustrated'] as EmotionTag[]).map(emotion => (
              <button
                key={emotion}
                type="button"
                onClick={() => handleEmotionToggle(emotion)}
                className={`px-3 py-1 rounded-full text-sm ${
                  emotions.includes(emotion)
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          className="btn w-full"
          style={{ 
            backgroundColor: isSubmitting ? '#4b5563' : '#3b82f6',
            color: 'white',
            fontWeight: 'bold' 
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
};

export default JournalEntry; 