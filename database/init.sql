-- Create Quotes table schema
CREATE TABLE IF NOT EXISTS quotes (
  id       SERIAL PRIMARY KEY,
  quote    TEXT   NOT NULL,
  author   TEXT,
  category TEXT
);

-- Import quotes from csv file
COPY quotes(quote, author, category)
FROM '/docker-entrypoint-initdb.d/quotes.csv'
WITH (FORMAT csv, HEADER true);

-- Create visit table schema
CREATE TABLE IF NOT EXISTS visits (
  id    SERIAL PRIMARY KEY,
  count INTEGER NOT NULL
);

-- Initialize the table
INSERT INTO visits(count)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM visits WHERE id = 1);
