# How to Use GitHub Actions Workflows

## Step 1: Commit and Push Workflow Files

The workflow files need to be committed and pushed to GitHub first:

```bash
# Add the workflow files
git add .github/workflows/build-windows-exe.yml
git add .github/workflows/build-macos-app.yml

# Commit
git commit -m "Add workflows for Windows EXE and macOS App distribution"

# Push to GitHub
git push origin main
```

## Step 2: Access GitHub Actions

1. Go to your GitHub repository
2. Click on the **"Actions"** tab (top navigation bar)
3. You should see the workflows listed:
   - "Build Windows EXE Distribution"
   - "Build macOS App Distribution"

## Step 3: Run Workflows

### Option A: Manual Run (workflow_dispatch)

After pushing the workflows:

1. Go to **Actions** tab
2. Click on **"Build Windows EXE Distribution"** (or macOS)
3. On the right side, you'll see **"Run workflow"** button
4. Click **"Run workflow"**
5. Select branch (usually `main`)
6. Optionally enter version number
7. Click **"Run workflow"** button

### Option B: Automatic Run (on tag push)

1. Create and push a tag:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. Workflows will run automatically

### Option C: Automatic Run (on main branch push)

- Just push to `main` branch
- Workflows run automatically

## Troubleshooting

### "Run workflow" button not showing?

**Possible reasons:**

1. **Workflows not pushed yet**
   - Make sure you've committed and pushed the workflow files
   - Check if `.github/workflows/build-windows-exe.yml` exists in GitHub

2. **Wrong branch**
   - Workflows are triggered on `main` branch
   - Make sure you're on `main` branch when pushing

3. **GitHub Actions disabled**
   - Go to repository Settings → Actions → General
   - Make sure "Allow all actions and reusable workflows" is enabled

4. **Workflow file syntax error**
   - Check Actions tab for error messages
   - Verify YAML syntax is correct

### Check if workflows are visible:

1. Go to repository on GitHub
2. Click **Actions** tab
3. You should see workflow names in the left sidebar
4. If empty, workflows haven't been pushed yet

### Verify workflow files exist:

```bash
# Check locally
ls -la .github/workflows/

# Should see:
# build-windows-exe.yml
# build-macos-app.yml
```

## Quick Test

To test if workflows work:

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add distribution workflows"
   git push origin main
   ```

2. **Go to GitHub → Actions tab**

3. **You should see:**
   - Workflow runs (may be running or completed)
   - "Run workflow" button on the right

4. **If workflows ran automatically:**
   - Click on a workflow run
   - Check the logs
   - Download artifacts when complete

## Expected Workflow Behavior

### On Push to Main:
- Workflows run automatically
- Check Actions tab for status

### On Tag Push:
- Workflows run automatically
- Creates GitHub Release
- Uploads distribution files

### Manual Trigger:
- Click "Run workflow" button
- Select branch and version
- Workflow runs on demand

## Downloading Results

After workflow completes:

1. Go to **Actions** tab
2. Click on the workflow run
3. Scroll down to **"Artifacts"** section
4. Download:
   - `KonvertR-Windows-EXE` (Windows)
   - `KonvertR-macOS-App` (macOS)

## Summary

1. ✅ Commit workflow files to GitHub
2. ✅ Go to Actions tab
3. ✅ Click "Run workflow" (or wait for automatic trigger)
4. ✅ Download artifacts when complete

If you still don't see "Run workflow", make sure:
- Workflow files are pushed to GitHub
- You're looking at the Actions tab (not Settings)
- You're on the correct repository
