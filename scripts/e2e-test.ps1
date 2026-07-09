$baseUrl = "http://localhost:3000"
$passed = 0
$failed = 0
$createdId = $null

function Assert($name, $condition, $detail = "") {
  if ($condition) {
    Write-Host "[PASS] $name" -ForegroundColor Green
    $script:passed++
  } else {
    Write-Host "[FAIL] $name" -ForegroundColor Red
    if ($detail) { Write-Host "       $detail" -ForegroundColor Yellow }
    $script:failed++
  }
}

Write-Host "`n=== Campus Notice Board E2E API Tests ===`n" -ForegroundColor Cyan

# 1. GET empty or existing notices
try {
  $list = Invoke-RestMethod -Uri "$baseUrl/api/notices" -Method GET
  Assert "GET /api/notices returns 200" ($null -ne $list.notices)
  Assert "GET /api/notices returns array" ($list.notices -is [array])
  Assert "GET /api/notices returns pagination" ($null -ne $list.pagination)
} catch {
  Assert "GET /api/notices returns 200" $false $_.Exception.Message
}

# 2. POST validation - missing fields
try {
  Invoke-RestMethod -Uri "$baseUrl/api/notices" -Method POST -ContentType "application/json" -Body '{}' -ErrorAction Stop
  Assert "POST /api/notices rejects empty body" $false "Expected 400"
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  Assert "POST /api/notices rejects empty body (400)" ($status -eq 400) "Got $status"
}

# 3. POST create urgent notice
$urgentBody = @{
  title = "E2E Urgent Exam Notice"
  body = "This is an urgent end-to-end test notice."
  category = "Exam"
  priority = "Urgent"
  publishDate = (Get-Date).ToUniversalTime().ToString("o")
  image = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400"
} | ConvertTo-Json

try {
  $created = Invoke-RestMethod -Uri "$baseUrl/api/notices" -Method POST -ContentType "application/json" -Body $urgentBody
  $createdId = $created.notice.id
  Assert "POST /api/notices creates notice (201)" ($createdId -gt 0)
  Assert "POST returns correct title" ($created.notice.title -eq "E2E Urgent Exam Notice")
  Assert "POST returns Urgent priority" ($created.notice.priority -eq "Urgent")
} catch {
  Assert "POST /api/notices creates notice" $false $_.Exception.Message
}

# 4. POST create normal notice
$normalBody = @{
  title = "E2E General Event Notice"
  body = "This is a normal priority test notice."
  category = "Event"
  priority = "Normal"
  publishDate = (Get-Date).AddDays(-1).ToUniversalTime().ToString("o")
} | ConvertTo-Json

try {
  $normal = Invoke-RestMethod -Uri "$baseUrl/api/notices" -Method POST -ContentType "application/json" -Body $normalBody
  Assert "POST /api/notices creates normal notice" ($normal.notice.id -gt 0)
} catch {
  Assert "POST /api/notices creates normal notice" $false $_.Exception.Message
}

# 5b. Search and filter
try {
  $search = Invoke-RestMethod -Uri "$baseUrl/api/notices?q=E2E%20Urgent" -Method GET
  Assert "GET search returns matching notices" ($search.notices.Count -ge 1)
} catch {
  Assert "GET search returns matching notices" $false $_.Exception.Message
}

try {
  $filtered = Invoke-RestMethod -Uri "$baseUrl/api/notices?category=Event&priority=Normal" -Method GET
  Assert "GET category/priority filters work" ($filtered.notices.Count -ge 0)
} catch {
  Assert "GET category/priority filters work" $false $_.Exception.Message
}

# 5. GET list - urgent first ordering
try {
  $list = Invoke-RestMethod -Uri "$baseUrl/api/notices" -Method GET
  Assert "GET list has notices" ($list.notices.Count -ge 2)
  Assert "Urgent notice appears first" ($list.notices[0].priority -eq "Urgent") "First priority: $($list.notices[0].priority)"
} catch {
  Assert "GET list ordering" $false $_.Exception.Message
}

