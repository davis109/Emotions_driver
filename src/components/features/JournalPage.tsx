import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useJournal } from '../../context/JournalContext';
import JournalEntry from '../JournalEntry';
import JournalEntryForm from './JournalEntryForm';
import JournalEntryCard from './JournalEntryCard';
import MoodChart from './MoodChart';
import QuoteDisplay from '../ui/QuoteDisplay';
import { JournalEntry as JournalEntryType } from '../../types';

const JournalPage: React.FC = () => {
  const { entries } = useJournal();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntryType | undefined>(undefined);
  
  const handleAddClick = () => {
    setEditEntry(undefined);
    setShowNewEntryForm(true);
    setIsFormVisible(false);
  };
  
  const handleEditClick = (entry: JournalEntryType) => {
    setEditEntry(entry);
    setIsFormVisible(true);
    setShowNewEntryForm(false);
  };
  
  const handleFormComplete = () => {
    setIsFormVisible(false);
    setEditEntry(undefined);
  };
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isFormVisible 
                ? (editEntry ? 'Edit Entry' : 'New Entry') 
                : showNewEntryForm 
                  ? 'Create New Entry'
                  : 'Journal Entries'
              }
            </h2>
            
            {!isFormVisible && !showNewEntryForm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddClick}
                className="btn btn-primary flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Entry
              </motion.button>
            )}
            
            {(isFormVisible || showNewEntryForm) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFormVisible(false);
                  setShowNewEntryForm(false);
                }}
                className="btn btn-outline flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </motion.button>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {isFormVisible ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <JournalEntryForm 
                  entry={editEntry} 
                  onComplete={handleFormComplete} 
                />
              </motion.div>
            ) : showNewEntryForm ? (
              <motion.div
                key="new-entry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <JournalEntry />
              </motion.div>
            ) : (
              <motion.div
                key="entries"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {sortedEntries.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {sortedEntries.map(entry => (
                        <JournalEntryCard 
                          key={entry.id} 
                          entry={entry} 
                          onEdit={() => handleEditClick(entry)} 
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-10 card">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You haven't created any journal entries yet.
                    </p>
                    <button 
                      onClick={handleAddClick}
                      className="btn btn-primary"
                    >
                      Create Your First Entry
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="space-y-6">
          <MoodChart entries={entries} />
          <QuoteDisplay />
        </div>
      </div>
    </div>
  );
};

export default JournalPage; 