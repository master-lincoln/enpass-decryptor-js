const enpass = require('../index');
const assert = require('chai').assert;


const opts = {
    database_path: 'test/walletx.db',
    password: '#SuperS3cr3tP4assw0rd'
};

const title = 'Reddit';
const passw = 'TestPassword';

describe('enpass', function() {

    it('getPasswordsWithTitle', function(done) {
        enpass.connect((err, db) => {
            if (err) done(err);

            db.getPasswordsWithTitle(title, (err, passwords) => {
                assert.equal(passw, passwords.join('\n'));
                done();
            });

            db.disconnect();
        }, opts);
    });

});
