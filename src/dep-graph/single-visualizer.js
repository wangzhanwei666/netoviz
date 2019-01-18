import { select } from 'd3-selection'
const BaseContainer = require('../base')

export class SingleDepGraphVisualizer extends BaseContainer {
  constructor () {
    super()
    // canvas size
    this.width = 1500
    this.height = 800
    this.fontSize = 12
  }

  clearCanvas () {
    // clear graphs
    select('div#visualizer') // clear all graphs
      .selectAll('div.network-layer')
      .remove()
  }

  makeCanvas () {
    return select('body').select('div#visualizer')
      .append('div') // to keep compatibility with topology visualizer
      .attr('class', 'network-layer')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
  }

  makeLayerGroup () {
    return this.svg.append('g')
      .attr('class', 'layer-labels')
  }

  makeLayerLabel (graphData) {
    return this.layerLabelGroup.selectAll('text')
      .data(graphData)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + d.height / 2)
      .attr('class', 'dep layer')
      .text(d => d.name)
  }

  makeLayerObjGroup () {
    return this.svg.append('g')
      .attr('class', 'layer-objects')
  }

  makeLayerNode (layer, layerObjGroup) {
    return layerObjGroup.selectAll('rect')
      .data(layer.nodes)
      .enter()
      .append('rect')
      .attr('class', 'dep')
      .attr('id', d => d.path)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      // .append('title')
      // .text(d => d.path)
  }

  makeLayerNodeTp (layer, layerObjGroup) {
    return layerObjGroup.selectAll('circle')
      .data(layer.tps)
      .enter()
      .append('circle')
      .attr('class', 'dep')
      .attr('id', d => d.path)
      .attr('cx', d => d.cx)
      .attr('cy', d => d.cy)
      .attr('r', d => d.r)
      // .append('title')
      // .text(d => d.path)
  }

  makeLayerNodeLabel (layer, layerObjGroup) {
    return layerObjGroup.selectAll('text.node')
      .data(layer.nodes)
      .enter()
      .append('text')
      .attr('class', 'dep node')
      .attr('id', d => `${d.path}-ndlb`)
      .attr('x', d => d.x)
      .attr('y', d => d.y + d.height)
      .attr('dy', this.fontSize)
      .text(d => d.name)
  }

  makeLayerNodeTpLabel (layer, layerObjGroup) {
    return layerObjGroup.selectAll('text.tp')
      .data(layer.tps)
      .enter()
      .append('text')
      .attr('class', 'dep tp')
      .attr('id', d => `${d.path}-tplb`)
      .attr('x', d => d.cx)
      .attr('y', d => d.cy + d.r)
      .attr('dy', this.fontSize / 2)
      .text(d => d.name)
  }

  makeGraphObjects (graphData) {
    this.svg = this.makeCanvas()
    // for each layer
    this.layerLabelGroup = this.makeLayerGroup()
    this.makeLayerLabel(graphData)

    // for each node/tp
    for (const layer of graphData) {
      const layerObjGroup = this.makeLayerObjGroup()
      this.makeLayerNode(layer, layerObjGroup)
      this.makeLayerNodeTp(layer, layerObjGroup)
      this.makeLayerNodeLabel(layer, layerObjGroup)
      this.makeLayerNodeTpLabel(layer, layerObjGroup)
    }
  }
}