# Skrypt do wrzucenia projektu na GitHub
# Uruchom ten skrypt po zainstalowaniu Gita

Write-Host "=== Konfiguracja Git i GitHub ===" -ForegroundColor Cyan

# Sprawdź czy git jest zainstalowany
try {
    $gitVersion = git --version
    Write-Host "✓ Git jest zainstalowany: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git nie jest zainstalowany!" -ForegroundColor Red
    Write-Host "Zainstaluj Git z: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Sprawdź czy repozytorium już istnieje
if (Test-Path .git) {
    Write-Host "✓ Repozytorium git już istnieje" -ForegroundColor Green
} else {
    Write-Host "Inicjalizacja repozytorium git..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Repozytorium zainicjowane" -ForegroundColor Green
}

# Sprawdź czy są jakieś commity
$hasCommits = git rev-parse --verify HEAD 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Istnieją już commity" -ForegroundColor Green
} else {
    Write-Host "Dodawanie plików do repozytorium..." -ForegroundColor Yellow
    git add .
    
    Write-Host "Tworzenie pierwszego commita..." -ForegroundColor Yellow
    git commit -m "Initial commit: ecommerce shop project"
    Write-Host "✓ Pierwszy commit utworzony" -ForegroundColor Green
}

# Sprawdź czy jest skonfigurowany remote
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Remote 'origin' już jest skonfigurowany: $remote" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "=== Następne kroki ===" -ForegroundColor Cyan
    Write-Host "1. Utwórz nowe repozytorium na GitHub:" -ForegroundColor Yellow
    Write-Host "   - Wejdź na https://github.com/new" -ForegroundColor White
    Write-Host "   - Wpisz nazwę repozytorium (np. 'ecommerce-shop')" -ForegroundColor White
    Write-Host "   - NIE zaznaczaj 'Initialize with README'" -ForegroundColor White
    Write-Host "   - Kliknij 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Po utworzeniu repozytorium, uruchom następujące komendy:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/TWOJA_NAZWA_UZYTKOWNIKA/ecommerce-shop.git" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "LUB jeśli używasz SSH:" -ForegroundColor Yellow
    Write-Host "   git remote add origin git@github.com:TWOJA_NAZWA_UZYTKOWNIKA/ecommerce-shop.git" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Status repozytorium ===" -ForegroundColor Cyan
git status

