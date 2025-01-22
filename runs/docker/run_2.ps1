# Определение, какой тип контейнеров будет использоваться (Linux или Windows)

$containerType = "Linux"  # Или "Windows", в зависимости от вашей конфигурации

if ($containerType -eq "Linux") {
    & 'C:\Program Files\Docker\Docker\DockerCli.exe' -SwitchDaemon

    Write-Host "Switch container type..."
}

Write-Host "Run iron_back port 5001..."
docker run -d -p 5001:5001 aapavl/iron_back

Write-Host "Run iron_front port 3000..."
docker run -d -p 3000:80 aapavl/iron_front

Write-Host "All runs (Windows)."

