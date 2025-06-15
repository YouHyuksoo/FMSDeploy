// Navigation types
export interface MainNavItem {
  title: string
  href: string
  disabled?: boolean
  icon?: React.ReactNode
  items?: MainNavItem[]
  description?: string
  requiredPermissions?: string[]
  external?: boolean
}

// Add other common types that might be used across the application

// Re-export other type files if needed
export * from './equipment';
export * from './user';
// Add other exports as needed
