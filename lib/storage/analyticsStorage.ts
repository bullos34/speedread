import type { ReadingSession, DailyStats, AnalyticsData } from "@/types";

const ANALYTICS_KEY = "speedread-analytics";
const MAX_SESSIONS = 1000; // Keep last 1000 sessions
const MAX_DAILY_STATS_DAYS = 90; // Keep 90 days of daily stats

const defaultAnalytics: AnalyticsData = {
  sessions: [],
  dailyStats: {},
  aggregated: {
    totalWords: 0,
    totalTime: 0,
    averageWPM: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
  },
};

export const analyticsStorage = {
  loadAnalytics: (): AnalyticsData => {
    if (typeof window === "undefined") return defaultAnalytics;
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (!stored) return defaultAnalytics;
      const data = JSON.parse(stored);
      // Clean up old data
      return analyticsStorage.cleanupOldData(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      return defaultAnalytics;
    }
  },

  saveAnalytics: (data: AnalyticsData): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const cleaned = analyticsStorage.cleanupOldData(data);
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(cleaned));
      return true;
    } catch (error) {
      console.error("Failed to save analytics:", error);
      return false;
    }
  },

  cleanupOldData: (data: AnalyticsData): AnalyticsData => {
    // Keep only last MAX_SESSIONS sessions
    const sessions = data.sessions
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, MAX_SESSIONS);

    // Remove daily stats older than MAX_DAILY_STATS_DAYS
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_DAILY_STATS_DAYS);
    const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

    const dailyStats: { [date: string]: DailyStats } = {};
    Object.keys(data.dailyStats)
      .filter((date) => date >= cutoffDateStr)
      .forEach((date) => {
        dailyStats[date] = data.dailyStats[date];
      });

    // Recalculate aggregated stats
    const aggregated = analyticsStorage.calculateAggregated(sessions, dailyStats);

    return {
      sessions,
      dailyStats,
      aggregated,
    };
  },

  addSession: (session: ReadingSession): boolean => {
    const data = analyticsStorage.loadAnalytics();
    data.sessions.push(session);
    
    // Update daily stats for the session date
    const sessionDate = new Date(session.startTime).toISOString().split("T")[0];
    if (!data.dailyStats[sessionDate]) {
      data.dailyStats[sessionDate] = {
        date: sessionDate,
        wordsRead: 0,
        timeSpent: 0,
        sessions: 0,
        averageWPM: 0,
        maxWPM: 0,
        minWPM: Infinity,
      };
    }
    
    const daily = data.dailyStats[sessionDate];
    daily.wordsRead += session.wordsRead;
    daily.timeSpent += session.duration;
    daily.sessions += 1;
    daily.averageWPM = (daily.wordsRead / (daily.timeSpent / 60000)) || 0;
    daily.maxWPM = Math.max(daily.maxWPM, session.averageWPM);
    daily.minWPM = Math.min(daily.minWPM, session.averageWPM);

    // Recalculate aggregated
    data.aggregated = analyticsStorage.calculateAggregated(data.sessions, data.dailyStats);

    return analyticsStorage.saveAnalytics(data);
  },

  calculateAggregated: (
    sessions: ReadingSession[],
    dailyStats: { [date: string]: DailyStats }
  ) => {
    const totalWords = sessions.reduce((sum, s) => sum + s.wordsRead, 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    const averageWPM = totalTime > 0 ? (totalWords / (totalTime / 60000)) : 0;

    // Calculate streaks
    const dates = Object.keys(dailyStats)
      .filter((date) => dailyStats[date].wordsRead > 0)
      .sort()
      .reverse();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    let lastDate = today;

    for (const date of dates) {
      const dateObj = new Date(date);
      const lastDateObj = new Date(lastDate);
      const daysDiff = Math.floor(
        (lastDateObj.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        tempStreak++;
        if (date === dates[dates.length - 1] || dates.indexOf(date) === dates.length - 1) {
          currentStreak = tempStreak + 1;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak + 1);
        tempStreak = 0;
      }
      lastDate = date;
    }

    longestStreak = Math.max(longestStreak, tempStreak + 1);
    if (dates.includes(today) || dates.length === 0) {
      currentStreak = Math.max(currentStreak, tempStreak + 1);
    }

    return {
      totalWords,
      totalTime,
      averageWPM: Math.round(averageWPM),
      currentStreak,
      longestStreak,
      totalSessions: sessions.length,
    };
  },

  getWeeklyStats: (days: number = 7): DailyStats[] => {
    const data = analyticsStorage.loadAnalytics();
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }

    return dates
      .reverse()
      .map((date) => data.dailyStats[date] || {
        date,
        wordsRead: 0,
        timeSpent: 0,
        sessions: 0,
        averageWPM: 0,
        maxWPM: 0,
        minWPM: 0,
      });
  },
};

