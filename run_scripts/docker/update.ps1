# Получаем информацию о текущем Docker
$dockerInfo = docker info

# Определяем тип контейнера (Linux или Windows) на основе OSType
if ($dockerInfo -match "OSType: (.*)") {
    $containerType = $matches[1]
    Write-Host "Current container type: $containerType"
} else {
    Write-Host "Unable to determine container type. Please check Docker info."
    exit 1
}

Write-Host "Current container type: $containerType"

if ($containerType -eq "Windows") {
    & 'C:\Program Files\Docker\Docker\DockerCli.exe' -SwitchDaemon
    Write-Host "Switched container type to Linux."
}

Write-Host "Pulling images for iron_stream:latest..."
docker pull aapavl/iron_stream:latest

# Переключаем контейнеры обратно на Windows
& 'C:\Program Files\Docker\Docker\DockerCli.exe' -SwitchDaemon
Write-Host "Switched container type back to Windows."

Write-Host "Pulling images for iron_back:latest..."
docker pull aapavl/iron_back:latest

Write-Host "Pulling images for iron_front:latest..."
docker pull aapavl/iron_front:latest

Write-Host "All update completed."
