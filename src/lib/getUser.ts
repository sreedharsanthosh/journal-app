import { supabase } from './supabaseClient';

async function getUser() {
	const data = await supabase.auth.getUser();
	const { data: userData, error: userError } = await supabase
		.from('profiles')
		.select('*')
		.eq('USER', data.data.user?.id);
	const user = userData ? userData[0] : null;
	let { data: journals, error } = await supabase
		.from('journals')
		.select('*')
		.eq('user', data.data.user?.id);
	const journalList = journals ?? [];

	return { user, journalList };
}

export default getUser;
