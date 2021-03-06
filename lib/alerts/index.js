/**
 * @file Functions for alert table.
 */

import colors from 'vuetify/es5/util/colors'
import grpcClient from '../grpc-client'

/**
 * Get alerts using gRPC.
 * @param {VisualizerAPIParam} apiParams
 * @param {number} alertLimit - Number of alerts.
 * @returns {Promise<Array<AlertData>>} - Alerts.
 */
export const getAlertsViaGRPC = async (apiParams, alertLimit) => {
  const response = await grpcClient(apiParams.grpcURIBase).getAlerts(alertLimit)
  return response.toObject().alertsList
}

/**
 * Get alerts using REST.
 * @param {VisualizerAPIParam} apiParams
 * @param {number} alertLimit - Number of alerts.
 * @returns {Promise<Array<AlertData>>} - Alerts.
 */
export const getAlertsViaREST = async (apiParams, alertLimit) => {
  const response = await fetch(
    apiParams.restURIBase + `/api/alert/${alertLimit}`
  )
  return response.json()
}

/**
 * @typedef {Object} AlertColorDefinition
 * @prop {string} severity - Severity of alert.
 * @prop {string} fill - Color for HTML 'fill' property.
 * @prop {string} text - Color for HTML 'text' property.
 */
/**
 * Table of color definitions for alerts.
 * @type {Array<AlertColorDefinition>}
 */
const colorTable = Object.freeze(
  [
    {
      severity: 'default',
      fill: colors.grey.darken1, // grey
      text: colors.grey.lighten5
    },
    {
      severity: 'disaster',
      fill: colors.red.lighten1, // bright red
      text: colors.grey.lighten5
    },
    {
      severity: 'high',
      fill: colors.red.darken4, // red
      text: colors.grey.lighten5
    },
    {
      severity: 'average',
      fill: colors.orange.lighten1, // orange
      text: colors.grey.darken4
    },
    {
      severity: 'warning',
      fill: colors.yellow.accent3, // bright yellow
      text: colors.grey.darken4
    },
    {
      severity: 'information',
      fill: colors.lightGreen.darken1, // bright green
      text: colors.grey.lighten5
    }
  ].map(d => Object.freeze(d))
)

/**
 * Find color definition for specified severity and HTML property.
 * @param {string} prop - HTML property to set the color.
 * @param {string }severity - Severity of Alert.
 * @returns {AlertColorDefinition} - Color definition.
 */
export const severityColor = (prop, severity) => {
  const findColorDefBySeverity = s =>
    colorTable.find(d => d.severity === s.toLowerCase())
  const colorDef =
    findColorDefBySeverity(severity) || findColorDefBySeverity('default')
  return colorDef[prop]
}
