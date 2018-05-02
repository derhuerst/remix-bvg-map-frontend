'use strict'

const positions = require('./station-positions')

const createRender = (remix, cls) => {
	const render = (h, opt, data) => {
		const res = []

		for (let id of Object.keys(remix.stations)) {
			const station = data.stations[id]
			if (!station) continue // ignore invalid IDs

			const caption = remix.stations[id]
			const right = positions[id].bbox[2]
			const top = positions[id].bbox[1]
			res.push(h('text', {
				class: cls,
				x: (right + 2).toFixed(3),
				y: top.toFixed(3)
			}, caption))
		}

		return h('g', {}, res)
	}
	return render
}

module.exports = createRender
