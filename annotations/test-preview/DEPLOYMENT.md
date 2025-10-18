# Deployment Instructions

      ## Your Annotation: Sunday Service.html

      ### Files to Upload:
      - `index.html` - Your annotation with social media tags
      - `preview.jpg` - Custom uploaded image (736×920)

      ### Image Details:
      - **Dimensions:** 736 × 920 pixels
      - **Aspect Ratio:** 4:5

      ### Preview Image:
      ✅ Using your original image with preserved dimensions

      ### Folder Structure on GitHub:
      ```
      your-repo/
      └── annotations/
          └── test-preview/
              ├── index.html
              └── preview.jpg
      ```

      ### Git Commands:
      ```bash
      # Navigate to your repository
      cd your-repo-name

      # Create the folder and add files
      mkdir -p annotations/test-preview
      cp test-preview/* annotations/test-preview/

      # Commit and push
      git add annotations/test-preview/
      git commit -m "Add annotation: test-preview"
      git push origin main
      ```

      ### Your Annotation URL:
      https://kinyuajohn.github.io/annotation-hub/annotations/test-preview

      ### Preview Image URL:
      https://kinyuajohn.github.io/annotation-hub/annotations/test-preview/preview.jpg

      ### Test Social Media Preview:
      1. Wait 5 minutes after pushing to GitHub
      2. Share: https://kinyuajohn.github.io/annotation-hub/annotations/test-preview
      3. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/
      