import dynamic from 'next/dynamic'

const CreateClientPage = dynamic(() => import('./client-page'), { ssr: false })

export default function CreatePage() {
  return <CreateClientPage />
} 