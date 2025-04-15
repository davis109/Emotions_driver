import React, { useState, useRef } from 'react';

// Simplified type definitions
type MoodLevel = 1 | 2 | 3 | 4 | 5;

type EmotionTag = 
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'calm'
  | 'angry'
  | 'excited'
  | 'tired'
  | 'motivated'
  | 'stressed'
  | 'relaxed'
  | 'grateful'
  | 'frustrated';

interface JournalEntryType {
  id: string;
  date: string;
  content: string;
  mood: MoodLevel;
  emotions: EmotionTag[];
}

// Mock context
const useJournal = () => {
  const addEntry = async (entry: Omit<JournalEntryType, 'id'>) => {
    console.log('Entry added:', entry);
    return Promise.resolve();
  };
  
  return { addEntry };
};

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
    background: isSelected ? '#e0f2fe' : 'transparent',
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
          <span style={{ fontSize: '12px' }}>{mood.label}</span>
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
  
  // Inline styles to avoid CSS issues
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#1f2937'
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    textarea: {
      width: '100%',
      minHeight: '150px',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      resize: 'vertical' as const
    },
    emotionsContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '8px'
    },
    emotionTag: (isSelected: boolean) => ({
      padding: '6px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      backgroundColor: isSelected ? '#3b82f6' : '#e5e7eb',
      color: isSelected ? 'white' : '#1f2937',
      border: 'none',
      cursor: 'pointer'
    }),
    submitButton: {
      padding: '10px',
      backgroundColor: isSubmitting ? '#9ca3af' : '#0ea5e9',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: isSubmitting ? 'wait' : 'pointer'
    }
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>How are you feeling today?</h2>
      
      <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="journal-entry" style={styles.label}>
            Journal Entry
          </label>
          <textarea
            id="journal-entry"
            style={styles.textarea}
            placeholder="Write your thoughts here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>How's your mood?</label>
          <MoodSelector initialValue={mood} onChange={setMood} />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Select your emotions:</label>
          <div style={styles.emotionsContainer}>
            {(['happy', 'sad', 'anxious', 'calm', 'angry', 'excited', 'tired', 'motivated', 'stressed', 'relaxed', 'grateful', 'frustrated'] as EmotionTag[]).map(emotion => (
              <button
                key={emotion}
                type="button"
                onClick={() => handleEmotionToggle(emotion)}
                style={styles.emotionTag(emotions.includes(emotion))}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          style={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
};

export default JournalEntry; 