Allows to decrypt [Enpass](https://www.enpass.io/) `walletx.db` database files via Node.js.

## Usage
Add the library to your dependencies and install

`npm install --save enpass-decryptor-js`

Next you can call `connect` and pass it a callback and the configuration for the database (path and password).
Within the callback you can access the complete Enpass database.

```js
const enpass = require('enpass-decryptor-js');


enpass.connect((err, db) => {
    db.getPasswordsWithTitle('Github', (err, passwords) => {
        console.log(passwords.join('\n'));
    });

    db.disconnect();
}, {
    database_path: '/home/someone/Documents/walletx.db',
    password: '#SuperS3cr3tP4assw0rd'
});
```
Of course you should not save the password in a cleartext file!

## Documentation
Under the hood Enpass uses an encrypted SQLite database (via [SQLCipher](https://www.zetetic.net/sqlcipher/)).

Addtionally, they encrypt the sensitive data with an extra PBKDF2 cipher (as explained in [their FAQ](https://www.enpass.io/kb/what-encryption-and-security-technology-does-enpass-use/)).

Database structure is explained in [Dataformat.md](DataFormat.md)

## Motivation
Enpass is great because it allows offline usage and it gives you a wide variety of sync providers.
Sadly Enpass is not open source, so I wanted a way to access my passwords even if an original Enpass client is not available.
This library could be used to implement alternative clients to the Enpass password database.


Based on the python implementation [steffen9000/enpass-decryptor](https://github.com/steffen9000/enpass-decryptor)