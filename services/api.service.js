"use strict";

const ApiGateway = require("moleculer-web");

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [{
			path: "/api",

			authorization: true,

			aliases: {
				"GET /transactions/hello": "transactions.hello",
				"POST /transactions/create": "transactions.create",
				"GET /transactions/list": "transactions.list",
				"GET /payables/balance": "payables.balance",
			},

			// Disable to call not-mapped actions
			mappingPolicy: "restrict",

			// Set CORS headers
			//cors: true,

			// Parse body content
			bodyParsers: {
				json: {
					strict: false
				},
				urlencoded: {
					extended: false
				}
			}
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public"
		}
	}
};
