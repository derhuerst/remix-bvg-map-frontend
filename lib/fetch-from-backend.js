'use strict'

const fetchFromBackend = (path, opt = {}) => {
	opt = Object.assign({
		method: 'GET',
		headers: {},
		redirect: 'manual'
	}, opt)
	opt.headers = Object.assign({
		Accept: 'application/json'
	}, opt.headers)

	return fetch(path, opt)
	.then((res) => {
		if (res.ok) return res.json()

		const cType = res.headers && res.headers.get('Content-Type') || null
		if (cType && cType.toLowerCase() === 'application/json') {
			return res.json().then(({msg}) => {
				const err = new Error(msg)
				err.res = res
				throw err
			})
		} else {
			const err = new Error(res.statusText)
			err.res = res
			throw err
		}
	})
}

module.exports = fetchFromBackend
