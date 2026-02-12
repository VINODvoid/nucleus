# Contributing to Nucleus

First off, thank you for considering contributing to Nucleus! It's people like you that make Nucleus such a great tool.

## 🌟 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, React Native version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **If you've added code that should be tested, add tests**
3. **Ensure the test suite passes**
4. **Make sure your code lints**
5. **Issue that pull request!**

## 💻 Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/nucleus.git
cd nucleus

# Install dependencies
bun install

# Start development server
bun start
```

### Coding Standards

- **TypeScript**: All new code should be written in TypeScript
- **Formatting**: Use Prettier for code formatting
- **Linting**: Follow ESLint rules
- **Naming**: Use descriptive variable and function names
- **Comments**: Comment complex logic, but prefer self-documenting code

### File Organization

```typescript
// ✅ Good: Organized imports
import React from 'react'
import { View, Text } from 'react-native'
import { CustomComponent } from '@/components'
import { useCustomHook } from '@/hooks'
import { COLORS } from '@/constants'

// ❌ Bad: Disorganized imports
import { COLORS } from '@/constants'
import React from 'react'
import { useCustomHook } from '@/hooks'
```

### Component Guidelines

```typescript
// ✅ Good: Functional component with TypeScript
interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}

// ❌ Bad: No types, inconsistent naming
export function button(props) {
  return <TouchableOpacity onPress={props.onPress}>...</TouchableOpacity>
}
```

### Commit Messages

Follow conventional commits:

```
feat: add token portfolio tracking
fix: resolve balance calculation error
docs: update installation instructions
style: format code with prettier
refactor: simplify wallet connection logic
test: add unit tests for balance calculation
chore: update dependencies
```

### Branch Naming

- `feature/` - New features (e.g., `feature/token-tracking`)
- `fix/` - Bug fixes (e.g., `fix/balance-display`)
- `docs/` - Documentation (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/wallet-service`)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

### Writing Tests

```typescript
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from './Button'

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Button title="Click me" onPress={onPress} />
    )

    fireEvent.press(getByText('Click me'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
```

## 📚 Documentation

- Update README.md if you change functionality
- Add JSDoc comments for public APIs
- Update TypeScript types when changing interfaces
- Include examples for new features

## 🎨 Design Guidelines

- Follow the existing color scheme (purple accent on dark background)
- Maintain consistent spacing (use constants from theme)
- Use provided components before creating new ones
- Test on both iOS and Android

## ⚡ Performance Considerations

- Avoid unnecessary re-renders
- Use `React.memo` for expensive components
- Optimize images (compress, use appropriate formats)
- Profile before and after performance changes

## 🐛 Debugging

### Common Issues

**Metro bundler issues:**
```bash
# Clear cache
bun start --clear
# or
rm -rf node_modules && bun install
```

**iOS build issues:**
```bash
cd ios && pod install && cd ..
```

**Android build issues:**
```bash
cd android && ./gradlew clean && cd ..
```

## 📞 Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Use GitHub Issues for bug reports
- 📧 **Email**: Contact maintainers directly for sensitive issues

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributor graphs

Thank you for contributing to Nucleus! 🌌
