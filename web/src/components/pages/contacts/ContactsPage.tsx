"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Pagination } from "@/src/components/ui/pagination"
import { Skeleton } from "@/src/components/ui/skeleton"
import { usePaginationParams } from "@/src/hooks/use-pagination-params"
import { useContacts } from "./use-contacts"
import { useDebouncedCallback } from "use-debounce"

const ContactsPage = () => {
  const { page, limit, search, setPage, setLimit, setSearch } = usePaginationParams()
  const [searchInput, setSearchInput] = useState(search)

  const { data, isLoading, error } = useContacts({
    page,
    limit,
    search: search || undefined,
  })

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value)
  }, 300)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    debouncedSearch(value)
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contatos</CardTitle>
          <CardDescription>Lista de todos os contatos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar contatos: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contatos</CardTitle>
        <CardDescription>Lista de todos os contatos cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhum contato encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {data && data.totalPages > 0 && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                limit={data.limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ContactsPage
