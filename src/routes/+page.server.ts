import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const user = await supabase.auth.getUser();

	if (!user.data.user) {
		throw redirect(303, '/login');
	}
	const { data: userData, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('USER', user.data.user?.id);
}
