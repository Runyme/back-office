import moment from 'moment'

export const formatDateToEn = (date) => {
  const formatedDate = moment(date);

  return formatToEn(formatedDate);
}

export const formatToEn = (date) => {
  return date.format('YYYY-MM-DD')
}

export const formatToEnInCompetencia = (date) => {
  return date.format('YYYY-MM-01')
}

export const formatBrToEn = (date) => {
  return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
}

export const formatEnToBr = (date) => {
  return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
}

export const formatDateTimeToBr = (date) => {
  return moment(date).format('DD/MM/YYYY HH:mm')
}

export const momentIntance = (date = null) => {
  if (date) {
    return moment(date);
  }
  return moment();
}

export const formatDateToBr = (date = null) => {
  if (!date) return '--'
  return moment(date).format('DD [de] MMM [de] YYYY')
}
