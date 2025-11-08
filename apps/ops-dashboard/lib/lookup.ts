export const getAuthorAvatarUrl = (_githubId: string) => '';

export const getAuthorName = (githubId: string) => githubId;

export const getCourseByLessonId = (lessonId: string) => ({
  id: lessonId,
  title: lessonId,
  lessons: [] as never[],
});

export const getLessonById = (lessonId: string) => ({
  id: lessonId,
  title: lessonId,
  content: '',
});

export const getProductById = (id: string) => ({
  id,
  name: id,
  description: '',
});
