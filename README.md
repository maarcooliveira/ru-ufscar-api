# API RU UFSCar Sorocaba

Esta é uma API simples para acessar o [cardápio](http://sorocaba.ufscar.br/ufscar/?cardapio) do restaurante universitário da **UFSCar Sorocaba**.

### Uso
A URL principal é [ru-ufscar-api.herokuapp.com/api](http://ru-ufscar-api.herokuapp.com/api/) e os endpoints disponíveis são [/thisweek](http://ru-ufscar-api.herokuapp.com/api/thisweek) e [/today](http://ru-ufscar-api.herokuapp.com/api/today), que oferecem o cardápio da semana e do dia, respectivamente.

### Resposta
As respostas são em JSON e contém um array `menu`. O objeto menu será null e haverá uma string `message` informando quando houver um erro na API ou se o cardápio ainda não foi atualizado. Cada objeto do array menu tem dados sobre o cardápio, denominados `principal`, `guarnicao`, `salada`, `sobremesa`, `principalVegetariano`, `guarnicaoVegetariano`, `data` e `almoco` (indica se aquela refeição se refere ao almoço).

### Mas funciona mesmo?
Considerando que a estrutura da página do cardápio não seja alterada, tudo deve dar certo. Como a UFSCar nem sempre atualiza o cardápio, update.js é executado com o Scheduler do Heroku e checa o site a cada hora para conferir se está tudo atualizado.

### Seu próprio servidor
Se quiser fazer o deploy da API em outro servidor, utilize o link para o seu banco de dados como uma variável de ambiente. Por exemplo, para rodar localmente utilize:

```sh
DB_LINK='mongodb://<user>:<password>@linktoyour.mongolab.com:xxxx/database' node server.js
```
Se estiver usando heroku, basta adicionar a variável:

```sh
$ heroku config:add DB_LINK=mongodb://<user>:<password>@linktoyour.mongolab.com:xxxx/database
```
