import { redirect } from '@sveltejs/kit'

export const load = async ({ fetch, url}) => {
    const query = url.searchParams.get('q');
    if (query) {
        throw redirect(307, `/search/${query}`)
    }
}