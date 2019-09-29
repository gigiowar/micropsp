"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "payables",
	mixins: [
		DbService("payables"),
		CacheCleanerMixin([
			"cache.clean.payables",
		])
	],
	/**
	 * Service settings
	 */
	settings: {

	},

	/**
	 * Service dependencies
	 */
	dependencies: [],	

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
		hello() {
			return "Hello payables";
		},

		/**
		 * Create a new payable.
		 *
		 * @actions
		 * @param {Object} transaction - transaction entity
		 *
		 * @returns {Object} Created entity
		 */
		create: {
			params: {
				transaction: { type: "object" }
			},
			handler(ctx) {
				let transaction = ctx.params.transaction;
				let entity = {};
				let amountPay = transaction.amount;
				let paymentDate = new Date();
				return this.validateEntity(entity)
					.then(() => {

						entity.client_id = transaction.client_id;

						if(transaction.payment_method === "debit_card") {
							entity.status = "paid";
							entity.payment_date = paymentDate;
							entity.amount = amountPay - (amountPay * .03);
						}
                        
						if(transaction.payment_method === "credit_card") {
							entity.status = "waiting_funds";
							paymentDate.setDate(paymentDate.getDate() + 30);
							entity.payment_date = paymentDate;
							entity.amount = amountPay - (amountPay * .05);
						}

						entity.createdAt = new Date();
						entity.updatedAt = new Date();

						return this.adapter.insert(entity)
							.then(json => this.entityChanged("created", json, ctx).then(() => true));
					});
			}
		},

		/**
		 * Balance of payables with pagination.
		 *
		 * @actions
		 * @param {String} client_id - Filter for client_id
		 * @param {Number} limit - Pagination limit
		 * @param {Number} offset - Pagination offset
		 *
		 * @returns {Object} List of payables
		 */
		balance: {
			cache: {
				keys: ["client_id", "limit", "offset"]
			},
			params: {
				client_id: { type: "string"},
				// tag: { type: "string", optional: true },
				// author: { type: "string", optional: true },
				// favorited: { type: "string", optional: true },
				// limit: { type: "number", optional: true, convert: true },
				// offset: { type: "number", optional: true, convert: true },
			},
			handler(ctx) {
				const limit = ctx.params.limit ? Number(ctx.params.limit) : 20;
				const offset = ctx.params.offset ? Number(ctx.params.offset) : 0;

				let params = {
					limit,
					offset,
					sort: ["-createdAt"],
					populate: ["client_id"],
					query: {}
				};
				let countParams;

				if (ctx.params.client_id)
					params.query.client_id = ctx.params.client_id;

				return this.Promise.resolve()
					.then(() => {
						countParams = Object.assign({}, params);
						// Remove pagination params
						if (countParams && countParams.limit)
							countParams.limit = null;
						if (countParams && countParams.offset)
							countParams.offset = null;
					})
					.then(() => this.Promise.all([
						// Get rows
						this.adapter.find(params),

						// Get count of all rows
						this.adapter.count(countParams)

					])).then(res => {

						let balance = {
							waiting_funds: 0,
							available: 0
						};

						balance.waiting_funds = res[0].reduce(function (accumulator, item) {
							if(item.status === "waiting_funds")
								return accumulator + item.amount;
							else
								return 0
						}, 0);

						balance.available = res[0].reduce(function (accumulator, item) {
							if(item.status === "paid")
								return accumulator + item.amount;
							else
								return 0	
						}, 0);						  

						return balance;

						// return res;
					});
			}
		},		
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};