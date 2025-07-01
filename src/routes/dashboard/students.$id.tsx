import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/students/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/students/$id"!</div>
}
