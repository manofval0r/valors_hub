$output = @()
Get-ChildItem -Path "c:\CD STF" -Directory | ForEach-Object {
    $repo = $_.FullName
    if (Test-Path "$repo\.git") {
        Push-Location $repo
        $first = git log --reverse --format="%ci" 2>$null | Select-Object -First 1
        $last = git log -1 --format="%ci" 2>$null
        $count = git rev-list --count HEAD 2>$null
        $output += [PSCustomObject]@{
            Project = $_.Name
            FirstCommit = $first
            LastCommit = $last
            CommitCount = $count
        }
        Pop-Location
    }
}
$output | Format-Table -AutoSize
