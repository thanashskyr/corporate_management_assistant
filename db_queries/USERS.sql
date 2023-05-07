Database: CorpApplication

DROP DATABASE IF EXISTS "CorpApplication";

CREATE DATABASE "CorpApplication"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	
CREATE TABLE USERS (
  NAME VARCHAR(255),
  SIRNAME VARCHAR(255),
  UIN VARCHAR(255),
  USERNAME VARCHAR(255),
  PASSWORD VARCHAR(255)
);

DROP TABLE tokens;


CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

INSERT INTO USERS (NAME, SIRNAME, UIN, USERNAME, PASSWORD)
VALUES 
  ('Thita', 'Kapa', '00000000', 'thita', 'passkapa'),
  ('Alpha', 'Vita', '11111111', 'alpha', 'passvita'),
  ('Gama', 'Delta', '22222222', 'gama', 'passdelta'),
  ('Ypsilon', 'Zhta', '33333333', 'ypsilon', 'passzhta'),
  ('Htta', 'Thita', '44444444', 'htta', 'passthita');


SELECT * FROM TOKENS;
