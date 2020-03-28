CREATE TABLE account (
  username varchar(30) PRIMARY KEY,
  password varchar(30) NOT NULL,
  email varchar(50) NOT NULL,
  display_name varchar(100),
  avatar text,
  bio text,
  location text,
  birthday date,
  last_login date NOT NULL
);

CREATE TABLE company (
  company_id integer PRIMARY KEY,
  company_name varchar(50) NOT NULL,
  description text,
  country integer
);

CREATE TABLE platform (
  platform_id integer PRIMARY KEY,
  platform_name varchar(50) NOT NULL,
  abbreviation varchar(15),
  generation integer
);

CREATE TABLE game (
  game_id integer PRIMARY KEY,
  title text NOT NULL,
  summary text NOT NULL,
  cover text NOT NULL,
  release date NOT NULL,
  genre varchar(50) NOT NULL,
  developer integer references company,
  publisher integer references company
);

CREATE TABLE favorite (
  username varchar(30) references account,
  game_id integer references game,
  PRIMARY KEY (username, game_id)
);

CREATE TABLE on_platform (
  game_id integer references game,
  platform_id integer references platform,
  PRIMARY KEY (game_id, platform_id)
);

