
Write-Host "Go to dir api..."
Set-Location -Path "D:\iron\api"

Write-Host "Activate venv..."
& "D:\iron\api\venvtest\Scripts\Activate.ps1"

Write-Host "Run api..."
python .\api.py
