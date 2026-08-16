# Legacy Content Audit

Источник аудита: `http://advokat-vnp.ru/`

Дата аудита: `2026-08-16`

Старый сайт доступен по HTTP. `robots.txt` и `sitemap.xml` на основном домене возвращают `404`, поэтому структура собиралась по внутренним ссылкам и текстовым страницам самого сайта. Старый дизайн не используется как reference: сайт рассматривается только как content source.

## Найденные URL

| URL | Title | Тип материала | Дата | Полный текст | Изображения | Целевая коллекция Payload | Статус миграции |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `http://advokat-vnp.ru/` | Ведищев Николай Павлович - Главная | Главная / биография | не указана | да | да | `pages`, `globals/site-settings` | подготовлено к миграции |
| `http://advokat-vnp.ru/robots.txt` | 404 Not Found | служебный URL | `2026-08-16` audit | нет | нет | не импортировать | исключено |
| `http://advokat-vnp.ru/sitemap.xml` | 404 Not Found | служебный URL | `2026-08-16` audit | нет | нет | не импортировать | исключено |
| `http://advokat-vnp.ru/cat/7/nauchnaja-dejateljnostj` | Ведищев Николай Павлович - Научная деятельность | категория | не указана | обзор | да | docs / routing source | аудировано |
| `http://advokat-vnp.ru/cat/3/statji-v-periodike` | Ведищев Николай Павлович - Статьи в периодике | категория | не указана | обзор | да | docs / routing source | аудировано |
| `http://advokat-vnp.ru/cat/4/advokatskaja-praktika` | Ведищев Николай Павлович - Адвокатская практика | категория | не указана | обзор | да | docs / routing source | аудировано |
| `http://advokat-vnp.ru/cat/5/videomaterialy` | Представлены видеоматериалы с участием адвоката Ведищева Николая Павловича | категория | не указана | обзор | да | docs / routing source | аудировано |
| `http://advokat-vnp.ru/page/2/laureat-juridicheskoj-premii-femida` | Ведищев Николай Павлович - Лауреат юридической премии “Фемида” | награда / статус | не указана | нет | да | homepage trust / verification docs | требует внешней проверки |
| `http://advokat-vnp.ru/page/3/kandidat-juridicheskih-nauk` | Кандидат юридических наук Ведищев Николай Павлович | ученая степень | `2012-05-17` внутри текста | короткий текст | да | `pages`, `globals/site-settings` | подготовлено к миграции |
| `http://advokat-vnp.ru/page/4/pochetnyj-advokat-rossii` | Ведищев Николай Павлович - Почетный адвокат России | награда / статус | не указана | нет | да | homepage trust / verification docs | требует внешней проверки |
| `http://advokat-vnp.ru/page/5/chlen-mgka` | Ведищев Николай Павлович - Член МГКА | профессиональный статус | не указана | нет | да | `pages`, `globals/site-settings` | подтверждено внешними источниками |
| `http://advokat-vnp.ru/page/6/kavaler-ordena-pocheta` | Ведищев Николай Павлович - Кавалер ордена Почета | награда / статус | не указана | нет | да | verification docs | требует внешней проверки |
| `http://advokat-vnp.ru/page/7/kontakty` | Ведищев Николай Павлович - Контакты | legacy contacts | не указана | да | да | docs only | не публиковать автоматически |
| `http://advokat-vnp.ru/page/8/postanovlenie-prezidiuma-mosgorsuda-ot-16112012-goda-po-delu-44u-53012` | Постановление Президиума Мосгорсуда от 16.11.2012 года по делу №44у-530/12 | реальное дело / судебный акт | `2012-11-16` | да | да | `cases` | import draft planned |
| `http://advokat-vnp.ru/page/9/novyj-zakon-novye-problemy-u-advokatov` | Новый закон - новые проблемы у адвокатов | авторская статья | `2013` | да | нет | `posts` | import prepared |
| `http://advokat-vnp.ru/page/10/vstupiteljnye-zajavlenija-storon-chasti-2-i-3-statji-335-upk-rf` | Вступительные заявления сторон (части 2 и 3 статьи 335 УПК РФ) | авторская статья | `2010` по библиографической ссылке | да | нет | `posts` | import prepared |
| `http://advokat-vnp.ru/page/11/opredelenie-ot-27-aprelja-2006-goda-verhovnogo-suda-rf-delo-n-5-d05-299` | Определение от 27 апреля 2006 года Верховного Суда РФ Дело N 5-Д05-299 | реальное дело / судебный акт | `2006-04-27` | да | да | `cases` | import draft planned |
| `http://advokat-vnp.ru/page/12/postanovlenie-moskovskogo-gorodskogo-suda-ot-14022013-po-delu-n-4u-47713` | Постановление Московского городского суда от 14.02.2013 по делу N 4у-477/13 | реальное дело / судебный акт | `2013-02-14` | да | да | `cases` | import draft planned |
| `http://advokat-vnp.ru/page/15/sud-prisjazhnyh-v-rossii` | Адвокат Ведищев Николай Павлович "Суд присяжных в России" | видеоматериал | не указана | краткий текст | да | `videos` | import draft planned |
| `http://advokat-vnp.ru/page/16/opredelenie-verhovnogo-suda-rf-ot-28012010-n-32-009-65sp` | Ведищев Николай Павлович - Определение Верховного Суда РФ от 28.01.2010 N 32-009-65СП | реальное дело / судебный акт | `2010-01-28` | да | да | `cases` | import draft planned |
| `http://advokat-vnp.ru/page/17/proizvodnye-narkoticheskih-sredstv-i-psihotropnyh-veschestv-da-ili-net` | Производные наркотических средств и психотропных веществ: да или нет | авторская статья | не указана | да | нет | `posts` | import prepared |
| `http://advokat-vnp.ru/page/18/intervjju-advokata-vedischeva-np-po-delu-ocimika-ae` | Интервью адвоката Ведищева Н.П. по делу Оцимика А.Е. | видеоматериал / интервью | не указана | краткий текст | да | `videos`, `publications` review | import draft planned |
| `http://advokat-vnp.ru/page/19/nauchnye-statji-opublikovannye-v-veduschih-recenziruemyh-zhurnalah-i-izdanijah-rekomendovannyh-vysshej-attestacionnoj-komissiej-ministerstva-obrazovanija-i-nauki-rossijskoj-federacii` | Научные статьи... рекомендованные ВАК | библиография | `2000-2010+` | да | нет | `publications` | import prepared |
| `http://advokat-vnp.ru/page/20/monografii` | Ведищев Николай Павлович - Монографии | книги / монографии | `2003-2013` | да | нет | `books` | import prepared |
| `http://advokat-vnp.ru/page/21/nauchnye-statji-opublikovannye-v-inyh-izdanijah` | Ведищев Николай Павлович - Научные статьи, опубликованные в иных изданиях | библиография | `2002-2011+` | да | нет | `publications` | import prepared |

## Изображения

Найдены реальные исторические фотографии на `upload/pages/1.jpg` ... `upload/pages/7.jpg`. Они пригодны как подтвержденные legacy-image sources, но качество ограничено исходниками старого сайта и часть кадров групповые. Для P2.5 выбраны безопасные кандидаты:

- `upload/pages/1.jpg` — временный hero portrait candidate.
- `upload/pages/3.jpg` — временный profile portrait candidate.

## Внешняя верификация

Для обновления исторического материала дополнительно использованы внешние источники:

- официальный профиль МГКА с реестровым номером `77/1988` и профессиональной биографией;
- новости МГКА / ФПА о более поздних книгах;
- библиотечные каталоги для современных книг.

Есть расхождение по научной степени: старый сайт и профиль МГКА подтверждают формулировку `кандидат юридических наук`, тогда как отдельные новости 2025-2026 годов называют Николая Павловича `доктором юридических наук`. Это зафиксировано как verification discrepancy и не должно публиковаться без отдельного подтверждения.
