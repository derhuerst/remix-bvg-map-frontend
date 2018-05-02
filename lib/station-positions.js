'use strict'

const {stations} = require('bvg-topological-map')
const bounds = require('svg-path-bounds')

const positions = Object.create(null)

const t = Date.now()
for (let id of Object.keys(stations)) {
	const bbox = bounds(stations[id].shape)
	const [left, top, right, bottom] = bbox
	positions[id] = {
		x: +(left + (right - left) / 2).toFixed(2),
		y: +(top + (bottom - top) / 2).toFixed(2),
		bbox
	}
}

module.exports = positions
