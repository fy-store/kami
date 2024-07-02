import { CheckAuthority } from '#systemLib'

export default new CheckAuthority({
	baseURL: '/api',
	router: {
		admin: [
			{
				url: '/admin',
				method: '*',
				match: 'startWith'
			},
			{
				url: '/card',
				method: '*',
				match: 'startWith'
			}
		]
	},
	whiteList: [
		{
			method: '*',
			url: '/login',
			match: 'startWith'
		},
		{
			method: 'POST',
			url: '/logout',
			match: 'startWith'
		}
	]
})
