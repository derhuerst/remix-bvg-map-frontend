'use strict'

const css = require('sheetify')
const h = require('virtual-dom/h')

const renderMap = require('./map')

const prefix = css `
:host {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

:host .bar {
	background-color: #fff;
	border-bottom: 1px solid #c0c0c0;
}

:host .map {
	overflow: scroll;
}
`

const renderForm = (state, actions) => {
	if (!state.selection.id) return null
	const id = state.selection.id
	return [
		h('input', {
			type: 'text',
			value: state.stations[id] || '',
			placeholder: 'type a name'
		}),
		h('button', {
			type: 'submit',
			'ev-click': (ev) => {
				const input = ev.target.parentNode.querySelector('input')
				actions.map(id, input.value.trim())
			}
		}, '✔︎')
	]
}

const render = (state, actions) => {
	if (state.loading) {
		return h('span', {}, 'loading some data.')
	}
	// todo: render error modal

	return h('div', {className: prefix}, [
		h('div', {className: 'bar'}, renderForm(state, actions)),
		h('div', {className: 'map'}, [
			renderMap(state, actions)
		])
	])
}

module.exports = render
