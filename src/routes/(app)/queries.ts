import { page } from '$app/stores'
import { trpc } from '$lib/trpc/client'
import type { PageUser } from '$lib/types'
import { createQuery } from '@tanstack/svelte-query'
import { get } from 'svelte/store'

export function userQuery(
  {
    userId,
    username,
  }: {
    userId: string
    username: string
  },
  initialData?: PageUser
) {
  const params = {
    queryKey: ['user', userId],
    queryFn: () => trpc(get(page)).user.get.query({ username }),
  }
  if (initialData) {
    return createQuery({
      queryKey: ['user', userId],
      queryFn: () => trpc(get(page)).user.get.query({ username }),
    })
  } else {
    return createQuery({
      queryKey: ['user', userId],
      queryFn: () => trpc(get(page)).user.get.query({ username }),
      initialData,
    })
  }
}
