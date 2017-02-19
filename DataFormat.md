
### Get all tables
```js
db.all("select NAME from SQLITE_MASTER where TYPE='table' order by NAME;", function (err, rows) {
    rows.forEach(row => {
        db.all(`PRAGMA table_info(${row.name})`, function (err, rows) {

            rows = rows.map(row => {
                const pk = row.pk ? ' PRIMARY KEY' : '';
                const not_null = row.notull ? ' NOT NULL' : '';
                return `${row.name} ${row.type}${pk}${not_null}`
            });

            console.log('##############################');
            console.log('##   ' + row.name);
            console.log('##############################');
            console.log(JSON.stringify(rows, null, '\t'));
            console.log('\n');
        });
    });
});
```
Returns:

```json
##############################
##   Cards
##############################
[
	"ID INTEGER PRIMARY KEY",
	"Title VARCHAR",
	"SubTitle VARCHAR",
	"Type VARCHAR",
	"Category VARCHAR",
	"IconID INTEGER",
	"CustomIconId VARCHAR",
	"UpdateTime INTEGER",
	"UUID TEXT",
	"Urls TEXT",
	"FormFields TEXT",
	"Data BLOB",
	"Trashed INTEGER",
	"Deleted INTEGER"
]


##############################
##   Favorites
##############################
[
	"ID INTEGER PRIMARY KEY",
	"CardUUID VARCHAR",
	"UpdateTime INTEGER",
	"Trashed INTEGER"
]


##############################
##   Identity
##############################
[
	"ID INTEGER PRIMARY KEY",
	"Version INTEGER",
	"Signature TEXT",
	"Sync_UUID TEXT",
	"Hash TEXT",
	"Info BLOB"
]


##############################
##   Password_History
##############################
[
	"ID INTEGER PRIMARY KEY",
	"Password text",
	"Timestamp INTEGER",
	"Domain text"
]


##############################
##   Pool
##############################
[
	"UID INTEGER",
	"Data BLOB"
]


##############################
##   SecuritySettings
##############################
[
	"ID INTEGER PRIMARY KEY",
	"Key1 TEXT",
	"Key2 TEXT",
	"Value TEXT"
]


##############################
##   sqlite_sequence
##############################
[
	"name ",
	"seq "
]


iTAticTOwnEF
##############################
##   Folder_Cards
##############################
[
	"ID INTEGER PRIMARY KEY",
	"FolderUUID VARCHAR",
	"CardUUID VARCHAR",
	"UpdateTime INTEGER",
	"Trashed INTEGER"
]


##############################
##   Folders
##############################
[
	"ID INTEGER PRIMARY KEY",
	"Title VARCHAR",
	"IconID INTEGER",
	"UpdateTime INTEGER",
	"UUID VARCHAR",
	"Parent VARCHAR",
	"Trashed INTEGER"
]


##############################
##   Attachment
##############################
[
	"ID INTEGER PRIMARY KEY",
	"UUID TEXT",
	"CardUUID TEXT",
	"MetaData TEXT",
	"Data BLOB",
	"Trashed integer",
	"Timestamp integer"
]
```