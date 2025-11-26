// src/lib/hooks/use-uploads.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadsApi } from '@/lib/api/endpoints/upload'

export function useUploads(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['uploads', params],
    queryFn: () => uploadsApi.getAll(params),
  })
}

export function useUploadsByUser(userId: string) {
  return useQuery({
    queryKey: ['uploads', 'user', userId],
    queryFn: () => uploadsApi.getByUserId(userId),
    enabled: !!userId,
  })
}

export function useUploadsByEntity(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ['uploads', 'entity', entityType, entityId],
    queryFn: () => uploadsApi.getByEntity(entityType, entityId),
    enabled: !!(entityType && entityId),
  })
}

export function useUpload(id: string) {
  return useQuery({
    queryKey: ['upload', id],
    queryFn: () => uploadsApi.getById(id),
    enabled: !!id,
  })
}

export function useUploadFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => uploadsApi.uploadFile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] })
    },
  })
}

export function useUploadFiles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => uploadsApi.uploadFiles(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] })
    },
  })
}

export function useDeleteUpload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => uploadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] })
    },
  })
}