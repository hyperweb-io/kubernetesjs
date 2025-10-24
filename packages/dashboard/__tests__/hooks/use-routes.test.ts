import { renderHook } from '@testing-library/react'
import { useRoutes } from '../../hooks/use-routes'

describe('useRoutes', () => {
  it('should return base routes', () => {
    const { result } = renderHook(() => useRoutes())

    expect(result.current.baseRoutes).toEqual({
      home: '/',
      stack: '/stack',
      learn: '/learn',
      blog: '/blog',
      docs: '/docs'
    })
  })

  it('should return route generator functions', () => {
    const { result } = renderHook(() => useRoutes())

    expect(typeof result.current.getProductRoute).toBe('function')
    expect(typeof result.current.getCourseRoute).toBe('function')
    expect(typeof result.current.getLessonRoute).toBe('function')
    expect(typeof result.current.getPostRoute).toBe('function')
  })

  it('should generate product route correctly', () => {
    const { result } = renderHook(() => useRoutes())

    const productRoute = result.current.getProductRoute('my-product')
    expect(productRoute).toBe('/stack/my-product')
  })

  it('should generate course route correctly', () => {
    const { result } = renderHook(() => useRoutes())

    const courseRoute = result.current.getCourseRoute('react-course')
    expect(courseRoute).toBe('/learn/react-course')
  })

  it('should generate lesson route correctly', () => {
    const { result } = renderHook(() => useRoutes())

    const lessonRoute = result.current.getLessonRoute('react-course', 'lesson-1')
    expect(lessonRoute).toBe('/learn/react-course/lesson-1')
  })

  it('should generate post route correctly', () => {
    const { result } = renderHook(() => useRoutes())

    const postRoute = result.current.getPostRoute('my-blog-post')
    expect(postRoute).toBe('/blog/my-blog-post')
  })

  it('should handle empty strings in route generation', () => {
    const { result } = renderHook(() => useRoutes())

    expect(result.current.getProductRoute('')).toBe('/stack/')
    expect(result.current.getCourseRoute('')).toBe('/learn/')
    expect(result.current.getLessonRoute('', '')).toBe('/learn//')
    expect(result.current.getPostRoute('')).toBe('/blog/')
  })

  it('should handle special characters in route generation', () => {
    const { result } = renderHook(() => useRoutes())

    expect(result.current.getProductRoute('my-product-123')).toBe('/stack/my-product-123')
    expect(result.current.getCourseRoute('react-course_v2')).toBe('/learn/react-course_v2')
    expect(result.current.getLessonRoute('react-course', 'lesson-1-intro')).toBe('/learn/react-course/lesson-1-intro')
    expect(result.current.getPostRoute('my-blog-post-2024')).toBe('/blog/my-blog-post-2024')
  })

  it('should maintain consistent function behavior across renders', () => {
    const { result, rerender } = renderHook(() => useRoutes())

    const firstRender = {
      getProductRoute: result.current.getProductRoute,
      getCourseRoute: result.current.getCourseRoute,
      getLessonRoute: result.current.getLessonRoute,
      getPostRoute: result.current.getPostRoute
    }

    rerender()

    const secondRender = {
      getProductRoute: result.current.getProductRoute,
      getCourseRoute: result.current.getCourseRoute,
      getLessonRoute: result.current.getLessonRoute,
      getPostRoute: result.current.getPostRoute
    }

    // Functions should behave the same way
    expect(firstRender.getProductRoute('test')).toBe(secondRender.getProductRoute('test'))
    expect(firstRender.getCourseRoute('test')).toBe(secondRender.getCourseRoute('test'))
    expect(firstRender.getLessonRoute('test', 'lesson')).toBe(secondRender.getLessonRoute('test', 'lesson'))
    expect(firstRender.getPostRoute('test')).toBe(secondRender.getPostRoute('test'))
  })

  it('should maintain consistent base routes across renders', () => {
    const { result, rerender } = renderHook(() => useRoutes())

    const firstBaseRoutes = result.current.baseRoutes
    rerender()
    const secondBaseRoutes = result.current.baseRoutes

    expect(firstBaseRoutes).toStrictEqual(secondBaseRoutes)
  })

  it('should work with different parameter combinations', () => {
    const { result } = renderHook(() => useRoutes())

    // Test various parameter combinations
    expect(result.current.getProductRoute('product-1')).toBe('/stack/product-1')
    expect(result.current.getProductRoute('product-2')).toBe('/stack/product-2')
    
    expect(result.current.getCourseRoute('course-a')).toBe('/learn/course-a')
    expect(result.current.getCourseRoute('course-b')).toBe('/learn/course-b')
    
    expect(result.current.getLessonRoute('course-a', 'lesson-1')).toBe('/learn/course-a/lesson-1')
    expect(result.current.getLessonRoute('course-b', 'lesson-2')).toBe('/learn/course-b/lesson-2')
    
    expect(result.current.getPostRoute('post-1')).toBe('/blog/post-1')
    expect(result.current.getPostRoute('post-2')).toBe('/blog/post-2')
  })
})
