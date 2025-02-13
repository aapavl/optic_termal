Write-Host "Stopping iron_back container..."
docker stop $(docker ps -q --filter "ancestor=aapavl/iron_back")

Write-Host "Stopping iron_front container..."
docker stop $(docker ps -q --filter "ancestor=aapavl/iron_front")

Write-Host "All containers stopped."
