'use strict'

import {Graphs} from './graphs'
import {OperationalVisualizer} from './operational-visualizer'
import * as cln from 'clone'

export class GraphVisualizer extends Graphs {
  constructor (topoData) {
    super(topoData)
  }

  drawGraphs () {
    // hand-over the operation through all layers
    // NOTICE: BIND `this`
    const callback = path => this.findGraphNodeByPath(path)
    // entry-point: draw each layer
    for (const graph of this.graphs) {
      // const singleGraphVisualizer = new OperationalVisualizer(graph, callback)
      // singleGraphVisualizer.startSimulation()

      const diffSelectedGraphs = this.selectByDiffState(graph)
      for (const graph of diffSelectedGraphs) {
        const singleGraphVisualizer = new OperationalVisualizer(graph, callback)
        singleGraphVisualizer.startSimulation()
      }
    }
  }

  selectByDiffState (graph) {
    const selectedGraphs = []
    if ('diffState' in graph && graph.diffState.detect() === 'changed') {
      const deletedGraph = this.pickGraphObjBy(graph, 'deleted')
      selectedGraphs.push(deletedGraph)
      const addedGraph = this.pickGraphObjBy(graph, 'added')
      selectedGraphs.push(addedGraph)
    } else {
      // if graph does not have diffState
      // or graph has diffState that is added/deleted/kept.
      selectedGraphs.push(graph)
    }
    return selectedGraphs
  }

  pickGraphObjBy (graph, pickState) {
    let dupGraph = cln.clonePrototype(graph) // copy (deep clone with prototype)
    const pickStates = ['changed', 'kept', pickState]
    // pick-up node/link objects
    const nodes = graph.nodes.filter(
      node => pickStates.includes(node.diffState.detect())
    )
    const links = graph.links.filter(
      link => pickStates.includes(link.diffState.detect())
    )
    // set nodes/links and return graph object
    dupGraph.nodes = nodes
    dupGraph.links = links
    return dupGraph
  }
}
