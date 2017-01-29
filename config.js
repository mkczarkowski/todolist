"use strict";
var config = {}

config.host = process.env.HOST || "https://wilsonowy.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "vH0V2ErtRSW9rIahhjRUTlLWkKLdlUr9r1R2IpxR7d96VBRLO4IdeKobD4QjMDqPnN6WWFXYSpk8L9I8W5waLw==";
config.databaseId = "ToDoList";
config.collectionId = "Items";

module.exports = config;