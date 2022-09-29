import axios from 'axios'

export const viaCepRequest = (cep) => {
  if (window.webpackHotUpdate) {
    return axios.get(`http://viacep.com.br/ws/${cep}/json/`)
  } else {
    return axios.get(`https://viacep.com.br/ws/${cep}/json/`)
  }
}
