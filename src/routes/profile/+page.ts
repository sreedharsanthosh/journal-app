import type { PageLoad } from '../$types';
import { supabase } from '$lib/supabaseClient';
export const load: PageLoad = async ({ params }) => {
	const { data } = await supabase.auth.getUser();

	const { data: userData, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('USER', data.user?.id);
	if (error) {
		console.log('Error found: ', error);
		return;
	}

	return {
		user: userData[0]
	};
};
