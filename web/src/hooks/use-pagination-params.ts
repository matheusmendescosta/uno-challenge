"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useMemo } from "react"

export interface PaginationParams {
  page: number
  limit: number
  search: string
}

export interface UsePaginationParamsOptions {
  defaultLimit?: number
}

export function usePaginationParams(options: UsePaginationParamsOptions = {}) {
  const { defaultLimit = 10 } = options
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const params = useMemo<PaginationParams>(() => {
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || String(defaultLimit), 10)
    const search = searchParams.get("search") || ""

    return {
      page: isNaN(page) || page < 1 ? 1 : page,
      limit: isNaN(limit) || limit < 1 ? defaultLimit : limit,
      search,
    }
  }, [searchParams, defaultLimit])

  const updateParams = useCallback(
    (updates: Partial<PaginationParams>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      if (updates.page !== undefined) {
        if (updates.page === 1) {
          newParams.delete("page")
        } else {
          newParams.set("page", String(updates.page))
        }
      }

      if (updates.limit !== undefined) {
        if (updates.limit === defaultLimit) {
          newParams.delete("limit")
        } else {
          newParams.set("limit", String(updates.limit))
        }
      }

      if (updates.search !== undefined) {
        if (updates.search === "") {
          newParams.delete("search")
        } else {
          newParams.set("search", updates.search)
        }
        // Reset to page 1 when search changes
        newParams.delete("page")
      }

      const queryString = newParams.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    },
    [searchParams, router, pathname, defaultLimit]
  )

  const setPage = useCallback(
    (page: number) => updateParams({ page }),
    [updateParams]
  )

  const setLimit = useCallback(
    (limit: number) => {
      const newParams = new URLSearchParams(searchParams.toString())
      if (limit === defaultLimit) {
        newParams.delete("limit")
      } else {
        newParams.set("limit", String(limit))
      }
      newParams.delete("page") // Reset to page 1 when limit changes
      const queryString = newParams.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    },
    [searchParams, router, pathname, defaultLimit]
  )

  const setSearch = useCallback(
    (search: string) => updateParams({ search }),
    [updateParams]
  )

  const resetParams = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  return {
    ...params,
    setPage,
    setLimit,
    setSearch,
    updateParams,
    resetParams,
  }
}
