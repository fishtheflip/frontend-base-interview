import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { modules } from "../../topics";
import SectionPageClient from "./section-page-client";

export function generateStaticParams() {
  return modules.map((module) => ({ id: module.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const module = modules.find((item) => item.id === id);
  return module
    ? { title: `${module.title} — Frontend Base`, description: module.description }
    : { title: "Раздел не найден — Frontend Base" };
}

export default async function SectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const module = modules.find((item) => item.id === id);
  if (!module) notFound();
  return <SectionPageClient module={module} />;
}
