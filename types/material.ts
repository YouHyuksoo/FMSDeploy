export interface Material {
  id: string
  code: string
  name: string
  specification: string
  unit: string
  category: string
  manufacturer: string
  price: number
  stockQuantity: number
  safetyStock: number
  location: string
  status: "active" | "inactive" | "discontinued"
  createdAt?: Date
  updatedAt?: Date
  imageUrls?: string[]
}

export interface MaterialStock {
  id: string
  materialId: string
  warehouseId: string
  quantity: number
  location: string
  updatedAt: Date
}

export interface MaterialTransaction {
  id: string
  materialId: string
  transactionType: "in" | "out"
  quantity: number
  warehouseId: string
  requesterId: string
  approverId?: string
  reason: string
  relatedEquipmentId?: string
  transactionDate: Date
}

export interface Warehouse {
  id: string
  name: string
  location: string
  description?: string
  isActive: boolean
}
