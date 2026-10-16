# Notifies the showcase site that the content repository changed.
#
# The site keeps itself in sync by rebuilding whenever it receives a
# `content-updated` repository_dispatch event. GitHub's default GITHUB_TOKEN
# cannot trigger a workflow in another repository, so this needs a token with
# access to the site repo, supplied via the SITE_DISPATCH_TOKEN environment
# variable (a fine-grained PAT with "Contents: read and write" on the site
# repository is enough).
#
# Usage:
#   $env:SITE_DISPATCH_TOKEN = '<token>'
#   pwsh -File tools/notify-site.ps1
#
# Without the token the script reports that it is skipping and exits 0, so a
# local commit never fails just because the notification could not be sent.
[CmdletBinding()]
param(
  [string]$SiteRepo = 'l4place0-cloud/ai-lab-site',
  [string]$EventType = 'content-updated'
)

$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$token = $env:SITE_DISPATCH_TOKEN
if ([string]::IsNullOrWhiteSpace($token)) {
  Write-Output 'SITE_DISPATCH_TOKEN is not set; skipping site notification.'
  exit 0
}

$head = (git rev-parse HEAD 2>$null)
if ($LASTEXITCODE -ne 0) { $head = 'unknown' }

$body = @{
  event_type     = $EventType
  client_payload = @{
    sha       = $head
    repo      = 'l4place0/ai-lab'
    ref       = 'main'
    triggered = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
  }
} | ConvertTo-Json -Depth 4

$uri = "https://api.github.com/repos/$SiteRepo/dispatches"
try {
  Invoke-RestMethod -Method Post -Uri $uri -Body $body -TimeoutSec 30 -Headers @{
    Authorization          = "Bearer $token"
    Accept                 = 'application/vnd.github+json'
    'X-GitHub-Api-Version' = '2022-11-28'
    'User-Agent'           = 'ai-lab-content'
  } | Out-Null
  Write-Output "notified $SiteRepo ($EventType) at $head"
}
catch {
  # A failed notification must not fail the commit; the site also rebuilds on
  # its own scheduled runs and can be triggered manually.
  Write-Warning "could not notify $SiteRepo : $($_.Exception.Message)"
  exit 0
}
