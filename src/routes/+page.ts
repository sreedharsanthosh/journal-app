import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	let data;
	try {
		data = await supabase.auth.getUser();
		console.log(data);
		if (!data.data.user) {
			redirect(307, '/login');
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
