import EditLeadPage from "@/src/components/pages/edit-lead/EditLeadPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <EditLeadPage leadId={id} />;
}
