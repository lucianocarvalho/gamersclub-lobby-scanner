<p align="center">
    <img title="GamersClub Lobby Scanner" height="200" src="https://raw.githubusercontent.com/lucianocarvalho/gamersclub-lobby-scanner/master/logo-readme.png" />
</p>

# GamersClub Lobby Scanner

Extensão para o Google Chrome que auxilia na escolha de melhores lobbys dentro da plataforma da [GamersClub](https://gamersclub.com.br/). Atualmente ao receber convites de jogos só temos informações do KDR dos jogadores dentro da lobby.

A extensão adiciona os seguintes detalhes:
- Se o KDR do jogador é suspeito (é considerado suspeito KDR >= 1.50)
- Quantidade de amigos dentro da Steam
- Quantidade de mapas jogados no  CS:GO
- Se o perfil é privado ou não
- Quantidades de horas jogadas no CS:GO

> :warning: Esse projeto é desenvolvido pela comunidade e não tem ligação com a GamersClub.

###  Dúvidas frequentes:

- **Isso é proibido?**

Não. Todas as informações são adquiridas através da própria [Web API da Steam](https://steamcommunity.com/dev?l=portuguese). Esses dados são públicos para qualquer tipo de pessoa. Só possibilitamos a captura desses dados diretamente dentro da plataforma.

- **Por que precisamos configurar uma API Key? Isso não possibilita outras ações dentro da Steam?**

A Steam só permite a consulta de dados de usuários autenticado por uma API Key, por isso a necessidade de se gerar uma. Conforme os [Termos de Uso da Steam Web API](https://steamcommunity.com/dev/apiterms), só é possível realizar a **consulta de informações**. Fique tranquilo(a), não é possível realizar nenhuma ação externa a isso (inventário, alterações de configurações na sua conta, senha, entre outros).

## Pré-requisitos

Para a extensão poder funcionar corretamente, vamos precisar gerar uma **API Key na Steam** (uma chave de 32 caracteres). Essa chave é requisito para a Steam nos fornecer informações de consulta e será configurada dentro da extensão posteriormente.

**Como conseguir a sua API Key?** 
- Logue na steam através do seu navegador.
- Acesse: [Criar chave da Web API do Steam](https://steamcommunity.com/dev/apikey).
- Digite o seu nome, aceite os termos de uso e clique em "Registrar".

**Salve essa chave em um bloco de notas, vamos utilizá-la no passo de instalação.**

## Instalação
- Instale a extensão do Chrome normalmente através **[desse link]()**.
- Um ícone aparecerá na sua barra de extensões no canto superior direito.
- Clique nele e vá para "Opções".
- Cole a API Key que você guardou anteriormente e salve.
- **Pronto! Use essas novas informações para escolher um ótimo lobby. Bom jogo!**

## Bugs e melhorias
Todos os bugs e melhorias são organizadas aqui dentro do GitHub.

Sinta-se livre para criar uma nova [issue](https://github.com/lucianocarvalho/gamersclub-lobby-scanner/issues) ou enviar um [pull request](https://github.com/lucianocarvalho/gamersclub-lobby-scanner/pulls).

## Autor

Desenvolvido e mantido por [@lucianocarvalho](https://github.com/lucianocarvalho).