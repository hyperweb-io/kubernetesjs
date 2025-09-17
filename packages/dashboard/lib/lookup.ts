import avatars from '@/data/company/avatars.json';
import members from '@/data/company/team-members.json';
import { courses } from '@/data/courses/courses';
import { ProductId, products } from '@/data/products';

export const getAuthorAvatarUrl = (githubId: string) => {
	const avatarUrl = avatars[githubId as keyof typeof avatars];
	if (!avatarUrl) {
		throw new Error(`Author avatar not found for githubId: ${githubId}`);
	}
	return avatarUrl;
};

export const getAuthorName = (githubId: string) => {
	const found = members.find((a) => a.githubId === githubId);
	if (!found) {
		throw new Error(`Author name not found for githubId: ${githubId}`);
	}
	const authorName = found?.name ?? found?.githubId;
	return authorName;
};

export const getCourseByLessonId = (lessonId: string) => {
	const course = courses.find(({ lessons }) => lessons.some(({ id }) => lessonId === id));
	if (!course) {
		throw new Error(`No course found for lessonId: ${lessonId}`);
	}
	return course;
};

export const getLessonById = (lessonId: string) => {
	const course = getCourseByLessonId(lessonId);
	const lesson = course.lessons.find(({ id }) => lessonId === id);
	if (!lesson) {
		throw new Error(`No lesson found for lessonId: ${lessonId}`);
	}
	return lesson;
};

export const getProductById = (id: ProductId) => {
	const product = products.find((p) => p.id === id);
	if (!product) {
		throw new Error(`No product found for id: ${id}`);
	}
	return product;
};
