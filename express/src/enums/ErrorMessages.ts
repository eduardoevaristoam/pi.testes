enum ErrorMessages {
  Nome = "É necessário informar um nome, de tipo string.",
  NomeMinLength = "'nome' deve ter pelo menos 1 caracter.",
  Intervalo = "É necessário informar um intevalo, de tipo number",
  IntervaloMinLength = "'intervalo' deve ser pelo menos 1",
  IdPlaylistMinLength = "'idPlaylist' deve ser pelo menos 1",
  IdParameter = "É necessário informar o id da playlist nos parâmetros",
  UUID = "É necessário informar um UUID válido",
  MediaQuery = "'page' e 'limit' devem ser números e maiores do que 0",
}

export default ErrorMessages;
