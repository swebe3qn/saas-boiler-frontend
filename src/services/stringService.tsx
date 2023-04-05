export let timestampToDate = (ts: string): string => {
  try {
    const dataOptions = {timeZone: 'Europe/Vienna'}
    const timeOptions = {timeZone: 'Europe/Vienna', hour: '2-digit', minute:'2-digit'}

    // @ts-ignore
    return `${new Date(Number(ts)).toLocaleDateString('de-DE', dataOptions)} ${new Date(Number(ts)).toLocaleTimeString('de-DE', timeOptions)}`
  } catch {
    return ts
  }
}