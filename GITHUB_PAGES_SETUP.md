# Инструкция по настройке GitHub Pages

## Проблема: Jekyll workflow вместо нашего

Если вы видите сообщение "Your site was last deployed by the Deploy Jekyll workflow", это означает, что GitHub использует автоматический Jekyll workflow вместо нашего.

## Решение:

### 1. Удалите Jekyll workflow (уже сделано)
Файл `.github/workflows/jekyll-gh-pages.yml` был удален.

### 2. Измените настройки GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе **Source** выберите: **GitHub Actions** (НЕ "Deploy from a branch")
4. Если там написано "Deploy from a branch" или "Jekyll" - измените на **GitHub Actions**
5. Сохраните изменения

### 3. Закоммитьте и запушьте изменения

```bash
git add .
git commit -m "Remove Jekyll workflow and use custom GitHub Actions"
git push origin main
```

### 4. Проверьте деплой

1. Перейдите во вкладку **Actions**
2. Найдите workflow "Deploy to GitHub Pages" (НЕ "Deploy Jekyll")
3. Убедитесь, что он запустился и завершился успешно
4. Дождитесь завершения (2-3 минуты)

### 5. Проверьте сайт

После успешного деплоя откройте:
- `https://staysilentmur.github.io/wishlist/`

Очистите кеш браузера (Ctrl+Shift+R) если нужно.

## Важно:

- В настройках Pages должен быть выбран **GitHub Actions** как источник
- Jekyll workflow должен быть удален (уже сделано)
- Наш workflow "Deploy to GitHub Pages" должен быть активным

