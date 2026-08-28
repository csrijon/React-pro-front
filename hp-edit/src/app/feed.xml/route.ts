import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: "default" },
    });

    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const baseUrl = "https://www.hpedit.com";
    const siteTitle = org?.name || "HP Edit Enterprise";
    const siteDesc = org?.description || "Architecting Intelligent Software, AI Agents & Enterprise Systems";

    const rssItems = blogs
      .map((post) => {
        const postUrl = `${baseUrl}/blog/${post.slug}`;
        const pubDate = new Date(post.createdAt).toUTCString();

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>${post.authorName || "HP Edit Engineering Team"}</author>
      <pubDate>${pubDate}</pubDate>
      <category>${post.tags.split(",")[0] || "Engineering"}</category>
    </item>`;
      })
      .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteTitle} | Engineering Insights & Architecture Breakdowns]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${siteDesc}]]></description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`.trim();

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}
