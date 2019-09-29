"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TransactionService = require("../../services/transactions.service");
const PaymentService = require("../../services/payables.service");

describe("Test 'transactions' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(TransactionService);
	broker.createService(PaymentService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'transactions.hello' action", () => {

		it("should return with 'Hello Transactions'", () => {
			expect(broker.call("transactions.hello")).resolves.toBe("Hello Transactions");
		});

	});

	describe("Test 'transactions.create' action", () => {

		it("should return with true", () => {
			expect(broker.call("transactions.create", { 
				transaction:{
					amount: 101,
					description: "Smartband XYZ 3.0",
					payment_method: "credit_card",
					card_number: "4111 1111 1111 1111",
					holder_name: "Giovanni Abate Neto",
					valid_date: "09/2021",
					cvv: "123",
					client_id: "2"
				} 
			})).resolves.toBe(true);
		});

	});

	describe("Test 'transactions.list' action", () => {

		it("should return with true", () => {
			expect(broker.call("transactions.list", {})).resolves.toBeTruthy();
		});

	});

});

