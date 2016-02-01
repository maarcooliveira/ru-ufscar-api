# API RU UFSCar Sorocaba

Esta é uma API simples para acessar o [cardápio](http://sorocaba.ufscar.br/ufscar/?cardapio) do restaurante universitário da **UFSCar Sorocaba**.

### Uso
A URL principal é [ru-ufscar-api.herokuapp.com/api](http://ru-ufscar-api.herokuapp.com/api/) e os endpoints disponíveis são [/semana](http://ru-ufscar-api.herokuapp.com/api/semana) e [/hoje](http://ru-ufscar-api.herokuapp.com/api/hoje), que oferecem o cardápio da semana e do dia, respectivamente.

Você também pode pedir dados de uma refeição específica do dia utilizando [/hoje/almoco](http://ru-ufscar-api.herokuapp.com/api/hoje/almoco) e [/hoje/jantar](http://ru-ufscar-api.herokuapp.com/api/hoje/jantar)

### Respostas
As respostas são em JSON e contém um array `cardapio`. A string `info` trará as mensagens `erro`, `indisponível` ou `ok`, indicando se a requisição não foi completada por um problema na API, se o cardápio requisitado ainda não foi disponibilizado no site da UFSCar ou se os dados foram enviados no array `cardapio`, respectivamente. Cada objeto do array de cardápios tem os seguintes dados: `principal`, `guarnicao`, `salada`, `sobremesa`, `principalVegetariano`, `guarnicaoVegetariano`, `data` e `refeicao`, que pode receber os valores `almoco` ou `jantar`.

### E funciona mesmo?
Considerando que a estrutura da página do cardápio não seja alterada, tudo deve dar certo. Como a UFSCar nem sempre atualiza o cardápio, update.js é executado com o Scheduler do Heroku e verifica o site a cada hora para conferir se está tudo atualizado.

### Seu próprio servidor
Se quiser fazer o deploy da API em outro servidor, utilize o link para o seu banco de dados como uma variável de ambiente. Por exemplo, para rodar localmente utilize:

```sh
DB_LINK='mongodb://<user>:<password>@linktoyour.mongolab.com:xxxx/database' node server.js
```
Se estiver usando heroku, basta adicionar a variável:

```sh
$ heroku config:add DB_LINK=mongodb://<user>:<password>@linktoyour.mongolab.com:xxxx/database
```
