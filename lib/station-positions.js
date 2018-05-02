'use strict'

const {stations} = require('bvg-topological-map')
const bounds = require('svg-path-bounds')

const positions = Object.create(null)

const t = Date.now()
for (let id of Object.keys(stations)) {
	const [left, top, right, bottom] = bounds(stations[id].shape)
	positions[id] = {
		x: +(left + (right - left) / 2).toFixed(2),
		y: +(top + (bottom - top) / 2).toFixed(2)
	}
}

module.exports = positions
