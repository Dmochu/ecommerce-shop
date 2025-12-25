# PowerShell script to deploy to Vercel
Write-Host "Starting Vercel deployment..."

# Set up the deployment
$input = "y"
$input | vercel deploy --prod

Write-Host "Deployment completed!"
