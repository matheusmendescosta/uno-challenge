import EditContactPage from "@/src/components/pages/edit-contact/EditContactPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <EditContactPage contactId={id} />;
}
