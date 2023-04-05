let moment = require('moment')
let {de} = require('moment/locale/de-at')
moment.locale(de)

export let translate = (input: string): string => {
  if (input === 'day') return 'Tag'
  if (input === 'days') return 'Tage'
  if (input === 'week') return 'Woche'
  if (input === 'weeks') return 'Wochen'
  if (input === 'month') return 'Monat'
  if (input === 'months') return 'Monate'
  if (input === 'year') return 'Jahr'
  if (input === 'years') return 'Jahre'

  return input
}

export let translateFileUpload = (length: number): string => {
  return `${length} ${length === 1 ? 'Datei' : 'Dateien'} hochgeladen`
}

export let translateStripe = (input: string): string => {
  if (input === 'active') return 'Aktiv'
  if (input === 'canceled') return 'Gekündigt'
  if (input === 'unpaid') return 'Bezahlung ausstehend'

  return input 
}

export let tsToDate = (ts: number | undefined): string => {
  if (!ts) return ''
  try {
    return moment(ts).format('DD.MM.YYYY')
  } catch {
    return 'FEHLER'
  }
}

export let tsToDateTime = (ts: number | undefined): string => {
  if (!ts) return ''
  try {
    let string = moment(ts).format('DD.MM.YYYY HH:mm:ss')
    return `${string.split(' ')[0]}, ${string.split(' ')[1]}`
  } catch {
    return 'FEHLER'
  }
}

export let tsDiffDaysToToday = (ts: number): number | null => {
  try {
    let today = moment().startOf('day')
    let diff = moment(ts).diff(today, 'days', true)

    diff = Math.round(diff)

    return diff
  } catch {
    return null
  }
}

export let getTimeDiffString = (ts: number): string => {
  try {
    let diff: number | null = tsDiffDaysToToday(ts)

    if (!diff && diff !== 0) return 'FEHLER'

    if (diff === 0) return 'heute' 
    else if (diff === 1) return 'in einem Tag'
    else if (diff > 1) return `in ${diff} Tagen`
    else if (diff === -1) return `vor einem Tag`
    else if (diff < -1) return `vor ${diff*-1} Tagen`

    return 'FEHLER'
  } catch { return 'FEHLER'}
}