'use strict'

const css = require('sheetify')
const h = require('virtual-dom/h')
const svg = require('virtual-dom/virtual-hyperscript/svg')
const renderMap = require('bvg-topological-map/render')

const createRenderRemix = require('../lib/render-remix')

const prefix = css `
:host #stations .station {
	cursor: pointer;
}

:host #selection {
	fill: none;
	stroke-width: 3;
	stroke: #3498db;
}

:host .remix {
	font-family: sans-serif;
	font-size: 100%;
}
`

const renderSelection = (state) => {
	if (!state.selection.id) return null
	return svg('circle', {
		id: 'selection',
		r: 10,
		cx: state.selection.x,
		cy: state.selection.y
	})
}

const render = (state, actions) => {
	const rootProps = (h, opt, data) => {
		const props = renderMap.defaults.rootProps(h, opt, data)

		if (!props.class) props.class = prefix
		else props.class += ' ' + prefix
		if (!props.style) props.style = {}
		props.style.width = (data.width * 2) + 'px'
		props.style.height = (data.height * 2) + 'px'

		return props
	}
	const stationProps = (h, id, station) => {
		const props = renderMap.defaults.stationProps(h, id, station)
		props['ev-click'] = () => actions.select(id)
		return props
	}

	const renderRemix = createRenderRemix({stations: state.stations}, 'remix')
	const middleLayer = (h, opt, data) => [
		renderRemix(h, opt, data)
	]

	const topLayer = (h, opt, data) => [
		renderSelection(state)
	]

	return renderMap(svg, {
		rootProps,
		stationProps,
		middleLayer,
		topLayer
	})
}

module.exports = render
