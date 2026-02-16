import { useLeads } from "../leads/use-leads"
import { useContacts } from "../contacts/use-contacts"
import { LeadStatus } from "../leads/use-leads"

export function useDashboardStats() {
  const { data: leads, isLoading: isLoadingLeads, error: leadsError } = useLeads()
  const { data: contacts, isLoading: isLoadingContacts, error: contactsError } = useContacts()

  const isLoading = isLoadingLeads || isLoadingContacts
  const error = leadsError || contactsError

  const leadList = (
    (leads as { data?: Array<{ status: LeadStatus }> } | undefined)?.data ?? []
  )
  const contactList = (
    (contacts as { data?: Array<unknown> } | undefined)?.data ?? []
  )

  const totalLeads = leadList.length
  const totalContacts = contactList.length
  const convertedLeads = leadList.filter(lead => lead.status === LeadStatus.CONVERTIDO).length
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0"

  const recentLeads = leadList.slice(0, 5)

  return {
    isLoading,
    error,
    stats: {
      totalLeads,
      totalContacts,
      convertedLeads,
      conversionRate,
    },
    recentLeads,
  }
}
