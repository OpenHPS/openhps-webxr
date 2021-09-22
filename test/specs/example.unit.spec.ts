import 'mocha';
import { expect } from 'chai';
import { ExampleUnit } from '../../src';

describe("example unit", () => {
    it('should convert celcius to fahrenheit', () => {
        const result = ExampleUnit.CELCIUS.convert(100, ExampleUnit.FAHRENHEIT);
        expect(Math.round(result)).to.equal(212);
    });

    it('should convert fahrenheit to celcius', () => {
        const result = ExampleUnit.FAHRENHEIT.convert(99, ExampleUnit.CELCIUS);
        expect(result).to.equal(37.22222222222222);
    });

    it('should convert celcius to kelvin', () => {
        const result = ExampleUnit.CELCIUS.convert(100, ExampleUnit.KELVIN);
        expect(Math.round(result)).to.equal(373);
    });

    it('should convert kelvin to celcius', () => {
        const result = ExampleUnit.KELVIN.convert(100, ExampleUnit.CELCIUS);
        expect(Math.round(result)).to.equal(-173);
    });

    it('should convert rankine to celcius', () => {
        const result = ExampleUnit.RANKINE.convert(100, ExampleUnit.CELCIUS);
        expect(Math.round(result)).to.equal(-218);
    });

    it('should convert kelvin to rankine', () => {
        const result = ExampleUnit.KELVIN.convert(100, ExampleUnit.RANKINE);
        expect(Math.round(result)).to.equal(180);
    });

    it('should convert celcius to rankine', () => {
        const result = ExampleUnit.CELCIUS.convert(100, ExampleUnit.RANKINE);
        expect(Math.round(result)).to.equal(672);
    });

    it('should convert rankine to fahrenheit', () => {
        const result = ExampleUnit.RANKINE.convert(100, ExampleUnit.FAHRENHEIT);
        expect(Math.round(result)).to.equal(-360);
    });

    it('should convert fahrenheit to rankine', () => {
        const result = ExampleUnit.FAHRENHEIT.convert(100, ExampleUnit.RANKINE);
        expect(Math.round(result)).to.equal(560);
    });
});
