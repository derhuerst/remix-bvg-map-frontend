'use strict'

const document = require('global/document')
const createElement = require('virtual-dom/create-element')
const diff = require('virtual-dom/diff')
const patch = require('virtual-dom/patch')
const delegator = require('dom-delegator')

const positions = require('./lib/station-positions')
const fetchFromBackend = require('./lib/fetch-from-backend')
const render = require('./ui')

const id = localStorage.getItem('id')
const state = {
	id: id || null,
	secret: id && localStorage.getItem('secret:' + id) || null,
	stations: {},
	selection: {
		id: null,
		x: null,
		y: null
	},
	loading: false
}

const select = (stationId) => {
	const pos = positions[stationId]
	if (!pos) {
		console.error('unknown station ' + stationId) // todo: handle err
		return
	}
	state.selection.id = stationId
	state.selection.x = pos.x
	state.selection.y = pos.y
	rerender()
}

const map = (stationId, caption) => {
	state.stations[stationId] = caption
	state.selection.id = state.selection.x = state.selection.y = null
	rerender()
}

const read = (id) => {
	// todo: status flag
	console.info('reading remix ' + id)
	state.loading = true
	rerender()

	return fetchFromBackend(`/${id}.json`)
	.then((remix) => {
		state.loading = false
		state.stations = remix.stations || {}
		rerender()
	})
	.catch(console.error) // todo: handle err
}

const create = () => {
	// todo: status flag
	console.info('creating remix')
	state.loading = true
	rerender()

	fetchFromBackend('/', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({stations: state.stations})
	})
	.then(({id, secret}) => {
		state.loading = false
		localStorage.setItem('id', id)
		localStorage.setItem('secret:' + id, secret)
		state.id = id
		state.secret = secret
		rerender()
		write()
	})
	.catch(console.error) // todo: handle err
}

const write = () => {
	// todo: status flag
	if (!state.id) {
		console.error('unknown id. create a new remix first.') // todo: handle err
		return
	}
	if (!state.secret) {
		console.error('unknown secret.') // todo: handle err
		return
	}

	// todo: status flag
	console.info('writing remix')
	state.loading = true
	rerender()

	fetchFromBackend('/' + state.id, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-Secret': state.secret
		},
		body: JSON.stringify({stations: state.stations})
	})
	.then(() => {
		state.loading = false
		rerender()
	})
	.catch(console.error) // todo: handle err
}

const actions = {
	select,
	map,
	read,
	write,
	create
}

setTimeout(() => {
	const id = state.id || location.hash.slice(1)
	const fromRemix = !!location.hash.slice(1)
	if (!id) return null // nothing to do

	read(id).then(() => {
		if (fromRemix) location.hash = ''
	})
})

let tree = render(state, actions)
let root = createElement(tree)
document.body.appendChild(root)

delegator().listenTo('submit')

const rerender = () => {
	const newTree = render(state, actions)
	root = patch(root, diff(tree, newTree))
	tree = newTree
}