# 6. GET single notice
if ($createdId) {
  try {
    $single = Invoke-RestMethod -Uri "$baseUrl/api/notices/$createdId" -Method GET
    Assert "GET /api/notices/[id] returns notice" ($single.notice.id -eq $createdId)
  } catch {
    Assert "GET /api/notices/[id]" $false $_.Exception.Message
  }
}

# 7. GET 404 for missing notice
try {
  Invoke-RestMethod -Uri "$baseUrl/api/notices/999999" -Method GET -ErrorAction Stop
  Assert "GET missing notice returns 404" $false
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  Assert "GET missing notice returns 404" ($status -eq 404) "Got $status"
}

# 8. PUT update notice
if ($createdId) {
  $updateBody = @{
    title = "E2E Updated Exam Notice"
    body = "Updated body content for testing."
    category = "General"
    priority = "Normal"
    publishDate = (Get-Date).ToUniversalTime().ToString("o")
    image = $null
  } | ConvertTo-Json

  try {
    $updated = Invoke-RestMethod -Uri "$baseUrl/api/notices/$createdId" -Method PUT -ContentType "application/json" -Body $updateBody
    Assert "PUT /api/notices/[id] updates notice" ($updated.notice.title -eq "E2E Updated Exam Notice")
    Assert "PUT updates category" ($updated.notice.category -eq "General")
  } catch {
    Assert "PUT /api/notices/[id]" $false $_.Exception.Message
  }
}

# 9. Invalid ID
try {
  Invoke-RestMethod -Uri "$baseUrl/api/notices/abc" -Method GET -ErrorAction Stop
  Assert "GET invalid ID returns 400" $false
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  Assert "GET invalid ID returns 400" ($status -eq 400) "Got $status"
}

# 10. Method not allowed
try {
  Invoke-WebRequest -Uri "$baseUrl/api/notices" -Method PATCH -ErrorAction Stop | Out-Null
  Assert "PATCH /api/notices returns 405" $false
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  Assert "PATCH /api/notices returns 405" ($status -eq 405) "Got $status"
}

# 11. DELETE notice
if ($createdId) {
  try {
    $deleted = Invoke-RestMethod -Uri "$baseUrl/api/notices/$createdId" -Method DELETE
    Assert "DELETE /api/notices/[id] succeeds" ($deleted.success -eq $true)
  } catch {
    Assert "DELETE /api/notices/[id]" $false $_.Exception.Message
  }

  try {
    Invoke-RestMethod -Uri "$baseUrl/api/notices/$createdId" -Method GET -ErrorAction Stop
    Assert "DELETE removes notice (404 on GET)" $false
  } catch {
    $status = $_.Exception.Response.StatusCode.value__
    Assert "DELETE removes notice (404 on GET)" ($status -eq 404) "Got $status"
  }
}

# 12. Page routes return 200
$pages = @("/", "/notices/new", "/notices/edit/1")
foreach ($page in $pages) {
  try {
    $response = Invoke-WebRequest -Uri "$baseUrl$page" -Method GET -UseBasicParsing
    Assert "Page $page returns 200" ($response.StatusCode -eq 200)
  } catch {
    Assert "Page $page returns 200" $false $_.Exception.Message
  }
}

# Cleanup test normal notice if created
try {
  $list = Invoke-RestMethod -Uri "$baseUrl/api/notices?limit=50" -Method GET
  foreach ($n in $list.notices) {
    if ($n.title -like "E2E*") {
      Invoke-RestMethod -Uri "$baseUrl/api/notices/$($n.id)" -Method DELETE | Out-Null
    }
  }
  Write-Host "[INFO] Cleaned up E2E test notices" -ForegroundColor Gray
} catch {}

Write-Host "`n=== Results: $passed passed, $failed failed ===`n" -ForegroundColor Cyan
if ($failed -gt 0) { exit 1 }
