'use strict'

const document = require('global/document')
const createElement = require('virtual-dom/create-element')
const diff = require('virtual-dom/diff')
const patch = require('virtual-dom/patch')
const delegator = require('dom-delegator')

const positions = require('./lib/station-positions')
const render = require('./ui')

const state = {
	stations: {},
	selection: {
		id: null,
		x: null,
		y: null
	}
}

const select = (id) => {
	const pos = positions[id]
	if (!pos) {
		console.error('unknown station ' + id)
		return
	}
	state.selection.id = id
	state.selection.x = pos.x
	state.selection.y = pos.y
	rerender()
}

const actions = {
	select
}

let tree = render(state, actions)
let root = createElement(tree)
document.body.appendChild(root)

delegator().listenTo('submit')

const rerender = () => {
	const newTree = render(state, actions)
	root = patch(root, diff(tree, newTree))
	tree = newTree
}
