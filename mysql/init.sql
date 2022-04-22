/* WRITE QUERIES HERE */
CREATE TABLE IF NOT EXISTS libraries(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(200) NOT NULL,
    street VARCHAR(200) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS books(
    id INT AUTO_INCREMENT NOT NULL,
    library_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    release_year INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (library_id) REFERENCES libraries(id)
);

CREATE TABLE IF NOT EXISTS librarians(
    id INT AUTO_INCREMENT NOT NULL,
    library_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    age INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (library_id) REFERENCES libraries(id)
);