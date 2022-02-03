# Cards Against Humanity NodeJS Server

A NodeJS server to handle an arbitrary number of Cards Against Humanity games. This project is currently a work in progress and may continue to see updates dependent on time available to work on the project. This project pairs with a C++ client to communicate with the server. See the C++ client for related code: ([Github Link](https://github.com/Squirrelbear/CardsAgainstHumanityCPPCLIClient)).

The server processes commands via query data eg:</br>
localhost:3000?action=createPlayer&playerName=Peter</br>

The schema validator file defines all expected types of commands.

# Other creators incorporated content
* nlohmann's json C++ library (using version 3.10.5): ([GitHub Source](https://github.com/nlohmann/json))
* Cards Against Humanity card data: ([GitHub Source](https://github.com/samurailink3/hangouts-against-humanity))

This project is triple-licensed under the [AGPLv3(or any later version)](http://www.gnu.org/licenses/agpl-3.0.html) and [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US) for the card data and MIT for nlohmann's json library and my own work.
