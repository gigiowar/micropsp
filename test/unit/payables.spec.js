"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const TestService = require("../../services/payables.service");

describe("Test 'payables' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'payables.hello' action", () => {

		it("should return with 'Hello payables'", () => {
			expect(broker.call("payables.hello")).resolves.toBe("Hello payables");
		});

	});

	describe("Test 'payables.create' action", () => {

		it("should return with 'Welcome'", () => {
			expect(broker.call("payables.create", { 
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

		it("should reject an ValidationError", () => {
			expect(broker.call("payables.create")).rejects.toBeInstanceOf(ValidationError);
		});

    });
    
	describe("Test 'payables.balance' action", () => {

		it("should return with client balance", async () => {
			expect(broker.call("payables.balance", { client_id: 2 })).resolves.toBeTruthy();
		});

	});

});