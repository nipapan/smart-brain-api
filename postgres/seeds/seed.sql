BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Palo Tom', 'palo@gmail.com', '4', '2019-12-12');
INSERT into login (hash, email) values ('$2a$10$IQ5Bnt6YCajxJWqcRvwzquAKFlIpJ/DNMefsvJChawoQPuvXAiTwC', 'palo@gmail.com');

COMMIT;
