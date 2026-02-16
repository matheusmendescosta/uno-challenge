import { useLeads } from "../leads/use-leads"
import { useContacts } from "../contacts/use-contacts"
import { LeadStatus } from "../leads/use-leads"

export function useDashboardStats() {
  const { data: leads, isLoading: isLoadingLeads, error: leadsError } = useLeads()
  const { data: contacts, isLoading: isLoadingContacts, error: contactsError } = useContacts()

  const isLoading = isLoadingLeads || isLoadingContacts
  const error = leadsError || contactsError

  const totalLeads = leads?.length ?? 0
  const totalContacts = contacts?.length ?? 0
  const convertedLeads = leads?.filter(lead => lead.status === LeadStatus.CONVERTIDO).length ?? 0
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0"

  const recentLeads = leads?.slice(0, 5) ?? []

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
