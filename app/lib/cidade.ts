/**
 * A cidade em que o produto começa.
 *
 * Mora aqui, e não em literal por tela, porque a home e a listagem precisam
 * concordar: se uma delas mudasse sozinha, quem buscasse na home cairia numa
 * listagem de outra cidade sem entender por quê.
 *
 * É padrão, não trava: em /imoveis a pessoa troca a cidade, e apagar o campo
 * devolve o acervo inteiro.
 */
export const CIDADE_PADRAO = "João Pessoa";
