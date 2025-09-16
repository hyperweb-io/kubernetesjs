import { NavLinkKeys, navLinks } from '@/data/header';
import { ProductId } from '@/data/products';

type BaseRoutes = {
	[K in NavLinkKeys]: string;
} & {
	home: string;
};

export const useRoutes = () => {
	const _navRoutes = Object.entries(navLinks)
		.map(([key, { href }]) => ({ key, href }))
		.reduce((acc, { key, href }) => ({ ...acc, [key]: href }), {} as { [K in NavLinkKeys]: string });

	const baseRoutes: BaseRoutes = {
		..._navRoutes,
		home: '/',
	};

	const getProductRoute = (productId: ProductId) => `${baseRoutes.stack}/${productId}`;

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
