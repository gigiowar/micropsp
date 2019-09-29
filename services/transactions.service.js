"use strict";

const { MoleculerClientError } = require("moleculer").Errors;

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "transactions",
	mixins: [
		DbService("transactions"),
		CacheCleanerMixin([
			"cache.clean.transactions",
			"cache.clean.payables",
		])
	],
	/**
	 * Service settings
	 */
	settings: {
		// Validation schema for new entities
		entityValidator: {
			amount: { type: "number", min: 1 },
			description: { type: "string", min: 1 },
			payment_method: { type: "string", min: 1 },
			card_number: { type: "string", min: 1 },
			holder_name: { type: "string", min: 1 },
			valid_date: { type: "string", min: 7 },
			cvv: { type: "string", min: 1 },
			client_id: { type: "string", min: 1 },
		}
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
		 * Create a new transaction.
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
				let entity = ctx.params.transaction;
				let cn = entity.card_number;
				return this.validateEntity(entity)
					.then(() => {
						entity.card_number = cn.substr(cn.length - 4);
						entity.createdAt = new Date();
						entity.updatedAt = new Date();

						return this.adapter.insert(entity)
							.then(() => ctx.call("payables.create", { transaction: ctx.params.transaction }))
							.then(json => this.entityChanged("created", json, ctx).then(() => true));
					});
			}
		},

		/**
		 * List transactions with pagination.
		 *
		 * @actions
		 * @param {String} payment_method - Filter for payment_method
		 * @param {Number} limit - Pagination limit
		 * @param {Number} offset - Pagination offset
		 *
		 * @returns {Object} List of transactions
		 */
		list: {
			cache: {
				keys: ["limit", "offset"]
			},
			params: {

			},
			handler(ctx) {
				const limit = ctx.params.limit ? Number(ctx.params.limit) : 20;
				const offset = ctx.params.offset ? Number(ctx.params.offset) : 0;

				let params = {
					limit,
					offset,
					sort: ["-createdAt"],
					populate: [],
					query: {}
				};
				let countParams;

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
						return res;
					});
			}
		},		

		/**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
		hello() {
			return "Hello Transactions";
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