import { supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ params }) => {
	let data;
	try {
		data = await supabase.auth.getUser();
		console.log(data);
		if (!data.data.user) {
			goto('/login');
			return 0;
		}
	} catch (err) {
		console.log(err);
	}
	const loading = false;
	let { data: journals, error } = await supabase
		.from('journals')
		.select('*')
		.eq('user', data?.data.user?.id);
	const journalList = journals ?? [];
	return {
		user: data,
		journalList: journalList,
		loading: loading,
		blah: 'blah'
	};
};
