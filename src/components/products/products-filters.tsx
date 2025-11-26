'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/lable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CATEGORIES } from '@/lib/constants'

interface ProductFiltersProps {
  search: string
  category: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function ProductFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps) {
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end">
      {/* Search */}
      <div className="flex-1">
        <Label htmlFor="search">Search Products</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-[200px]">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger id="category" className="mt-2">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* More Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Products</SheetTitle>
            <SheetDescription>
              Apply additional filters to refine your search
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="min-price">Minimum Price</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="max-price">Maximum Price</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="1000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button className="w-full">Apply Filters</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}