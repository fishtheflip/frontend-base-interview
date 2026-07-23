import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allTopics, modules } from "../../topics";
import TopicPageClient from "./topic-page-client";

export function generateStaticParams() {
  return allTopics.map((topic) => ({ id: topic.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const topic = allTopics.find((item) => item.id === id);

  if (!topic) return { title: "Тема не найдена — Frontend Base" };

  return {
    title: `${topic.title} — Frontend Base`,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = allTopics.find((item) => item.id === id);
  const module = modules.find((item) => item.topics.some((candidate) => candidate.id === id));

  if (!topic || !module) notFound();

  return <TopicPageClient topic={topic} module={module} />;
}
