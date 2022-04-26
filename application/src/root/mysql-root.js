import { dbMysql} from '../db.js';

var rootMysql = { 
    libraries: {
        getLibraries: async (args, req) => {
            return queryDB("select * from libraries", null).then(data => data)
        },
        getLibrariesWithBooks: async (args, req) => {
            var libraries = await queryDB("select * from libraries where id = ?", [args.id]).then(data => data)
            var books = await queryDB("select * from books where library_id = ?", [args.id]).then(data => data)
            //TODO
        },
        getLibrariesWithBooksAndLibrarians: (args, req) => {
            //TODO
        }
    }
}

const queryDB = (sql, args) => new Promise((resolve, reject) => {
    dbMysql.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

export { rootMysql }