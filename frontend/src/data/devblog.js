export const devblogPosts = [
  {
    id: 'next-animations',
    title: 'Микроанимации в интерфейсе: как оживить продукт',
    excerpt: 'Покажу паттерны анимаций, которые мы используем на сайте: fade, scale, parallax и как не переборщить.',
    date: '15.10.2025',
    readTime: '5 мин',
    tag: 'Frontend',
    cover: '/devblog/images/covers/next-animations-cover.png',
    blocks: [
      { type: 'p', text: 'Микроанимации помогают пользователю чувствовать интерфейс живым и отзывчивым. Важно соблюдать баланс между динамикой и продуктивностью.' },
      { type: 'h3', text: 'Правила анимаций' },
      { type: 'p', text: 'Продолжительность 150–300 мс, кривая bezier для естественности, анимация по оси Z через scale для глубины.' },
      { type: 'img', src: '/services/ui-ux-design.png', caption: 'Комбинация fade + scale' },
      { type: 'code', code: 'transition: transform 250ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 250ms ease;\ntransform: translateY(-4px) scale(1.01);' },
      { type: 'quote', text: 'Анимация — это не украшение, а язык интерфейса.' }
    ]
  },
  {
    id: 'backend-arch',
    title: 'Мини-сервисы на FastAPI: структура и миграции',
    excerpt: 'Разбираем, как организовать API, модели и миграции так, чтобы проект легко рос.',
    date: '10.10.2025',
    readTime: '6 мин',
    tag: 'Backend',
    cover: '/devblog/images/covers/backend-arch-cover.png',
    blocks: [
      { type: 'p', text: 'FastAPI отлично подходит для модульной архитектуры. Выделяем домены по функциональным областям.' },
      { type: 'h3', text: 'Модели и миграции' },
      { type: 'p', text: 'Используем Alembic, храним версии четко по фичам, добавляем CLI для автогенерации.' },
      { type: 'img', src: '/services/web-development.png', caption: 'Схема модулей' }
    ]
  },
  {
    id: 'design-system',
    title: 'Цвет и контраст: читаемость в темной теме',
    excerpt: 'Поделюсь принципами работы с контрастом, когда фон темный, а акцент — неоновый.',
    date: '05.10.2025',
    readTime: '4 мин',
    tag: 'Design',
    cover: '/devblog/images/covers/design-system-cover.png',
    blocks: [
      { type: 'p', text: 'Тёмная тема требует повышенного внимания к контрасту, насыщенности и светлоте. Неоновый акцент лучше дозировать.' },
      { type: 'h3', text: 'Практика' },
      { type: 'p', text: 'Ставим текст rgba(255,255,255,0.85), разделители — 0.25, а акцент — #A6F00C.' },
      { type: 'img', src: '/vectors/11.png', caption: 'Акцент и фон' }
    ]
  },
  {
    id: 'react-performance',
    title: 'React оптимизация: мемоизация и ленивая загрузка',
    excerpt: 'Как ускорить React приложения с помощью useMemo, useCallback и React.lazy без переусложнения.',
    date: '20.10.2025',
    readTime: '7 мин',
    tag: 'React',
    cover: '/devblog/images/covers/react-performance-cover.png',
    blocks: [
      { type: 'p', text: 'Производительность React приложений часто страдает от лишних ре-рендеров. Покажу, как правильно использовать мемоизацию.' },
      { type: 'h3', text: 'useMemo vs useCallback' },
      { type: 'p', text: 'useMemo для вычислений, useCallback для функций. Важно не мемоизировать всё подряд — это может замедлить приложение.' },
      { type: 'code', code: 'const expensiveValue = useMemo(() => {\n  return heavyCalculation(data);\n}, [data]);\n\nconst handleClick = useCallback((id) => {\n  onItemClick(id);\n}, [onItemClick]);' },
      { type: 'img', src: '/services/web-development.png', caption: 'React DevTools Profiler' }
    ]
  },
  {
    id: 'docker-optimization',
    title: 'Docker образы: от 2GB до 50MB за 5 шагов',
    excerpt: 'Практические советы по уменьшению размера Docker образов для production приложений.',
    date: '18.10.2025',
    readTime: '8 мин',
    tag: 'DevOps',
    cover: '/devblog/images/covers/docker-optimization-cover.png',
    blocks: [
      { type: 'p', text: 'Большие Docker образы замедляют деплой и увеличивают расходы. Покажу, как оптимизировать образы для production.' },
      { type: 'h3', text: 'Multi-stage builds' },
      { type: 'p', text: 'Используем multi-stage builds для отделения build-зависимостей от runtime. Это может сократить образ в 10 раз.' },
      { type: 'code', code: 'FROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\nFROM node:18-alpine AS runtime\nWORKDIR /app\nCOPY --from=builder /app .\nCMD ["node", "index.js"]' },
      { type: 'img', src: '/services/hosting-maintenance.png', caption: 'Размер до и после оптимизации' }
    ]
  },
  {
    id: 'telegram-bot-architecture',
    title: 'Telegram боты: масштабируемая архитектура',
    excerpt: 'Как построить Telegram бота, который выдержит тысячи пользователей и не упадет под нагрузкой.',
    date: '12.10.2025',
    readTime: '9 мин',
    tag: 'Telegram',
    cover: '/devblog/images/covers/telegram-bot-architecture-cover.png',
    blocks: [
      { type: 'p', text: 'Telegram боты могут обрабатывать миллионы сообщений. Покажу архитектуру для высоконагруженных ботов.' },
      { type: 'h3', text: 'Очереди и Redis' },
      { type: 'p', text: 'Используем Redis для очередей сообщений, PostgreSQL для данных, и горизонтальное масштабирование воркеров.' },
      { type: 'code', code: 'import asyncio\nfrom aiogram import Bot\nfrom redis import Redis\n\nbot = Bot(token=TOKEN)\nredis = Redis()\n\nasync def process_message(user_id, message):\n    await redis.lpush("messages", json.dumps({\n        "user_id": user_id,\n        "text": message\n    }))' },
      { type: 'img', src: '/services/telegram-bots.png', caption: 'Архитектура бота' }
    ]
  },
  {
    id: 'css-grid-magic',
    title: 'CSS Grid: магия современной верстки',
    excerpt: 'От простых сеток до сложных макетов — покажу все возможности CSS Grid с примерами.',
    date: '08.10.2025',
    readTime: '6 мин',
    tag: 'CSS',
    cover: '/devblog/images/covers/css-grid-magic-cover.png',
    blocks: [
      { type: 'p', text: 'CSS Grid — это революция в верстке. Одна технология заменяет флоаты, флексы и сложные хаки.' },
      { type: 'h3', text: 'Grid vs Flexbox' },
      { type: 'p', text: 'Grid для двумерных макетов, Flexbox для одномерных. Grid лучше для общих макетов страниц.' },
      { type: 'code', code: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 2rem;\n  grid-auto-rows: minmax(200px, auto);\n}' },
      { type: 'img', src: '/services/ui-ux-design.png', caption: 'Сложный макет на Grid' }
    ]
  },
  {
    id: 'api-security',
    title: 'API безопасность: защита от атак',
    excerpt: 'JWT токены, rate limiting, CORS и другие способы защитить API от злоумышленников.',
    date: '03.10.2025',
    readTime: '10 мин',
    tag: 'Security',
    cover: '/devblog/images/covers/api-security-cover.png',
    blocks: [
      { type: 'p', text: 'Безопасность API критически важна. Покажу основные уязвимости и способы защиты.' },
      { type: 'h3', text: 'OWASP Top 10' },
      { type: 'p', text: 'Инъекции, небезопасная аутентификация, чувствительные данные — разбираем основные угрозы.' },
      { type: 'code', code: 'from fastapi import FastAPI, Depends, HTTPException\nfrom fastapi.security import HTTPBearer\nimport jwt\n\nsecurity = HTTPBearer()\n\ndef verify_token(token: str = Depends(security)):\n    try:\n        payload = jwt.decode(token.credentials, SECRET_KEY)\n        return payload\n    except jwt.InvalidTokenError:\n        raise HTTPException(401, "Invalid token")' },
      { type: 'img', src: '/services/web-development.png', caption: 'Схема аутентификации' }
    ]
  }
];


