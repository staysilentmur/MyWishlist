# Инструкция по настройке GitHub Pages

## Проблема: белый экран или ошибка 404 для main.jsx

Если вы видите ошибку `GET https://staysilentmur.github.io/src/main.jsx 404`, это означает, что GitHub Pages использует неправильный источник.

## Решение:

### 1. Проверьте настройки GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе **Source** должно быть выбрано: **GitHub Actions** (НЕ "Deploy from a branch")
4. Если выбрано "Deploy from a branch" - измените на **GitHub Actions**
5. Сохраните изменения

### 2. Убедитесь, что workflow выполнен

1. Перейдите во вкладку **Actions**
2. Найдите последний workflow "Deploy to GitHub Pages"
3. Убедитесь, что он завершился успешно (зеленая галочка)
4. Если есть ошибки - проверьте логи

### 3. Запустите деплой вручную (если нужно)

1. Перейдите во вкладку **Actions**
2. Выберите workflow "Deploy to GitHub Pages"
3. Нажмите **Run workflow** → **Run workflow**

### 4. Очистите кеш браузера

- Нажмите **Ctrl+Shift+Delete** (Windows) или **Cmd+Shift+Delete** (Mac)
- Выберите "Кэшированные изображения и файлы"
- Или откройте сайт в режиме инкогнито

### 5. Проверьте URL

Убедитесь, что открываете правильный URL:
- ✅ Правильно: `https://staysilentmur.github.io/wishlist/`
- ❌ Неправильно: `https://staysilentmur.github.io/`

## После исправления настроек:

1. Сделайте любой коммит и пуш, чтобы запустить workflow:
```bash
git add .
git commit -m "Trigger deployment"
git push origin main
```

2. Дождитесь завершения деплоя (2-3 минуты)
3. Обновите страницу с очисткой кеша

