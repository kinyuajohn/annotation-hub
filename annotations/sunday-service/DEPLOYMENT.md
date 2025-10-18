# Deployment Instructions

      ## Your Annotation: Sunday Service.html

      ### Files to Upload:
      - `index.html` - Your annotation with social media tags
      - `preview.jpg` - Generated preview image

      ### Folder Structure on GitHub:
      ```
      your-repo/
      └── annotations/
          └── sunday-service/
              ├── index.html
              └── preview.jpg
      ```

      ### Git Commands:
      ```bash
      # Navigate to your repository
      cd your-repo-name

      # Create the folder and add files
      mkdir -p annotations/sunday-service
      cp sunday-service/* annotations/sunday-service/

      # Commit and push
      git add annotations/sunday-service/
      git commit -m "Add annotation: sunday-service"
      git push origin main
      ```

      ### Your Annotation URL:
      https://kinyuajohn.github.io/annotation-hub/annotations/sunday-service

      ### Preview  Image URL (test this!):
      https://kinyuajohn.github.io/annotation-hub/annotations/sunday-servicepreview.jpg

      ### Test Social Media Preview:
      1. Wait 5 minutes after pushing to GitHub
      2. Share this URL: https://kinyuajohn.github.io/annotation-hub/annotations/sunday-service
      3. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/
      4. Test with Twitter Validator: https://cards-dev.twitter.com/validator

      ### Troubleshooting:
      - If preview doesn't show, check that `preview.jpg` exists at: https://kinyuajohn.github.io/annotation-hub/annotations/sunday-servicepreview.jpg
      - Facebook caches images - use the debugger to "Scrape Again"
      - Ensure all files are in the correct folder structure
      