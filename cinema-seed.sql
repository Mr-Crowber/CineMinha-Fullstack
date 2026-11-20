-- Insere o catálogo que já existia nos protótipos do app e do dashboard, sem duplicar títulos.
INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Godzilla Resurgence', 'FICÇÃO', '01H 59MIN', '12 ANOS', 'Uma criatura colossal surge inesperadamente em Tóquio, enquanto o governo tenta entender e conter uma ameaça que cresce diante da cidade.', '/images/movies/posters/godzilla-resurgence.webp', '/images/movies/banners/godzilla-resurgence.webp', 'GODZILLA', 'RESURGENCE', 2016, 'Hideaki Anno', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Godzilla Resurgence');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Homem-Aranha: Através do Aranhaverso', 'ANIMAÇÃO', '02H 20MIN', '10 ANOS', 'Miles Morales atravessa diferentes dimensões e encontra novas versões do Homem-Aranha enquanto tenta proteger quem ama.', '/images/movies/posters/homem-aranha-aranhaverso.webp', '/images/movies/banners/homem-aranha-aranhaverso.webp', 'HOMEM-ARANHA', 'ARANHAVERSO', 2023, 'Joaquim Dos Santos', 'Publicado', 1
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Homem-Aranha: Através do Aranhaverso');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Guardiões da Galáxia Vol. 3', 'AÇÃO', '02H 30MIN', '14 ANOS', 'Os Guardiões partem para uma missão que coloca o passado de Rocket no centro de uma última aventura pelo espaço.', '/images/movies/posters/guardioes-galaxia-3.webp', '/images/movies/banners/guardioes-galaxia-3.webp', 'GUARDIÕES', 'DA GALÁXIA VOL. 3', 2023, 'James Gunn', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Guardiões da Galáxia Vol. 3');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'La La Land', 'DRAMA', '02H 08MIN', '12 ANOS', 'Uma atriz e um músico se apaixonam em Los Angeles enquanto tentam equilibrar seus sonhos, carreiras e o relacionamento.', '/images/movies/posters/la-la-land.webp', '/images/movies/banners/la-la-land.webp', 'LA LA', 'LAND', 2016, 'Damien Chazelle', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'La La Land');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Hellraiser', 'TERROR', '02H 01MIN', '18 ANOS', 'Uma misteriosa caixa abre caminho para uma realidade marcada por criaturas sobrenaturais e desejos que cobram um preço terrível.', '/images/movies/posters/hellraiser.webp', '/images/movies/banners/hellraiser.webp', 'HELL', 'RAISER', 2022, 'David Bruckner', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Hellraiser');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Alien: Romulus', 'TERROR', '01H 59MIN', '16 ANOS', 'Um grupo de jovens explora uma estação espacial abandonada e acaba diante de uma ameaça que não deveria ter sido encontrada.', '/images/movies/posters/alien-romulus.webp', '/images/movies/banners/alien-romulus.webp', 'ALIEN:', 'ROMULUS', 2024, 'Fede Álvarez', 'Publicado', 1
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Alien: Romulus');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Bingo: O Rei das Manhãs', 'DRAMA', '01H 53MIN', '16 ANOS', 'Um artista em busca de reconhecimento encontra fama interpretando um palhaço de televisão, mas começa a pagar um preço pessoal pelo sucesso.', '/images/movies/posters/bingo-rei-das-manhas.webp', '/images/movies/banners/bingo-rei-das-manhas.webp', 'BINGO', 'O REI DAS MANHÃS', 2017, 'Daniel Rezende', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Bingo: O Rei das Manhãs');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'O Exorcista 3', 'TERROR', '01H 50MIN', '18 ANOS', 'Uma investigação policial se conecta a assassinatos que parecem reproduzir acontecimentos ligados a um antigo caso de possessão.', '/images/movies/posters/exorcista-3.webp', '/images/movies/banners/exorcista-3.webp', 'O EXORCISTA', '3', 1990, 'William Peter Blatty', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'O Exorcista 3');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Star Wars: O Império Contra-Ataca', 'FICÇÃO', '02H 04MIN', 'LIVRE', 'A Rebelião enfrenta novos perigos enquanto Luke continua seu treinamento e a guerra contra o Império se intensifica.', '/images/movies/posters/star-wars-imperio-contra-ataca.webp', '/images/movies/banners/star-wars-imperio-contra-ataca.webp', 'STAR WARS', 'O IMPÉRIO CONTRA-ATACA', 1980, 'Irvin Kershner', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Star Wars: O Império Contra-Ataca');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'The Thing', 'TERROR', '01H 49MIN', '18 ANOS', 'Isolados em uma estação na Antártida, pesquisadores percebem que uma forma de vida desconhecida pode estar entre eles.', '/images/movies/posters/the-thing.webp', '/images/movies/banners/the-thing.webp', 'THE', 'THING', 1982, 'John Carpenter', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'The Thing');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Psicose', 'TERROR', '01H 49MIN', '14 ANOS', 'Uma mulher desaparece após parar em um pequeno motel, iniciando uma história de suspense em torno de um proprietário profundamente perturbado.', '/images/movies/posters/psicose.webp', '/images/movies/banners/psicose.webp', 'PSI', 'COSE', 1960, 'Alfred Hitchcock', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Psicose');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'FNAF: O Pesadelo Sem Fim', 'TERROR', '01H 49MIN', '16 ANOS', 'Um segurança começa a trabalhar em uma pizzaria abandonada e descobre que os personagens animatrônicos guardam segredos perigosos.', '/images/movies/posters/fnaf-pesadelo-sem-fim.webp', '/images/movies/banners/fnaf-pesadelo-sem-fim.webp', 'FNAF', 'O PESADELO SEM FIM', 2023, 'Emma Tammi', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'FNAF: O Pesadelo Sem Fim');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'O Estranho Mundo de Jack', 'ANIMAÇÃO', '01H 16MIN', 'LIVRE', 'Jack Skellington decide transformar o Natal à sua maneira e acaba colocando sua própria cidade e a celebração em confusão.', '/images/movies/posters/estranho-mundo-de-jack.webp', '/images/movies/banners/estranho-mundo-de-jack.webp', 'O ESTRANHO', 'MUNDO DE JACK', 1993, 'Henry Selick', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'O Estranho Mundo de Jack');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Moonlight: Sob a Luz do Luar', 'DRAMA', '01H 51MIN', '16 ANOS', 'A trajetória de um jovem é acompanhada em diferentes fases da vida, entre identidade, amizade, afeto e as dificuldades de crescer.', '/images/movies/posters/moonlight.webp', '/images/movies/banners/moonlight.webp', 'MOONLIGHT', 'SOB A LUZ DO LUAR', 2016, 'Barry Jenkins', 'Publicado', 0
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Moonlight: Sob a Luz do Luar');

INSERT INTO filmes (title, genre, duration, rating, description, poster, hero_image, hero_title, hero_accent, `year`, director, status, featured)
SELECT 'Perfect Blue', 'DRAMA', '01H 21MIN', '18 ANOS', 'Uma jovem artista abandona a música para atuar e começa a perder a distinção entre sua identidade, sua carreira e uma presença que a persegue.', '/images/movies/posters/perfect-blue.webp', '/images/movies/banners/perfect-blue.webp', 'PERFECT', 'BLUE', 1997, 'Satoshi Kon', 'Publicado', 1
WHERE NOT EXISTS (SELECT 1 FROM filmes WHERE title = 'Perfect Blue');
