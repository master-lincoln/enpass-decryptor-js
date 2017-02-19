const sqlite3 = require('cross-sqlcipher').verbose();
const crypto = require('crypto');

const ROW_CIPHER = 'aes-256-cbc';

module.exports.connect = function (callback, opt) {
    opt = opt || {};

    if (!opt.database_path) throw new Error('You need to provide a database_path');
    if (!opt.password) throw new Error('You need to provide a password');

    const database_path = opt.database_path;
    const secret = opt.password;

    const db = new sqlite3.Database(database_path);

    // crypto data to decode cards
    let iv, key;

    db.serialize(function() {
        _initDB((err, init_data) => {
            if (err) return callback(err);

            iv = init_data.iv;
            key = init_data.key;

            // Public API
            callback(null, {
                getAll,
                getWithTitle,
                getPasswordsWithTitle,
                disconnect
            });
        });
    });


    function _initDB(callback) {
        db.run(`PRAGMA KEY = '${secret}'`);
        db.run("PRAGMA kdf_iter = 24000");

        // get additional decryption data
        db.get("SELECT * FROM Identity", function(err, row) {
            if (err) return callback(err);

            const iv = row['Info'].slice(16, 32);
            const salt = row['Info'].slice(32, 48);
            const hash = row['Hash'];
            const key = _generateKey(hash, salt);

            callback(null, {iv, key});
        });
    }

    function getAll (callback) {
        db.all(
            "SELECT * FROM Cards",
            _forwardDecryptedCards.bind(null, callback)
        );
    }

    /**
     * Returns cards that match a given title.
     * Searches case-insensitive and also matches infix.
     * @param {string} title
     * @param {function} callback (err, cards)
     */
    function getWithTitle (title, callback) {
        db.all(
            "SELECT * FROM Cards WHERE lower(Title) LIKE ?",
            `%${title}%`,
            _forwardDecryptedCards.bind(null, callback)
        );
    }

    function getPasswordsWithTitle(title, callback) {
        return getWithTitle(title, (err, cards) => {
            if (err) return callback(err);

            callback(
                null,
                cards
                    .map(card => card['Data']['fields'].filter(field => field['type'] == 'password'))
                    .map(fields => fields.map(field => field['value']))
            );
        });
    }

    function disconnect() {
        db.close();
    }

    function _forwardDecryptedCards(callback, err, cards) {
        if (err) return callback(err);
        callback(null, cards.map(_decryptCard));
    }

    function _decryptCard(card) {
        card['Data'] = JSON.parse(_decrypt(card['Data'], key, iv));
        return card;
    }

    /**
     * Deciphers an encoded card entry with the given credentials
     * @param {Buffer} enc - the encoded message
     * @param {Buffer} key - secret
     * @param {Buffer} iv  - initialization vector
     * @returns {string} utf8 encoded result
     */
    function _decrypt(enc, key, iv) {
        let decipher = crypto.createDecipheriv(ROW_CIPHER, key, iv);
        let decrypted = decipher.update(enc, 'buffer', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    /**
     * Enciphers a cleartext card entry with the given credentials
     * @param {string} msg - the cleartext message (utf8 encoded)
     * @param {Buffer} key - secret (utf8 encoded)
     * @param {Buffer} iv  - initialization vector (utf8 encoded)
     * @returns {string}
     */
    function _encrypt(msg, key, iv) {
        let cipher = crypto.createCipheriv(ROW_CIPHER, key, iv);
        let encrypted = cipher.update(msg, 'utf8', 'utf8');
        encrypted += cipher.final('utf8');
        return encrypted;
    }

    function _generateKey(key, salt) {
        return crypto.pbkdf2Sync(key, salt, 2, 32, 'sha256');
    }
};