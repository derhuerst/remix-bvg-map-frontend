'use strict'

const css = require('sheetify')
const h = require('virtual-dom/h')
const renderLoader = require('virtual-loading-dots').render

const renderMap = require('./map')

const prefix = css `
:host {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

:host .bar {
	position: relative;
	padding: .3rem .5rem;
	min-height: 3rem;
	background-color: #fff;
	border-bottom: 1px solid #c0c0c0;
}

:host .map {
	overflow: scroll;
}

:host .remix-id {
	display: inline-block;
}

:host .loader {
	position: absolute;
	top: 1rem;
	left: 50%;
	width: 3rem;
	height: 1rem;
}
`

const renderForm = (state, actions) => {
	if (!state.selection.id) return null
	const id = state.selection.id
	return h('div', {}, [
		h('input', {
			type: 'text',
			value: state.stations[id] || '',
			placeholder: 'type a name',
			autofocus: true
		}),
		h('button', {
			type: 'submit',
			'ev-click': (ev) => {
				const input = ev.target.parentNode.querySelector('input')
				actions.map(id, input.value.trim())
			}
		}, '✔︎')
	])
}

const loader = renderLoader(h, {color: '#777'})

const render = (state, actions) => {
	// todo: render error modal

	let idLabel = null
	if (state.id) {
		idLabel = h('code', {className: 'remix-id'}, state.id)
	}

	let loadingIndicator = null
	if (state.loading) {
		loadingIndicator = h('div', {className: 'loader'}, [loader])
	}

	const saveBtn = h('button', {
		type: 'submit',
		disabled: state.loading,
		'ev-click': state.id && state.secret
			? () => actions.write()
			: () => actions.create()
	}, state.id && state.secret ? 'save changes' : 'create remix')

	let previewBtn = null
	if (state.id) {
		previewBtn = h('a', {
			className: 'button',
			href: `/${state.id}.svg`
		}, 'preview')
	}

	return h('div', {className: prefix}, [
		h('div', {className: 'bar'}, [
			renderForm(state, actions),
			idLabel,
			loadingIndicator,
			saveBtn,
			previewBtn,
		]),
		h('div', {className: 'map'}, [
			renderMap(state, actions)
		])
	])
}

module.exports = render
