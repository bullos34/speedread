"use client";

import { useState, useEffect } from "react";
import { analyticsStorage } from "@/lib/storage/analyticsStorage";
import type { AnalyticsData } from "@/types";
import { Button } from "@/components/ui/button";

export function InsightsPanel() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const data = analyticsStorage.loadAnalytics();
    setAnalytics(data);
  }, []);

  if (!analytics) {
    return null; // Still loading
  }

  const { aggregated } = analytics;
  const totalHours = Math.round(aggregated.totalTime / (1000 * 60 * 60) * 10) / 10;
  const totalMinutes = Math.round(aggregated.totalTime / (1000 * 60));

  // Get today's and this week's stats
  const today = new Date().toISOString().split("T")[0];
  const todayStats = analytics.dailyStats[today] || {
    wordsRead: 0,
    timeSpent: 0,
    sessions: 0,
    averageWPM: 0,
  };

  const weeklyStats = analyticsStorage.getWeeklyStats(7);
  const thisWeekWords = weeklyStats.reduce((sum, day) => sum + day.wordsRead, 0);
  const thisWeekTime = weeklyStats.reduce((sum, day) => sum + day.timeSpent, 0);
  const thisWeekMinutes = Math.round(thisWeekTime / (1000 * 60));

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold">Reading Insights</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs"
        >
          {expanded ? "−" : "+"}
        </Button>
      </div>

      {/* Quick Stats - Today & This Week */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border bg-muted/50 p-3">
          <div className="text-xs text-muted-foreground mb-1">Today</div>
          <div className="text-xl font-bold text-primary">
            {formatNumber(todayStats.wordsRead)}
          </div>
          <div className="text-xs text-muted-foreground">words</div>
        </div>
        <div className="rounded-lg border bg-muted/50 p-3">
          <div className="text-xs text-muted-foreground mb-1">This Week</div>
          <div className="text-xl font-bold text-primary">
            {formatNumber(thisWeekWords)}
          </div>
          <div className="text-xs text-muted-foreground">words</div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg border bg-primary/5 p-3 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {formatNumber(aggregated.totalWords)}
          </div>
          <div className="text-xs text-muted-foreground">Total Words</div>
        </div>
        <div className="rounded-lg border bg-primary/5 p-3 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {aggregated.currentStreak}
          </div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
        <div className="rounded-lg border bg-primary/5 p-3 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {aggregated.averageWPM || 0}
          </div>
          <div className="text-xs text-muted-foreground">Avg WPM</div>
        </div>
        <div className="rounded-lg border bg-primary/5 p-3 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {totalMinutes > 60 ? `${totalHours}h` : totalMinutes > 0 ? `${totalMinutes}m` : "0m"}
          </div>
          <div className="text-xs text-muted-foreground">Total Time</div>
        </div>
      </div>

      {aggregated.totalWords === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          Start reading to see your insights here!
        </div>
      )}

      {expanded && (
        <div className="space-y-2 pt-2 border-t text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Sessions</span>
            <span className="font-medium">{aggregated.totalSessions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Longest Streak</span>
            <span className="font-medium">{aggregated.longestStreak} days</span>
          </div>
          {analytics.dailyStats && Object.keys(analytics.dailyStats).length > 0 && (
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-1">Last 7 Days</div>
              <div className="space-y-1">
                {analyticsStorage
                  .getWeeklyStats(7)
                  .slice(-7)
                  .map((day) => (
                    <div key={day.date} className="flex justify-between text-xs">
                      <span>
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="font-medium">
                        {formatNumber(day.wordsRead)} words
                        {day.averageWPM > 0 && ` @ ${day.averageWPM} WPM`}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

