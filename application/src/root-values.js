const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
    req.mysqlDb.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

var root = {
    hello: () => {
        return 'Hello world!';
    },
};
var rootBooks = {
    title: () => {
        return 'Unknown';
    },
    author: () => {
        return 'Unknown';
    },
    getBooks: (args, req) => queryDB(req, "select * from books").then(data => data),
    getBookInfo: (args, req) => queryDB(req, "select * from books where id = ?", [args.id]).then(data => data[0])
};

export { root, rootBooks }