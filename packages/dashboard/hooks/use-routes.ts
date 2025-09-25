export type BaseRoutes = {
  home: string;
  stack: string;
  learn: string;
  blog: string;
  docs: string;
};

export const useRoutes = () => {
  const baseRoutes: BaseRoutes = {
    home: '/',
    stack: '/stack',
    learn: '/learn',
    blog: '/blog',
    docs: '/docs'
  };

  const getProductRoute = (productId: string) => `${baseRoutes.stack}/${productId}`;
  const getCourseRoute = (courseId: string) => `${baseRoutes.learn}/${courseId}`;
  const getLessonRoute = (courseId: string, lessonId: string) => `${baseRoutes.learn}/${courseId}/${lessonId}`;
  const getPostRoute = (postId: string) => `${baseRoutes.blog}/${postId}`;

  return {
    baseRoutes,
    getProductRoute,
    getCourseRoute,
    getLessonRoute,
    getPostRoute,
  };
};

