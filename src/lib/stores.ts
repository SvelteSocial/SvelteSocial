import { writable } from 'svelte/store'

export const selectedPostId = writable<string | null>(null)
