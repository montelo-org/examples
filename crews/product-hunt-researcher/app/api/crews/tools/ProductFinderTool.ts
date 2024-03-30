import { load } from "cheerio";
import { Tool } from "montelo";
import { z } from "zod";

const formatHTML = (html: string): string => {
  const $ = load(html);
  let combinedString = "";

  $(`div[data-test="homepage-section-0"]`)
    .find("*")
    .each((_, el) => {
      const element = $(el);
      const ancestors = element.parents();
      const indentation = " ".repeat(ancestors.length * 2);

      // Skip script and style tags
      if (element.is("script") || element.is("style")) {
        return;
      }

      // Handle text content for specific tags
      if (
        element.is(
          "div, nav, section, a, h1, h2, h3, h4, h5, h6, header, footer, main, article, summary, p, span, ul, li, ol, button",
        )
      ) {
        const textContent = element
          .contents()
          .toArray()
          .filter((child) => child.type === "text")
          .map((child) => $(child).text().trim())
          .filter((text) => text.length > 0)
          .join(" ");

        if (textContent) {
          const href = element.attr("href");
          const hrefText = href && href !== "#" ? ` (link: ${href})\n` : "\n";
          combinedString += `${indentation}${el.tagName.toUpperCase()}: ${textContent}${hrefText}`;
        }
      }

      // Handle <a> tag href attribute
      if (element.is("a") && element.attr("href")) {
        const linkText = element.text().trim();
        const href = element.attr("href") || "";

        // Exclude '#' links from being added
        if (href !== "" && !href.startsWith("#")) {
          combinedString += `${indentation}A: ${linkText} (link: ${href})\n`;
        } else {
          combinedString += `${indentation}A: ${linkText}\n`;
        }
      }

      // Handle <img> tag alt attribute
      if (element.is("img") && element.attr("alt")) {
        combinedString += `${indentation}IMG: ${element.attr("alt")}\n`;
      }

      // Handle input elements, primarily for their value attributes
      if (element.is("input") && element.attr("value")) {
        combinedString += `${indentation}Input: ${element.attr("value")}\n`;
      }
    });

  const lines = combinedString.split("\n");
  return Array.from(new Set(lines)).join("\n");
};

const findProducts = async (): Promise<string> => {
  if (!process.env.SCRAPER_API_KEY) {
    throw new Error("Please set a SCRAPER_API_KEY in your environment variables.");
  }
  try {
    const PRODUCT_HUNT_URL = "https://www.producthunt.com/";
    const res = await fetch(
      `http://api.scraperapi.com/?api_key=${process.env.SCRAPER_API_KEY}&url=${PRODUCT_HUNT_URL}`,
    );
    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json") ? await res.json() : await res.text();

    const formattedPage = formatHTML(data);
    return formattedPage;
  } catch (err) {
    console.error(err);
    return "An error occurred while scraping the website.";
  }
};

/**
 * Tool Definition
 */
export const ProductFinderTool = new Tool({
  name: "ProductFinder",
  function: findProducts,
  description: "This tool finds the hottest new products on Product Hunt.",
  schema: z.object({}),
});
