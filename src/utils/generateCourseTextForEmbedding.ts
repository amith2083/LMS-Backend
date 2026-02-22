/**
 * Converts a course object into a structured text string
 * which will be used to generate vector embeddings.

 */

export const generateCourseTextForEmbedding = (course: any): string => {
  const parts: string[] = [];

  // ── Core metadata ─────────────────────────────────────
  parts.push(`Course Title: ${course.title}`);
  if (course.subtitle) parts.push(`Subtitle: ${course.subtitle}`);
  parts.push(`Category: ${course.category?.title || "Uncategorized"}`);
  parts.push(`Instructor: ${course.instructor?.name || "Unknown"} ${course.instructor?.designation ? `(${course.instructor.designation})` : ""}`);
  parts.push(`Price: ${course.price ? `$${course.price}` : "Free"}`);
  parts.push(`Updated: ${(course.updatedAt)}`);

  // ── Main description ──────────────────────────────────
  if (course.description?.trim()) {
    parts.push(`Description:\n${course.description.trim()}`);
  }

  // ── Modules & Lessons ─────────────────────────────────
  if (course.modules?.length > 0) {
    parts.push("\nModules and Lessons:");
    course.modules.forEach((mod: any, idx: number) => {
      parts.push(`  ${idx + 1}. ${mod.title || "Untitled Module"}`);
      if (mod.description?.trim()) {
        parts.push(`     ${mod.description.trim().slice(0, 300)}${mod.description.length > 300 ? "..." : ""}`);
      }
      if (mod.lessonIds?.length > 0) {
        mod.lessonIds.forEach((lesson: any, lIdx: number) => {
          parts.push(`     - Lesson ${lIdx + 1}: ${lesson.title || "Untitled"}`);
          if (lesson.description?.trim()) {
            parts.push(`       ${lesson.description.trim().slice(0, 200)}${lesson.description.length > 200 ? "..." : ""}`);
          }
        });
      }
    });
  }

  // ── Quizzes ───────────────────────────────────────────
  if (course.quizSet?.quizIds?.length > 0) {
    parts.push("\nQuizzes:");
    course.quizSet.quizIds.forEach((quiz: any, idx: number) => {
      parts.push(`  ${idx + 1}. ${quiz.title || "Untitled Quiz"}`);
      if (quiz.questions?.length) {
        parts.push(`     (${quiz.questions.length} questions)`);
      }
    });
  }

  // ── Testimonials ──────────────────────────────────────
  if (course.testimonials?.length > 0) {
    parts.push("\nStudent Testimonials:");
    course.testimonials.slice(0, 8).forEach((t: any) => {  // limit to avoid token explosion
      const name = t.user?.name || "Anonymous";
      const text = t.comment?.trim().slice(0, 250) || "";
      if (text) parts.push(`  - ${name}: "${text}"`);
    });
  }

  return parts.join("\n").trim();
};