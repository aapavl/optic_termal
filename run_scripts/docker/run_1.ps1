# Сначала запускаем Linux контейнер
Write-Host "Run iron_stream port 5000 (Linux)..."
docker run -d -p 5000:5000 aapavl/iron_stream

# После этого запускаем Windows контейнеры
Write-Host "Run iron_back port 5001 (Windows)..."
docker run -d -p 5001:5001 aapavl/iron_back

Write-Host "Run iron_front port 3000 (Windows)..."
docker run -d -p 3000:80 aapavl/iron_front

Write-Host "All runs completed."
