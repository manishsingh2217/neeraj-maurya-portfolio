# Project Guidelines & Rules

## Automatic Git Workflow on Approval
Whenever the user reviews and approves code changes (e.g., says "looks good", "push it", "push to github", "approved", or confirms changes are verified), immediately:
1. Stage all updated files (`git add .`).
2. Create a clean, descriptive commit describing the changes made (`git commit -m "..."`).
3. Push the commit to the GitHub remote repository (`git push origin main`).
4. Provide the user with the commit summary and link to the updated GitHub repository.
