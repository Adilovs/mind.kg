// Content is intentionally separate from the interface. Add and localize topics here.
(function () {
const levels = {
  foundation: { label: 'Фундамент', color: 'green' },
  intermediate: { label: 'Средний', color: 'blue' },
  undergraduate: { label: 'Бакалавриат', color: 'violet' },
  graduate: { label: 'Магистратура', color: 'orange' },
  advanced: { label: 'Продвинутый', color: 'red' },
  research: { label: 'Исследования', color: 'dark' },
};
const supportedLocales = ['ru', 'ky', 'en'];
const knowledgeStatuses = ['theorem', 'definition', 'conjecture', 'hypothesis', 'empirical_result', 'established_fact', 'interpretation', 'open_problem'];

const worlds = [
  { id: 'math', title: 'Мир математики', en: 'WORLD MATH', icon: '∑', color: 'violet', description: 'От чисел и первых уравнений до открытых проблем современной математики.', i18n: { ru: { title: 'Мир математики', description: 'От чисел и первых уравнений до открытых проблем современной математики.' }, ky: null, en: null } },
  { id: 'physics', title: 'Мир физики', en: 'WORLD PHYSICS', icon: '◉', color: 'blue', description: 'Понимай законы природы: от движения и энергии до квантовых полей и космологии.', i18n: { ru: { title: 'Мир физики', description: 'Понимай законы природы: от движения и энергии до квантовых полей и космологии.' }, ky: null, en: null } },
  { id: 'cs', title: 'Computer Science', en: 'COMPUTER SCIENCE', icon: '⌘', color: 'amber', description: 'Алгоритмы, системы и фундаментальные идеи, на которых строится программирование.', i18n: { ru: { title: 'Computer Science', description: 'Алгоритмы, системы и фундаментальные идеи, на которых строится программирование.' }, ky: null, en: null } },
  { id: 'ai', title: 'Мир искусственного интеллекта', en: 'WORLD AI', icon: '✳', color: 'mint', description: 'Цельный путь от первых строк Python до проектирования AI-систем и исследований.', i18n: { ru: { title: 'Мир искусственного интеллекта', description: 'Цельный путь от первых строк Python до проектирования AI-систем и исследований.' }, ky: null, en: null } },
];

const t = (id, world, title, subtitle, level, prerequisites = [], related = [], next = [], applications = [], section = 'Основы') => ({
  id, world, title, subtitle, level, prerequisites, related, next, applications, section,
  taxonomyId: section.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-').replace(/(^-|-$)/g, ''),
  i18n: { ru: { title, description: subtitle }, ky: null, en: null },
  knowledgeStatus: null,
  overview: subtitle,
  intuition: `${subtitle} Начни с главной идеи, затем свяжи её с тем, что уже знаешь.`,
  theory: `Тема «${title}» — часть большой системы знаний. Здесь будут собраны определения, методы, примеры и связь с соседними областями.`,
  definitions: [], formulas: [], derivation: [], examples: [], proofs: [], visualization: null,
  practice: { exercises: [], projects: [], experiments: [] },
  resources: { textbooks: [], courses: [], lectures: [], videos: [], references: [], papers: [], exercises: [] },
  relations: {
    prerequisite: prerequisites.map(target => ({ target, kind: 'prerequisite' })),
    related: related.map(target => ({ target, kind: 'related' })),
    leadsTo: next.map(target => ({ target, kind: 'leads-to' })),
    usedIn: applications.flatMap(label=>{
      const worldTarget={AI:'ai','Искусственный интеллект':'ai','Computer Science':'cs','Компьютерные науки':'cs','Физика':'physics','Математика':'math'}[label];
      return worldTarget?[{target:worldTarget,targetType:'world',label,kind:'used-in'}]:[];
    }),
  },
  content: {
    intuitive: `${subtitle} Начни с главной идеи, затем свяжи её с тем, что уже знаешь.`,
    standard: `Тема «${title}» — часть большой системы знаний. Здесь мы разберём основные понятия, научимся применять их и увидим, как они связаны с соседними областями.`,
    rigorous: 'Строгое изложение, определения и доказательства будут добавляться вместе с развитием образовательного контента.',
  },
  example: `Разбери ключевую идею темы «${title}» на простом примере и попробуй объяснить её своими словами.`,
});

const topics = [
  t('numbers','math','Числа и системы счисления','Как записывать, сравнивать и преобразовывать числа.', 'foundation',[],['fractions','algebra'],['fractions'],[], 'Арифметика'),
  t('fractions','math','Дроби и проценты','Части целого, отношения и пропорциональные изменения.', 'foundation',['numbers'],['ratios','algebra'],['ratios'],['Финансы','Измерения'],'Арифметика'),
  t('ratios','math','Отношения и пропорции','Сравнивай величины и находи неизвестную часть отношения.', 'foundation',['fractions'],['functions','percentages'],['functions'],['Масштабирование','Наука'],'Арифметика'),
  t('percentages','math','Проценты','Удобный язык для долей, изменений и сравнений.', 'foundation',['fractions'],['ratios','statistics'],[],['Финансы','Статистика'],'Арифметика'),
  t('algebra','math','Алгебра','Используй символы, чтобы описывать закономерности и неизвестные величины.', 'foundation',['numbers'],['equations','functions'],['equations'],['Физика','Программирование'],'Алгебра'),
  t('equations','math','Уравнения и неравенства','Находи значения, при которых математическое утверждение верно.', 'foundation',['algebra'],['functions','inequalities'],['functions'],['Моделирование'],'Алгебра'),
  t('inequalities','math','Неравенства','Описывай диапазоны значений и ограничения.', 'foundation',['equations'],['functions','optimization'],[],['Оптимизация'],'Алгебра'),
  t('functions','math','Функции','Связывай входные значения с результатами и моделируй изменения.', 'foundation',['algebra','ratios'],['graphs','calculus'],['limits','graphs'],['Физика','Машинное обучение'],'Алгебра'),
  t('geometry','math','Геометрия','Изучай формы, размеры и пространственные отношения.', 'foundation',['numbers'],['trigonometry','vectors'],[],['Архитектура','Физика'],'Геометрия'),
  t('trigonometry','math','Тригонометрия','Описывай углы, окружности и периодические процессы.', 'foundation',['geometry','functions'],['waves','calculus'],[],['Сигналы','Физика'],'Геометрия'),
  t('limits','math','Пределы','Понимай поведение функций при приближении к заданной точке.', 'undergraduate',['functions'],['derivatives','integrals'],['derivatives'],['Анализ'],'Анализ'),
  t('derivatives','math','Производные','Измеряй мгновенную скорость изменения функции.', 'undergraduate',['functions','limits'],['gradient','optimization'],['chain-rule','integrals'],['Физика','Обучение моделей'],'Анализ'),
  t('chain-rule','math','Правило цепочки','Находи производную сложной функции через производные её частей.', 'undergraduate',['derivatives','functions'],['backpropagation','gradient'],['backpropagation'],['Глубокое обучение'],'Анализ'),
  t('integrals','math','Интегралы','Связывай накопление величин с площадью и первообразными.', 'undergraduate',['limits','derivatives'],['differential-equations','probability'],[],['Физика','Вероятности'],'Анализ'),
  t('linear-algebra','math','Линейная алгебра','Векторы и матрицы помогают описывать пространство и преобразования.', 'undergraduate',['algebra','geometry'],['vectors','matrices'],['probability','neural-networks'],['Графика','AI','Физика'],'Алгебра'),
  t('vectors','math','Векторы','Представляй величины с направлением и точками в пространстве.', 'undergraduate',['geometry','algebra'],['linear-algebra','physics-vectors'],['matrices'],['Физика','Компьютерная графика'],'Алгебра'),
  t('matrices','math','Матрицы','Записывай линейные преобразования и структурированные данные.', 'undergraduate',['vectors','algebra'],['linear-algebra','neural-networks'],['neural-networks'],['AI','Графика'],'Алгебра'),
  t('probability','math','Теория вероятностей','Описывай неопределённость и случайные события.', 'undergraduate',['fractions','combinatorics'],['statistics','bayes'],['statistics','machine-learning'],['AI','Наука'],'Вероятность и статистика'),
  t('statistics','math','Статистика','Извлекай надёжные выводы из данных.', 'undergraduate',['probability'],['hypothesis-testing','machine-learning'],['machine-learning'],['Исследования','AI'],'Вероятность и статистика'),
  t('discrete-math','math','Дискретная математика','Логика, множества и структуры для компьютерных наук.', 'undergraduate',['algebra'],['combinatorics','graphs'],['algorithms'],['Computer Science'],'Дискретная математика'),
  t('combinatorics','math','Комбинаторика','Считай способы выбрать, упорядочить и соединить объекты.', 'undergraduate',['numbers'],['probability','discrete-math'],['probability'],['Алгоритмы'],'Дискретная математика'),
  t('number-theory','math','Теория чисел','Исследуй целые числа и арифметические закономерности.', 'undergraduate',['numbers','algebra'],['cryptography','abstract-algebra'],[],['Криптография'],'Дискретная математика'),
  t('real-analysis','math','Вещественный анализ','Строгое основание пределов, непрерывности и интегрирования.', 'graduate',['limits','calculus'],['measure-theory','functional-analysis'],[],['Теоретическая математика'],'Анализ'),
  t('abstract-algebra','math','Абстрактная алгебра','Изучай общие алгебраические структуры и их симметрии.', 'graduate',['algebra','number-theory'],['group-theory','field-theory'],[],['Криптография','Физика'],'Алгебра'),
  t('topology','math','Топология','Исследуй свойства пространств, сохраняющиеся при непрерывной деформации.', 'graduate',['geometry','real-analysis'],['differential-geometry','algebraic-topology'],[],['Геометрия'],'Геометрия'),
  t('research-math','math','Открытые проблемы математики','Познакомься с гипотезами и вопросами, над которыми работают математики.', 'research',['real-analysis','abstract-algebra'],['millennium-problems','number-theory'],[],['Современная математика'],'Исследования'),
  t('millennium-problems','math','Проблемы тысячелетия','Семь знаменитых математических задач, выбранных институтом Клэя.', 'research',['research-math'],['number-theory','real-analysis'],[],['История науки'],'Исследования'),
  t('mechanics','physics','Механика и движение','Описывай движение тел, силы и изменение положения.', 'foundation',['algebra','geometry'],['energy','gravitation'],['classical-mechanics'],['Инженерия'],'Механика'),
  t('energy','physics','Энергия и импульс','Следи за сохранением и передачей величин в физических системах.', 'foundation',['mechanics'],['thermodynamics','classical-mechanics'],[],['Инженерия','Климат'],'Механика'),
  t('gravitation','physics','Гравитация','Понимай притяжение масс и орбитальное движение.', 'foundation',['mechanics'],['classical-mechanics','relativity'],[],['Астрономия'],'Механика'),
  t('thermodynamics','physics','Термодинамика','Изучай тепло, работу и состояние макроскопических систем.', 'foundation',['energy'],['statistical-mechanics','thermo-advanced'],[],['Энергетика'],'Термодинамика'),
  t('electricity','physics','Электричество и магнетизм','Изучи заряды, ток, поля и их взаимодействие.', 'foundation',['algebra','vectors'],['electromagnetism','waves'],['electromagnetism'],['Электроника'],'Электромагнетизм'),
  t('waves','physics','Волны и оптика','Понимай распространение возмущений и поведение света.', 'foundation',['trigonometry','mechanics'],['optics','electromagnetism'],[],['Связь','Оптика'],'Колебания и волны'),
  t('classical-mechanics','physics','Классическая механика','Свяжи движение, силы и энергию в единой математической теории.', 'undergraduate',['mechanics','calculus'],['gravitation','differential-equations'],[],['Инженерия'],'Механика'),
  t('electromagnetism','physics','Электродинамика','Описывай электрические и магнитные поля уравнениями Максвелла.', 'undergraduate',['electricity','calculus','vectors'],['waves','quantum-mechanics'],[],['Оптика','Электроника'],'Электромагнетизм'),
  t('quantum-mechanics','physics','Квантовая механика','Модель физических систем на атомном и субатомном масштабе.', 'undergraduate',['linear-algebra','calculus','waves'],['particle-physics','condensed-matter'],[],['Материалы'],'Современная физика'),
  t('relativity','physics','Специальная теория относительности','Изучай пространство и время при скоростях, близких к световой.', 'undergraduate',['mechanics','algebra'],['general-relativity','particle-physics'],[],['Космология'],'Современная физика'),
  t('general-relativity','physics','Общая теория относительности','Гравитация как геометрия пространства-времени.', 'graduate',['relativity','differential-geometry'],['cosmology','gravitational-waves'],[],['Астрофизика'],'Современная физика'),
  t('quantum-field-theory','physics','Квантовая теория поля','Объедини квантовую механику и специальные принципы относительности.', 'graduate',['quantum-mechanics','electromagnetism'],['particle-physics'],[],['Физика частиц'],'Современная физика'),
  t('cosmology','physics','Космология','Исследуй происхождение, структуру и эволюцию Вселенной.', 'graduate',['general-relativity','statistics'],['research-physics'],[],['Астрофизика'],'Астрофизика'),
  t('research-physics','physics','Открытые вопросы физики','Обзор активных направлений, экспериментов и нерешённых вопросов.', 'research',['quantum-mechanics','general-relativity'],['cosmology','quantum-field-theory'],[],['Современная физика'],'Исследования'),
  t('programming','cs','Что такое программирование?','Записывай инструкции, которые компьютер может выполнить.', 'foundation',[],['python','algorithms'],['python'],['Автоматизация'],'Основы'),
  t('python','cs','Python: первые шаги','Создавай программы на выразительном языке, подходящем для начинающих.', 'foundation',['programming'],['algorithms','data-structures'],['algorithms','data-structures'],['AI','Автоматизация'],'Программирование'),
  t('algorithms','cs','Алгоритмы','Строй точные пошаговые решения вычислительных задач.', 'undergraduate',['python','discrete-math'],['data-structures','complexity'],['data-structures','complexity'],['AI','Поиск'],'Алгоритмы'),
  t('data-structures','cs','Структуры данных','Выбирай способы хранения данных под нужные операции.', 'undergraduate',['python','algorithms'],['trees','graphs','hash-tables'],['graphs'],['Базы данных'],'Алгоритмы'),
  t('complexity','cs','Сложность и Big O','Оценивай, как растут время и память алгоритма с размером входа.', 'undergraduate',['algorithms'],['data-structures','optimization'],[],['Масштабирование'],'Алгоритмы'),
  t('graphs','cs','Графы и сети','Моделируй связи между объектами и ищи пути по ним.', 'undergraduate',['data-structures','discrete-math'],['algorithms','networking'],[],['Интернет','Рекомендации'],'Алгоритмы'),
  t('databases','cs','Базы данных и SQL','Организуй, запрашивай и связывай данные.', 'intermediate',['python'],['data-structures','ai-systems'],[],['AI-продукты'],'Системы'),
  t('networking','cs','Компьютерные сети','Пойми, как устройства обмениваются данными.', 'undergraduate',['programming','graphs'],['distributed-systems','ai-systems'],[],['Интернет'],'Системы'),
  t('operating-systems','cs','Операционные системы','Изучи процессы, память, файлы и управление ресурсами компьютера.', 'undergraduate',['programming','data-structures'],['distributed-systems'],[],['Инфраструктура'],'Системы'),
  t('distributed-systems','cs','Распределённые системы','Проектируй системы, которые работают на множестве связанных машин.', 'graduate',['networking','operating-systems'],['ai-systems'],[],['Облачные платформы'],'Системы'),
  t('optimization','math','Оптимизация','Ищи лучшие решения при заданной цели и ограничениях.', 'undergraduate',['calculus','linear-algebra'],['gradient','machine-learning'],['gradient'],['AI','Операции'],'Оптимизация'),
  t('gradient','math','Градиентный спуск','Уменьшай ошибку, делая небольшие шаги в направлении её убывания.', 'undergraduate',['derivatives','optimization'],['backpropagation','machine-learning'],['machine-learning','backpropagation'],['Обучение моделей'],'Оптимизация'),
  t('what-is-computer','ai','Что такое компьютер?','Узнай, как компьютер получает входные данные, выполняет инструкции и выдаёт результат.', 'foundation',[],['programming','data-basics'],['programming'],['Каждая область Computer Science'],'Absolute Beginner'),
  t('what-is-programming','ai','Что такое программирование?','Превращай замысел в точные инструкции для машины.', 'foundation',['what-is-computer'],['programming','algorithm-basics'],['python'],['Автоматизация'],'Absolute Beginner'),
  t('algorithm-basics','ai','Что такое алгоритм?','Пошаговый план, который решает задачу и может быть выполнен.', 'foundation',['what-is-programming'],['algorithms','python'],['algorithms'],['Программирование','Математика'],'Absolute Beginner'),
  t('data-basics','ai','Что такое данные?','Представляй наблюдения в форме, с которой можно работать и находить закономерности.', 'foundation',['what-is-computer'],['statistics','machine-learning'],['python'],['AI','Наука'],'Absolute Beginner'),
  t('what-is-ai','ai','Что такое искусственный интеллект?','Разберись в идеях систем, которые выполняют задачи, обычно требующие человеческого интеллекта.', 'foundation',['what-is-programming','data-basics'],['machine-learning','ai-systems'],['machine-learning'],['Роботы','Языковые модели'],'Absolute Beginner'),
  t('machine-learning','ai','Машинное обучение','Находи закономерности в данных и используй их для предсказаний.', 'undergraduate',['python','probability','statistics','linear-algebra'],['gradient','neural-networks'],['neural-networks','computer-vision'],['Рекомендации','Прогнозирование'],'Machine Learning'),
  t('neural-networks','ai','Нейронные сети','Комбинируй простые вычислительные блоки для обучения сложным зависимостям.', 'undergraduate',['linear-algebra','calculus','python'],['backpropagation','deep-learning'],['backpropagation','deep-learning'],['Распознавание образов'],'Deep Learning'),
  t('backpropagation','ai','Обратное распространение ошибки','Вычисляй, как каждый параметр сети влияет на итоговую ошибку.', 'undergraduate',['chain-rule','vectors','matrices','neural-networks'],['gradient','deep-learning'],['deep-learning'],['Обучение нейросетей'],'Deep Learning'),
  t('deep-learning','ai','Глубокое обучение','Обучай многослойные нейронные сети на данных.', 'undergraduate',['neural-networks','backpropagation','machine-learning'],['computer-vision','nlp','transformers'],['computer-vision','nlp'],['Зрение','Язык'],'Deep Learning'),
  t('computer-vision','ai','Компьютерное зрение','Создавай модели, которые извлекают смысл из изображений и видео.', 'undergraduate',['deep-learning'],['cnn','generative-ai'],[],['Медицина','Роботы'],'Направления AI'),
  t('nlp','ai','Обработка естественного языка','Работай с текстом и языком с помощью вычислительных методов.', 'undergraduate',['python','deep-learning'],['transformers','llm'],[],['Поиск','Перевод'],'Направления AI'),
  t('cnn','ai','Свёрточные нейронные сети','Используй локальные фильтры, чтобы распознавать пространственные паттерны.', 'undergraduate',['deep-learning','linear-algebra'],['computer-vision'],[],['Изображения'],'Направления AI'),
  t('generative-ai','ai','Генеративный AI','Изучай модели, которые создают новый текст, изображения, звук и код.', 'intermediate',['deep-learning','probability'],['transformers','llm'],[],['Творческие инструменты'],'Generative AI'),
  t('transformers','ai','Трансформеры','Обрабатывай последовательности через механизм внимания.', 'graduate',['deep-learning','linear-algebra','nlp'],['llm','attention'],['llm'],['Языковые модели'],'Transformers'),
  t('llm','ai','Большие языковые модели','Пойми устройство, обучение и возможности языковых моделей.', 'graduate',['transformers','probability'],['ai-systems','ai-engineering'],['ai-systems'],['Ассистенты','Поиск'],'LLM'),
  t('ai-systems','ai','AI-системы','Собирай модели, данные и инструменты в надёжный продукт.', 'advanced',['llm','databases','networking'],['ai-engineering','agents'],['ai-engineering'],['AI-продукты'],'AI Systems'),
  t('ai-engineering','ai','AI Engineering','Разрабатывай, оценивай и развёртывай AI-приложения.', 'advanced',['ai-systems','python','software-engineering'],['evaluation','agents'],['ai-research'],['Индустрия'],'AI Engineering'),
  t('ai-research','ai','Исследования в AI','Изучай современную литературу, формулируй гипотезы и проверяй их.', 'research',['machine-learning','deep-learning','statistics'],['ai-safety','efficient-inference'],[],['Наука'],'AI Research'),
  t('agents','ai','AI-агенты','Свяжи наблюдение, планирование и действия в интерактивной среде.', 'advanced',['llm','algorithms'],['ai-systems','ai-safety'],[],['Автоматизация'],'AI Systems'),
  t('ai-safety','ai','Безопасность и надёжность AI','Изучай методы оценки, интерпретируемость и снижение рисков AI-систем.', 'research',['ai-systems','statistics'],['ai-research','evaluation'],[],['Исследования'],'AI Research'),
];

// Expandable nodes referenced by the first topic set. These have metadata now and can receive full lessons later.
topics.push(
  t('calculus','math','Математический анализ','Пределы, производные и интегралы как язык непрерывных изменений.', 'undergraduate',['functions','limits'],['derivatives','integrals'],['real-analysis'],['Физика','AI'],'Анализ'),
  t('differential-equations','math','Дифференциальные уравнения','Описывай процессы через связь величины и скорости её изменения.', 'undergraduate',['calculus'],['classical-mechanics','dynamical-systems'],[],['Физика','Инженерия'],'Анализ'),
  t('physics-vectors','physics','Векторы в физике','Используй векторы для записи физических величин и законов.', 'foundation',['vectors'],['electromagnetism','classical-mechanics'],[],['Механика','Поля'],'Механика'),
  t('bayes','math','Байесовский вывод','Обновляй оценку вероятности гипотезы на основе наблюдений.', 'undergraduate',['probability'],['statistics','machine-learning'],[],['AI','Наука'],'Вероятность и статистика'),
  t('hypothesis-testing','math','Проверка статистических гипотез','Сравнивай объяснения данных с помощью формальных процедур.', 'undergraduate',['probability','statistics'],['research-math'],[],['Исследования'],'Вероятность и статистика'),
  t('cryptography','cs','Криптография','Защищай информацию математическими методами и протоколами.', 'undergraduate',['number-theory','programming'],['networking'],[],['Безопасность'],'Безопасность'),
  t('measure-theory','math','Теория меры','Строи строгую теорию длины, площади, объёма и интегрирования.', 'graduate',['real-analysis'],['probability','functional-analysis'],[],['Анализ'],'Анализ'),
  t('functional-analysis','math','Функциональный анализ','Изучай пространства функций и линейные операторы на них.', 'graduate',['real-analysis','linear-algebra'],['measure-theory'],[],['Математическая физика'],'Анализ'),
  t('group-theory','math','Теория групп','Формализуй симметрию через множества с операцией композиции.', 'graduate',['abstract-algebra'],['field-theory','representation-theory'],[],['Физика','Криптография'],'Алгебра'),
  t('field-theory','math','Теория полей','Исследуй алгебраические системы, в которых определены сложение и умножение.', 'graduate',['abstract-algebra'],['group-theory'],[],['Алгебра'],'Алгебра'),
  t('differential-geometry','math','Дифференциальная геометрия','Изучай гладкие пространства и геометрические величины.', 'graduate',['calculus','linear-algebra','topology'],['general-relativity'],[],['Физика'],'Геометрия'),
  t('algebraic-topology','math','Алгебраическая топология','Связывай топологические пространства с алгебраическими инвариантами.', 'graduate',['topology','abstract-algebra'],[],[],['Топология'],'Геометрия'),
  t('statistical-mechanics','physics','Статистическая механика','Свяжи свойства множества частиц с поведением макроскопической системы.', 'undergraduate',['thermodynamics','probability'],['quantum-mechanics'],[],['Материалы'],'Термодинамика'),
  t('thermo-advanced','physics','Продвинутая термодинамика','Исследуй термодинамические потенциалы, равновесие и фазовые переходы.', 'undergraduate',['thermodynamics','calculus'],['statistical-mechanics'],[],['Энергетика'],'Термодинамика'),
  t('optics','physics','Оптика','Изучай распространение, отражение и взаимодействие света с веществом.', 'undergraduate',['waves','electromagnetism'],['quantum-mechanics'],[],['Фотоника'],'Колебания и волны'),
  t('particle-physics','physics','Физика частиц','Исследуй фундаментальные частицы и их взаимодействия.', 'graduate',['quantum-mechanics','relativity'],['quantum-field-theory'],[],['Современная физика'],'Современная физика'),
  t('condensed-matter','physics','Физика конденсированного состояния','Изучай коллективное поведение частиц в твёрдых телах и жидкостях.', 'graduate',['quantum-mechanics','statistical-mechanics'],[],[],['Материалы'],'Современная физика'),
  t('gravitational-waves','physics','Гравитационные волны','Рассматривай рябь пространства-времени, порождённую ускорением массивных тел.', 'graduate',['general-relativity'],['research-physics'],[],['Астрофизика'],'Астрофизика'),
  t('trees','cs','Деревья','Представляй иерархические данные узлами и ветвями.', 'undergraduate',['data-structures'],['algorithms','graphs'],[],['Поиск'],'Алгоритмы'),
  t('hash-tables','cs','Хеш-таблицы','Быстро сопоставляй ключи и значения с помощью хеш-функций.', 'undergraduate',['data-structures','python'],['algorithms'],[],['Базы данных'],'Алгоритмы'),
  t('attention','ai','Механизм внимания','Выбирай, какие части входной последовательности важны для текущего представления.', 'graduate',['linear-algebra','deep-learning'],['transformers','llm'],[],['Языковые модели'],'Transformers'),
  t('software-engineering','cs','Разработка программного обеспечения','Создавай поддерживаемые программы с помощью командных процессов и инженерных практик.', 'undergraduate',['programming','algorithms'],['ai-engineering','databases'],[],['AI-продукты'],'Разработка'),
  t('evaluation','ai','Оценка AI-систем','Измеряй качество моделей и продуктов на репрезентативных задачах.', 'advanced',['statistics','machine-learning'],['ai-safety','ai-research'],[],['Надёжность'],'AI Systems'),
  t('efficient-inference','ai','Эффективный инференс','Снижай стоимость и задержку запуска обученных моделей.', 'advanced',['llm','ai-systems'],['ai-engineering','ai-research'],[],['AI-инфраструктура'],'AI Systems'),
  t('dynamical-systems','math','Динамические системы','Описывай, как состояние системы меняется со временем.', 'graduate',['differential-equations'],['classical-mechanics','chaos-theory'],[],['Физика'],'Анализ'),
  t('representation-theory','math','Теория представлений','Изучай абстрактные алгебраические структуры через линейные преобразования.', 'graduate',['group-theory','linear-algebra'],[],[],['Математическая физика'],'Алгебра'),
  t('chaos-theory','math','Теория хаоса','Изучай динамические системы с сильной чувствительностью к начальным условиям.', 'graduate',['dynamical-systems'],[],[],['Физика'],'Анализ'),
);

// Curriculum taxonomy: broad, expandable coverage. A taxonomy entry becomes a real topic node,
// while a category can grow independently of the page components and the roadmap renderer.
const curriculum = [
  { id:'foundations', world:'math', title:'Основы', level:'foundation', nodes:[
    ['number-systems','Системы счисления'],['arithmetic','Арифметика'],['fractions','Дроби'],['ratios','Отношения'],['percentages','Проценты'],['powers','Степени'],['roots','Корни'],['basic-logic','Основы логики'],['sets','Множества'],['basic-proofs','Основы доказательств'],
  ]},
  { id:'pre-algebra', world:'math', title:'Предалгебра', level:'foundation', nodes:[
    ['expressions','Выражения'],['variables','Переменные'],['equations','Уравнения'],['inequalities','Неравенства'],['proportions','Пропорции'],['coordinate-plane','Координатная плоскость'],
  ]},
  { id:'algebra', world:'math', title:'Алгебра', level:'foundation', nodes:[
    ['linear-equations','Линейные уравнения'],['systems-of-equations','Системы уравнений'],['polynomials','Многочлены'],['factoring','Разложение на множители'],['quadratic-equations','Квадратные уравнения'],['functions','Функции'],['exponents','Показательные выражения'],['logarithms','Логарифмы'],['sequences','Последовательности'],['series','Ряды'],
  ]},
  { id:'geometry', world:'math', title:'Геометрия', level:'foundation', nodes:[
    ['euclidean-geometry','Евклидова геометрия'],['triangles','Треугольники'],['quadrilaterals','Четырёхугольники'],['circles','Окружности'],['polygons','Многоугольники'],['area','Площадь'],['volume','Объём'],['coordinate-geometry','Координатная геометрия'],['transformations','Геометрические преобразования'],['geometric-proofs','Геометрические доказательства'],
  ]},
  { id:'trigonometry', world:'math', title:'Тригонометрия', level:'foundation', nodes:[
    ['angles','Углы'],['unit-circle','Единичная окружность'],['sine','Синус'],['cosine','Косинус'],['tangent','Тангенс'],['trig-identities','Тригонометрические тождества'],['trig-equations','Тригонометрические уравнения'],['trig-functions','Тригонометрические функции'],['trig-applications','Применения тригонометрии'],
  ]},
  { id:'discrete-mathematics', world:'math', title:'Дискретная математика', level:'undergraduate', nodes:[
    ['logic','Математическая логика'],['relations','Отношения'],['combinatorics','Комбинаторика'],['graph-theory','Теория графов'],['trees','Деревья'],['recursion','Рекурсия'],['discrete-probability','Дискретная вероятность'],['algorithms','Алгоритмы'],['proof-techniques','Методы доказательств'],
  ]},
  { id:'calculus', world:'math', title:'Математический анализ', level:'undergraduate', nodes:[
    ['limits','Пределы'],['continuity','Непрерывность'],['derivatives','Производные'],['derivative-applications','Применения производной'],['integrals','Интегралы'],['fundamental-theorem-calculus','Основная теорема анализа'],['infinite-sequences','Бесконечные последовательности'],['infinite-series','Бесконечные ряды'],['multivariable-calculus','Функции нескольких переменных'],['partial-derivatives','Частные производные'],['multiple-integrals','Кратные интегралы'],['vector-calculus','Векторный анализ'],
  ]},
  { id:'linear-algebra', world:'math', title:'Линейная алгебра', level:'undergraduate', nodes:[
    ['vectors','Векторы'],['vector-spaces','Векторные пространства'],['matrices','Матрицы'],['linear-systems','Системы линейных уравнений'],['linear-transformations','Линейные преобразования'],['basis-dimension','Базис и размерность'],['eigenvalues','Собственные значения'],['eigenvectors','Собственные векторы'],['inner-products','Скалярные произведения'],['orthogonality','Ортогональность'],['orthogonal-projections','Ортогональные проекции'],['determinants','Определители'],['matrix-decompositions','Разложения матриц'],['svd','Сингулярное разложение'],
  ]},
  { id:'probability', world:'math', title:'Теория вероятностей', level:'undergraduate', nodes:[
    ['probability-spaces','Вероятностные пространства'],['conditional-probability','Условная вероятность'],['independence','Независимость событий'],['random-variables','Случайные величины'],['expectation','Математическое ожидание'],['variance','Дисперсия'],['covariance','Ковариация'],['distributions','Распределения'],['conditional-distributions','Условные распределения'],['limit-theorems','Предельные теоремы'],['law-large-numbers','Закон больших чисел'],['central-limit-theorem','Центральная предельная теорема'],
  ]},
  { id:'statistics', world:'math', title:'Статистика', level:'undergraduate', nodes:[
    ['descriptive-statistics','Описательная статистика'],['sampling','Выборки и выборочные методы'],['estimation','Оценивание параметров'],['confidence-intervals','Доверительные интервалы'],['hypothesis-testing','Проверка гипотез'],['regression','Регрессия'],['correlation','Корреляция'],['bayesian-statistics','Байесовская статистика'],['statistical-inference','Статистический вывод'],
  ]},
  { id:'differential-equations', world:'math', title:'Дифференциальные уравнения', level:'undergraduate', nodes:[
    ['ode','Обыкновенные дифференциальные уравнения'],['first-order-equations','Уравнения первого порядка'],['higher-order-equations','Уравнения высших порядков'],['ode-systems','Системы уравнений'],['stability','Устойчивость решений'],['pde','Уравнения в частных производных'],['boundary-value-problems','Краевые задачи'],['fourier-methods','Методы Фурье'],
  ]},
  { id:'numerical-mathematics', world:'math', title:'Численная математика', level:'undergraduate', nodes:[
    ['numerical-methods','Численные методы'],['numerical-linear-algebra','Численная линейная алгебра'],['numerical-integration','Численное интегрирование'],['numerical-differentiation','Численное дифференцирование'],['root-finding','Решение уравнений'],['approximation','Аппроксимация'],['error-analysis','Анализ погрешностей'],['numerical-optimization','Численная оптимизация'],
  ]},
  { id:'advanced-mathematics', world:'math', title:'Продвинутая математика', level:'graduate', nodes:[
    ['real-analysis','Вещественный анализ'],['complex-analysis','Комплексный анализ'],['abstract-algebra','Абстрактная алгебра'],['group-theory','Теория групп'],['ring-theory','Теория колец'],['field-theory','Теория полей'],['galois-theory','Теория Галуа'],['number-theory','Теория чисел'],['algebraic-number-theory','Алгебраическая теория чисел'],['topology','Топология'],['algebraic-topology','Алгебраическая топология'],['differential-geometry','Дифференциальная геометрия'],['riemannian-geometry','Риманова геометрия'],['functional-analysis','Функциональный анализ'],['measure-theory','Теория меры'],['operator-theory','Теория операторов'],['category-theory','Теория категорий'],['representation-theory','Теория представлений'],['algebraic-geometry','Алгебраическая геометрия'],['mathematical-logic','Математическая логика'],['set-theory','Теория множеств'],['model-theory','Теория моделей'],['commutative-algebra','Коммутативная алгебра'],['optimization','Оптимизация'],['convex-analysis','Выпуклый анализ'],['stochastic-processes','Случайные процессы'],['stochastic-calculus','Стохастический анализ'],['dynamical-systems','Динамические системы'],['ergodic-theory','Эргодическая теория'],['information-theory','Теория информации'],['game-theory','Теория игр'],['mathematical-physics','Математическая физика'],
  ]},
  { id:'mathematics-research', world:'math', title:'Исследования в математике', level:'research', nodes:[
    ['open-problems','Открытые проблемы'],['conjectures','Гипотезы и предположения'],['millennium-problems','Задачи тысячелетия'],['famous-theorems','Знаменитые теоремы'],['historical-problems','Исторические проблемы'],['active-research-math','Активные области исследований'],['math-research-papers','Научные статьи по математике'],
  ]},
  { id:'physics-foundations', world:'physics', title:'Основы физики', level:'foundation', nodes:[
    ['units','Единицы измерения'],['measurement','Измерения'],['physics-vectors','Векторы в физике'],['motion','Движение'],['forces','Силы'],['energy','Энергия'],['momentum','Импульс'],['gravity','Гравитация'],['fluids','Механика жидкостей'],['thermodynamics','Термодинамика'],['waves','Волны'],['sound','Звук'],['electricity','Электричество'],['magnetism','Магнетизм'],['optics','Оптика'],
  ]},
  { id:'classical-physics', world:'physics', title:'Классическая физика', level:'undergraduate', nodes:[
    ['classical-mechanics','Классическая механика'],['lagrangian-mechanics','Механика Лагранжа'],['hamiltonian-mechanics','Механика Гамильтона'],['electromagnetism','Электромагнетизм'],['statistical-mechanics','Статистическая механика'],['geometrical-optics','Геометрическая оптика'],['physical-optics','Физическая оптика'],
  ]},
  { id:'modern-physics', world:'physics', title:'Современная физика', level:'undergraduate', nodes:[
    ['relativity','Специальная теория относительности'],['general-relativity','Общая теория относительности'],['quantum-mechanics','Квантовая механика'],['atomic-physics','Атомная физика'],['nuclear-physics','Ядерная физика'],['particle-physics','Физика частиц'],['condensed-matter','Физика конденсированного состояния'],['plasma-physics','Физика плазмы'],['astrophysics','Астрофизика'],['cosmology','Космология'],
  ]},
  { id:'advanced-physics', world:'physics', title:'Продвинутая физика', level:'graduate', nodes:[
    ['quantum-field-theory','Квантовая теория поля'],['quantum-electrodynamics','Квантовая электродинамика'],['general-relativistic-physics','Релятивистская гравитация'],['statistical-field-theory','Статистическая теория поля'],['quantum-information','Квантовая информация'],['computational-physics','Вычислительная физика'],
  ]},
  { id:'physics-research', world:'physics', title:'Исследования в физике', level:'research', nodes:[
    ['physics-open-problems','Открытые проблемы физики'],['current-physics-research','Современные направления исследований'],['physics-research-papers','Научные статьи по физике'],['experimental-physics','Экспериментальная физика'],['computational-physics','Вычислительная физика'],
  ]},
  { id:'cs-programming', world:'cs', title:'Программирование', level:'foundation', nodes:[
    ['programming','Программирование'],['python','Python'],['software-engineering','Разработка ПО'],['git','Git и контроль версий'],['testing','Тестирование'],
  ]},
  { id:'cs-algorithms', world:'cs', title:'Алгоритмы и структуры данных', level:'undergraduate', nodes:[
    ['data-structures','Структуры данных'],['algorithms','Алгоритмы'],['complexity','Сложность алгоритмов'],['recursion','Рекурсия'],['graph-theory','Теория графов'],
  ]},
  { id:'cs-systems', world:'cs', title:'Системы и инфраструктура', level:'undergraduate', nodes:[
    ['operating-systems','Операционные системы'],['networking','Компьютерные сети'],['databases','Базы данных'],['sql','SQL'],['computer-architecture','Архитектура компьютеров'],['distributed-systems','Распределённые системы'],['security','Безопасность'],
  ]},
  { id:'ai-foundations', world:'ai', title:'Основы AI', level:'foundation', nodes:[
    ['what-is-computer','Что такое компьютер?'],['what-is-programming','Что такое программирование?'],['algorithm-basics','Что такое алгоритм?'],['data-basics','Что такое данные?'],['what-is-ai','Что такое искусственный интеллект?'],
  ]},
  { id:'ai-computer-science', world:'ai', title:'Computer Science для AI', level:'undergraduate', nodes:[
    ['python','Python'],['algorithms','Алгоритмы'],['data-structures','Структуры данных'],['complexity','Сложность алгоритмов'],['databases','Базы данных'],
  ]},
  { id:'ai-mathematics', world:'ai', title:'Математика для AI', level:'undergraduate', nodes:[
    ['linear-algebra','Линейная алгебра'],['calculus','Математический анализ'],['probability','Теория вероятностей'],['statistics','Статистика'],['optimization','Оптимизация'],
  ]},
  { id:'machine-learning', world:'ai', title:'Машинное обучение', level:'undergraduate', nodes:[
    ['machine-learning','Машинное обучение'],['regression','Регрессия'],['classification','Классификация'],['clustering','Кластеризация'],['decision-trees','Деревья решений'],['support-vector-machines','Метод опорных векторов'],['model-evaluation','Оценка моделей'],
  ]},
  { id:'deep-learning', world:'ai', title:'Глубокое обучение', level:'undergraduate', nodes:[
    ['neural-networks','Нейронные сети'],['backpropagation','Обратное распространение ошибки'],['deep-learning','Глубокое обучение'],['cnn','Свёрточные сети'],['recurrent-networks','Рекуррентные сети'],['transformers','Трансформеры'],
  ]},
  { id:'ai-applied', world:'ai', title:'Направления AI', level:'undergraduate', nodes:[
    ['computer-vision','Компьютерное зрение'],['nlp','Обработка естественного языка'],['reinforcement-learning','Обучение с подкреплением'],
  ]},
  { id:'generative-ai', world:'ai', title:'Генеративный AI', level:'graduate', nodes:[
    ['generative-ai','Генеративный AI'],['transformers','Трансформеры'],['llm','Большие языковые модели'],['multimodal-ai','Мультимодальный AI'],
  ]},
  { id:'ai-engineering', world:'ai', title:'AI Systems и Engineering', level:'advanced', nodes:[
    ['agents','AI-агенты'],['ai-systems','AI-системы'],['ai-engineering','AI Engineering'],['mlops','MLOps'],['llmops','LLMOps'],
  ]},
  { id:'ai-research', world:'ai', title:'Исследования в AI', level:'research', nodes:[
    ['ai-research','Исследования в AI'],['ai-safety','Безопасность и надёжность AI'],['evaluation','Оценка AI-систем'],['efficient-inference','Эффективный инференс'],
  ]},
];
const existingTopicIds = new Set(topics.map(topic => topic.id));
const curriculumMembership = new Map();
for (const category of curriculum) {
  for (const [id, title] of category.nodes) {
    curriculumMembership.set(id, category.id);
    if (existingTopicIds.has(id)) continue;
    const level = category.level;
    topics.push(t(id, category.world, title, `Раздел направления «${category.title}». Структурированная программа и материалы будут добавляться постепенно.`, level, [], [], [], [], category.title));
    existingTopicIds.add(id);
  }
}

const taxonomy = curriculum.map(({id,world,title,level,nodes}) => ({ id, world, title, level, children: nodes.map(([topicId])=>topicId) }));
topics.forEach(topic => { topic.taxonomyId = curriculumMembership.get(topic.id) || topic.taxonomyId; });
const searchAliases = {
  derivatives: ['derivative','differentiation','rate of change'],
  'partial-derivatives': ['partial derivative'],
  'chain-rule': ['chain rule','derivative'],
  gradient: ['gradient descent','derivative','gradient'],
  backpropagation: ['derivative','chain rule','backprop'],
  optimization: ['derivative','gradient descent'],
};
topics.forEach(topic => { topic.aliases = searchAliases[topic.id] || []; });
const taxonomyEdges = [
  ['foundations','pre-algebra'],['pre-algebra','algebra'],['algebra','geometry'],['algebra','trigonometry'],['algebra','discrete-mathematics'],
  ['algebra','calculus'],['algebra','linear-algebra'],['algebra','probability'],['calculus','differential-equations'],['calculus','numerical-mathematics'],
  ['linear-algebra','advanced-mathematics'],['calculus','advanced-mathematics'],['probability','statistics'],['statistics','advanced-mathematics'],['advanced-mathematics','mathematics-research'],
  ['physics-foundations','classical-physics'],['classical-physics','modern-physics'],['modern-physics','advanced-physics'],['advanced-physics','physics-research'],
  ['cs-programming','cs-algorithms'],['cs-programming','cs-systems'],
  ['ai-foundations','ai-computer-science'],['ai-computer-science','ai-mathematics'],['ai-mathematics','machine-learning'],['machine-learning','deep-learning'],['deep-learning','ai-applied'],['deep-learning','generative-ai'],['generative-ai','ai-engineering'],['ai-engineering','ai-research'],
];

// Explicit cross-world paths power graph views and keep prerequisite links navigable.
const linkPath = ids => ids.slice(0, -1).forEach((source, i) => {
  const target = ids[i + 1]; const node = topics.find(topic => topic.id === source);
  if (node && !node.next.includes(target)) node.next.push(target);
  if (node && !node.relations.leadsTo.some(edge => edge.target === target)) node.relations.leadsTo.push({ target, kind:'leads-to' });
});
linkPath(['numbers','fractions','algebra','functions','limits','derivatives','gradient','machine-learning','neural-networks','backpropagation','deep-learning','transformers','llm','ai-systems','ai-engineering','ai-research']);
linkPath(['mechanics','classical-mechanics','differential-equations','lagrangian-mechanics','quantum-mechanics','quantum-field-theory','particle-physics']);

// Optional learning material lives on the nodes too; the UI can grow without changing this schema.
const enrich = (id, additions) => Object.assign(topics.find(topic => topic.id === id), additions);
enrich('derivatives', { formulas: [{ label: 'Производная в точке', tex: "f'(a)=\\lim_{h\\to 0}\\frac{f(a+h)-f(a)}{h}" }], derivation: ['Секущая задаёт среднюю скорость изменения на отрезке.', 'При уменьшении отрезка её наклон приближается к наклону касательной.'], practiceTasks: [{ type: 'conceptual', prompt: 'Что означает знак производной для графика функции?' }] });
enrich('gradient', { formulas: [{ label: 'Шаг градиентного спуска', tex: '\\theta_{t+1}=\\theta_t-\\eta\\nabla J(\\theta_t)' }], derivation: ['В точке θ градиент указывает направление наибольшего роста функции J.', 'Чтобы уменьшить J, двигаемся в противоположную сторону на шаг, размер которого задаёт η.'], practiceTasks: [{ type: 'calculation', prompt: 'Как изменится шаг, если удвоить learning rate η?' }] });
enrich('backpropagation', { formulas: [{ label: 'Правило цепочки', tex: '\\frac{\\partial L}{\\partial x}=\\frac{\\partial L}{\\partial y}\\frac{\\partial y}{\\partial x}' }], derivation: ['Разложи вычисление сети на последовательность функций.', 'Передавай градиент от выхода к входу, умножая локальные производные.'], practiceTasks: [{ type: 'calculation', prompt: 'Найди градиент композиции двух простых функций по правилу цепочки.' }] });
enrich('probability', { formulas: [{ label: 'Сумма вероятностей', tex: '\\sum_{i=1}^{n}P(A_i)=1' }], practiceTasks: [{ type: 'calculation', prompt: 'Какие значения может принимать вероятность события?' }] });
enrich('quantum-mechanics', { knowledgeStatus: 'empirical_result', statusNote: 'Ключевые предсказания теории проверены экспериментально; конкретные утверждения сопровождаются источниками.' });

const topicMap = new Map(topics.map(topic => [topic.id, topic]));
const getTopic = id => topicMap.get(id);
const getWorldTopics = id => topics.filter(topic => topic.world === id);

window.MindContent = { levels, supportedLocales, knowledgeStatuses, worlds, topics, taxonomy, taxonomyEdges, topicMap, getTopic, getWorldTopics };
})();
