import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Only allow http/https protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { success: false, error: "Only HTTP and HTTPS URLs are supported" },
        { status: 400 }
      );
    }

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Parse HTML with cheerio
    const $ = cheerio.load(html);

    // Remove script and style elements
    $("script, style, nav, header, footer, aside, .ad, .advertisement, .sidebar").remove();

    // Try to find article content using common selectors
    let articleText = "";

    // Common article selectors (in order of preference)
    const articleSelectors = [
      "article",
      "[role='article']",
      ".article",
      ".post-content",
      ".entry-content",
      ".content",
      "main",
      ".main-content",
      "#content",
      "body",
    ];

    for (const selector of articleSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        articleText = element.text();
        // If we found substantial content, use it
        if (articleText.trim().length > 200) {
          break;
        }
      }
    }

    // Fallback: get all text from body if no article found
    if (!articleText || articleText.trim().length < 200) {
      articleText = $("body").text();
    }

    // Clean up the text
    let cleanedText = articleText
      .replace(/\s+/g, " ") // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, "\n") // Remove multiple newlines
      .trim();

    if (cleanedText.length === 0) {
      return NextResponse.json(
        { success: false, error: "No text content found on the page" },
        { status: 400 }
      );
    }

    // Get page title for default document title
    const pageTitle =
      $("title").text().trim() ||
      $("h1").first().text().trim() ||
      "Imported Article";

    return NextResponse.json({
      success: true,
      text: cleanedText,
      title: pageTitle,
    });
  } catch (error) {
    console.error("Error parsing URL:", error);
    
    if (error instanceof Error) {
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        return NextResponse.json(
          { success: false, error: "Request timed out. The URL may be too slow or unreachable." },
          { status: 408 }
        );
      }
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { success: false, error: "Failed to fetch URL. Please check if the URL is accessible." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to parse URL",
      },
      { status: 500 }
    );
  }
}

