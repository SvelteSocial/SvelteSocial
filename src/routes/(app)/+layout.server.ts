export async function load({ locals }) {
  const session = await locals.getSession()
  const localUser = session?.user
  if (!localUser) return {}
  return { localUser }
}
