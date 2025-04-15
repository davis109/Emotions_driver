import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { JournalEntry } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MoodChartProps {
  entries: JournalEntry[];
  days?: number;
}

// Modified MoodData interface for chart
interface ChartMoodData {
  date: string;
  value: number; // Using number instead of MoodLevel for flexibility with averaging
}

const MoodChart: React.FC<MoodChartProps> = ({ entries, days = 7 }) => {
  const { isDarkMode } = useTheme();
  const [chartData, setChartData] = useState<ChartMoodData[]>([]);
  const [timeRange, setTimeRange] = useState<number>(days);

  useEffect(() => {
    if (entries.length === 0) return;

    // Group entries by date and calculate the average mood for each day
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - timeRange);

    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= now;
    });

    // Create a map for each day in the range
    const daysMap: Record<string, ChartMoodData> = {};
    
    // Initialize the days map with all days in the range
    for (let i = 0; i <= timeRange; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      daysMap[dateStr] = {
        date: dateStr,
        value: 0,
      };
    }

    // Fill in the actual values
    filteredEntries.forEach(entry => {
      const dateStr = new Date(entry.date).toISOString().split('T')[0];
      
      if (daysMap[dateStr]) {
        // If we already have a mood for this day, average it
        if (daysMap[dateStr].value !== 0) {
          daysMap[dateStr].value = (daysMap[dateStr].value + entry.mood) / 2;
        } else {
          daysMap[dateStr].value = entry.mood;
        }
      }
    });

    // Convert to array and sort by date
    const chartData = Object.values(daysMap)
      .filter(day => day.value !== 0) // Remove days with no entries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setChartData(chartData);
  }, [entries, timeRange]);

  const handleTimeRangeChange = (newRange: number) => {
    setTimeRange(newRange);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEmotionFromValue = (value: number) => {
    if (value >= 4.5) return 'Very Good';
    if (value >= 3.5) return 'Good';
    if (value >= 2.5) return 'Neutral';
    if (value >= 1.5) return 'Bad';
    return 'Very Bad';
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: ChartMoodData;
    }>;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-2 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">{formatDate(data.date)}</p>
          <p className="font-medium text-primary-600 dark:text-primary-400">
            Mood: {getEmotionFromValue(data.value)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Level: {data.value.toFixed(1)}
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Mood Trends</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleTimeRangeChange(7)}
          className={`btn ${timeRange === 7 ? 'btn-primary' : 'btn-outline'}`}
        >
          7 Days
        </button>
        <button
          onClick={() => handleTimeRangeChange(14)}
          className={`btn ${timeRange === 14 ? 'btn-primary' : 'btn-outline'}`}
        >
          14 Days
        </button>
        <button
          onClick={() => handleTimeRangeChange(30)}
          className={`btn ${timeRange === 30 ? 'btn-primary' : 'btn-outline'}`}
        >
          30 Days
        </button>
      </div>
      
      {chartData.length > 0 ? (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'} 
              />
              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]} 
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#moodGradient)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No mood data available for the selected period.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start adding journal entries to see your mood trends.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MoodChart; 