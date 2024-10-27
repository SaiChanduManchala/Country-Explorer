import fetch from 'node-fetch';
import { expect } from 'chai';

describe('Country Explorer Tests', () => {
    it('should do a simple math test', () => {
        expect(1 + 1).to.equal(2);
    });

    it('should check for truthy value', () => {
        expect(true).to.be.true;
    });

    // tests here, for example:
    it('should fetch countries data', async () => {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        expect(data).to.be.an('array');
        expect(data.length).to.be.greaterThan(0);
    });

    // Additional tests
});
