"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TutorialItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function TutorialsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const tutorials: TutorialItem[] = [
    {
      id: "what-is-rsvp",
      title: "What is RSVP?",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">RSVP</strong> stands for <strong className="text-foreground">Rapid Serial Visual Presentation</strong>. 
            It's a speed reading technique that displays words one at a time (or in small chunks) at a fixed position on your screen.
          </p>
          <p>
            Traditional reading requires your eyes to move across lines of text, which takes time and can cause you to re-read words. 
            RSVP eliminates this by showing each word in the same spot, allowing you to focus entirely on comprehension without eye movement.
          </p>
          <p>
            <strong className="text-foreground">How it works:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Words appear one at a time in the center of your screen</li>
            <li>You can adjust the speed (words per minute) to match your reading pace</li>
            <li>No eye movement needed - just focus on the center</li>
            <li>Your brain processes the words faster because it doesn't need to track eye position</li>
          </ul>
          <p>
            Research shows that RSVP can help readers achieve speeds of 300-600+ words per minute while maintaining good comprehension, 
            compared to the average reading speed of 200-250 words per minute.
          </p>
        </div>
      ),
    },
    {
      id: "level-up-speed-reading",
      title: "How to Level Up Your Speed Reading",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Improving your speed reading with RSVP takes practice. Here are proven strategies to help you read faster while maintaining comprehension:
          </p>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. Start Slow, Build Gradually</h4>
              <p>
                Begin at a comfortable speed (200-250 WPM) and gradually increase by 25-50 WPM every few sessions. 
                Don't rush - comprehension is more important than speed.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Use Chunk Size Strategically</h4>
              <p>
                Start with 1 word per chunk to build focus. As you improve, try 2-3 words per chunk. 
                This helps you process phrases and concepts together, which can actually improve comprehension at higher speeds.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Practice Daily</h4>
              <p>
                Consistency is key. Even 10-15 minutes of daily practice will help your brain adapt to RSVP reading. 
                Track your progress using the insights panel to see your improvement over time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Focus on Comprehension, Not Just Speed</h4>
              <p>
                Speed without understanding is useless. After each reading session, ask yourself: 
                "What did I just read?" If you can't recall the main points, slow down slightly.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">5. Eliminate Subvocalization</h4>
              <p>
                Subvocalization is the habit of "saying" words in your head as you read. 
                RSVP helps break this habit by presenting words faster than you can subvocalize. 
                Trust your brain to process words visually without the inner voice.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">6. Adjust Settings for Different Content</h4>
              <p>
                Use slower speeds for complex or technical material, and faster speeds for familiar topics or lighter reading. 
                Adjust font size and chunk size to find what works best for your eyes and brain.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">7. Take Breaks</h4>
              <p>
                Speed reading can be mentally intensive. Take short breaks every 15-20 minutes to avoid fatigue 
                and maintain your focus and comprehension.
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs font-medium text-foreground mb-1">💡 Pro Tip</p>
            <p className="text-xs">
              Use the Focus Mode (press 'F' or click the Focus button) to eliminate distractions and maximize your reading speed. 
              The distraction-free environment helps your brain focus entirely on the words.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "getting-started",
      title: "Getting Started with Speed-r",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            New to Speed-r? Here's a quick guide to get you reading faster in minutes:
          </p>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. Add Your First Document</h4>
              <p>
                Click "Add Document" on the dashboard. You can:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                <li>Paste text directly</li>
                <li>Upload a PDF, TXT, or DOCX file</li>
                <li>Import an article from a URL</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Adjust Your Settings</h4>
              <p>
                Before you start reading, customize your experience:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                <li><strong className="text-foreground">WPM (Words Per Minute):</strong> Start at 250-300 WPM and adjust as you improve</li>
                <li><strong className="text-foreground">Font Size:</strong> Choose a size that's comfortable for your eyes</li>
                <li><strong className="text-foreground">Words per Chunk:</strong> Start with 1 word, try 2-3 as you advance</li>
                <li><strong className="text-foreground">Font Family:</strong> Pick a font that's easy to read</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Start Reading</h4>
              <p>
                Press the play button (or Spacebar) to start. The words will appear one at a time in the center of your screen. 
                Use the controls to pause, skip forward/backward, or adjust speed on the fly.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Use Keyboard Shortcuts</h4>
              <p>
                Speed up your workflow with these shortcuts:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                <li><strong className="text-foreground">Space:</strong> Play/Pause</li>
                <li><strong className="text-foreground">← →:</strong> Skip backward/forward</li>
                <li><strong className="text-foreground">↑ ↓ or +/-:</strong> Adjust WPM</li>
                <li><strong className="text-foreground">F:</strong> Toggle Focus Mode</li>
                <li><strong className="text-foreground">Esc:</strong> Back to library</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">5. Track Your Progress</h4>
              <p>
                Check the Insights Panel on your dashboard to see:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                <li>Total words read</li>
                <li>Your reading streak</li>
                <li>Average reading speed</li>
                <li>Daily and weekly statistics</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "tips-and-tricks",
      title: "Tips & Tricks",
      content: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Optimize Your Environment</h4>
              <p>
                Use Focus Mode for distraction-free reading. Adjust your screen brightness and ensure good lighting 
                to reduce eye strain during longer reading sessions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Save Your Progress</h4>
              <p>
                Your reading progress is automatically saved. You can close the browser and resume exactly where you left off. 
                Perfect for longer documents and books.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Experiment with Settings</h4>
              <p>
                Everyone's optimal reading settings are different. Try different combinations of WPM, chunk size, and font 
                to find what works best for you. Your settings are saved automatically.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Build a Reading Library</h4>
              <p>
                Add multiple documents to your library. You can switch between them easily and track progress on each one separately. 
                Great for reading multiple articles, books, or study materials.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Use URL Import for Articles</h4>
              <p>
                Instead of copying and pasting, use the URL import feature to quickly add articles from the web. 
                Speed-r will extract the main content automatically.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Practice with Different Content Types</h4>
              <p>
                Try reading different types of content - news articles, blog posts, technical documentation, fiction. 
                Each type may require different speeds and settings for optimal comprehension.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Tutorials & Support</h2>
        <div className="space-y-2">
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpanded(tutorial.id)}
                className="w-full px-4 py-3 sm:px-6 sm:py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base">{tutorial.title}</span>
                <span className="text-muted-foreground text-lg sm:text-xl">
                  {expandedId === tutorial.id ? "−" : "+"}
                </span>
              </button>
              {expandedId === tutorial.id && (
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-2 border-t">
                  {tutorial.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

