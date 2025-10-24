# Unit Testing Guidelines for Dashboard Package

## 🎯 Testing Focus Areas

### Critical Functionality Priority
- **Business Logic**: Hooks, utility functions, data transformations
- **User Interactions**: Component behavior, form handling, navigation
- **API Integration**: Data fetching, error handling, loading states
- **State Management**: Context providers, state updates, side effects

### What NOT to Test
- Third-party library internals (Radix UI, React Query)
- Styling and CSS (visual regression tests are separate)
- Next.js framework behavior
- Simple prop passing without logic

## 🛠️ Testing Tools & Setup

### Core Testing Stack
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **Custom Test Utils**: Provider wrappers and helpers

### MSW Configuration
```typescript
import { createK8sTestHandlers } from '@/__mocks__/handlers'

const testHandlers = createK8sTestHandlers({
  deployments: mockDeployments,
  namespaces: mockNamespaces
})
```

## 📋 Testing Patterns

### 1. Hook Testing Pattern
```typescript
describe('useDeployments', () => {
  it('should fetch deployments successfully', async () => {
    // Arrange: Setup MSW handlers
    // Act: Call hook
    // Assert: Verify data and loading states
  })
})
```

### 2. Component Testing Pattern
```typescript
describe('DashboardLayout', () => {
  it('should render navigation when user is authenticated', () => {
    // Arrange: Mock user context
    // Act: Render component
    // Assert: Verify UI elements
  })
})
```

### 3. API Integration Pattern
```typescript
describe('API Integration', () => {
  it('should handle network errors gracefully', async () => {
    // Arrange: Mock network error
    // Act: Trigger API call
    // Assert: Verify error handling
  })
})
```

## 🔧 核心測試原則 (Core Testing Principles)

### 1. **測試實際功能，不是存在性 (Test Functionality, Not Existence)**

#### ❌ 避免只測試存在性
```typescript
// 錯誤：只測試元素存在
it('should render delete button', () => {
  render(<Component />)
  expect(screen.getByRole('button')).toBeInTheDocument() // 只測試存在
})
```

#### ✅ 測試完整功能流程
```typescript
// 正確：測試完整的用戶交互
it('should delete item when delete button is clicked', async () => {
  const user = userEvent.setup()
  const onDelete = jest.fn()
  
  render(<Component onDelete={onDelete} />)
  
  await user.click(screen.getByRole('button', { name: /delete/i }))
  expect(onDelete).toHaveBeenCalledWith(expectedData)
})
```

### 2. **使用正確的測試工具**

```typescript
// 使用自定義 render 包含所有 providers
import { render, screen } from '@/__tests__/utils/test-utils'

// 使用 MSW 模擬 API
import { server } from '@/__mocks__/server'

// 正確處理異步操作
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

### 3. **測試用戶工作流程**

```typescript
// 測試完整的用戶操作流程
it('should create deployment with form validation', async () => {
  const user = userEvent.setup()
  const onSubmit = jest.fn()
  
  render(<CreateDeploymentForm onSubmit={onSubmit} />)
  
  // 填寫表單
  await user.type(screen.getByLabelText(/name/i), 'test-deployment')
  await user.click(screen.getByRole('button', { name: /create/i }))
  
  // 驗證結果
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'test-deployment'
  })
})
```

**核心規則總結：**
- 🎯 **測試行為，不是渲染** - 專注於用戶交互和業務邏輯
- 🔄 **測試完整流程** - 從用戶操作到結果驗證
- 🛠️ **使用正確工具** - MSW、自定義render、waitFor
- 📝 **測試名稱要準確** - 描述實際測試的功能

## 📊 測試覆蓋率目標

- **Hooks**: 80%+ 覆蓋率
- **Components**: 80%+ 覆蓋率  
- **Utils**: 80%+ 覆蓋率

## 🚨 必須測試的錯誤場景

```typescript
// 測試 API 錯誤處理
it('should handle API errors gracefully', async () => {
  server.use(
    http.get('/api/deployments', () => 
      HttpResponse.json({ error: 'Server Error' }, { status: 500 })
    )
  )
  
  const { result } = renderHook(() => useDeployments())
  
  await waitFor(() => {
    expect(result.current.isError).toBe(true)
  })
})
```

## 📋 提交前檢查清單

- [ ] 所有測試通過 (`npm test`)
- [ ] 覆蓋率達標 (`npm run test:coverage`)
- [ ] 測試實際功能，不是存在性
- [ ] 錯誤場景已覆蓋
- [ ] 用戶交互流程已測試